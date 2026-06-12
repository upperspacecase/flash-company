"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createTeamRow,
  getTeamByToken,
  getTeamById,
  createMemberRow,
  getMemberRow,
  getTeamMembers,
  setMemberAccepted,
  upsertIntake,
  getTeamIntakes,
  getSynthesis,
  saveSynthesis,
  getOpportunity,
  saveOpportunity,
  getVentures,
  saveVentures,
  saveVentureDraft,
  getVentureBuild,
  saveVentureBuild,
  saveMemberRanking,
  getTeamRankings,
  saveVentureRating,
  getTeamRatings,
  setMemberPayment,
  type MemberRow,
} from "@/lib/db";
import { consensusItems, ratingOrder } from "@/lib/consensus";
import { synthesizeTeam } from "@/lib/synthesis";
import { generateOpportunity } from "@/lib/opportunity";
import { advanceVenture, type VentureBuildState } from "@/lib/ventures";
import { emailConfigured, sendEmail, synthesisReadyEmail, teammateFinishedEmail } from "@/lib/email";
import { getStripe } from "@/lib/stripe";
import { PRICE, type OpportunityData, type SynthesisData, type Venture, type VentureDraft } from "@/app/demo/data";

const COOKIE = "fc_member";
// Smallest real team (the product is "you and up to two others").
const MIN_TEAM = 2;

async function setMemberCookie(id: string) {
  const c = await cookies();
  c.set(COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

async function currentMember(): Promise<MemberRow | null> {
  const c = await cookies();
  const id = c.get(COOKIE)?.value;
  if (!id) return null;
  return getMemberRow(id);
}

// Host starts a Flash: create the team + host member, set the cookie, go to the
// real shareable workspace.
export async function createTeam(): Promise<void> {
  const team = await createTeamRow("full");
  const host = await createMemberRow(team.id, true);
  await setMemberCookie(host.id);
  redirect(`/s/${team.token}`);
}

// A real person opens the invite link: become a member of this team (if not
// already), set the cookie. Called by JoinGate on first visit.
export async function joinTeam(token: string): Promise<void> {
  const team = await getTeamByToken(token);
  if (!team) return;
  const existing = await currentMember();
  if (existing && existing.team_id === team.id) return;
  const roster = await getTeamMembers(team.id);
  if (roster.length >= 3) return; // Flash is full (capped at 3)
  const member = await createMemberRow(team.id, false);
  await setMemberCookie(member.id);
}

export async function acceptInvite(): Promise<void> {
  const m = await currentMember();
  if (m) await setMemberAccepted(m.id);
}

// Real payment (only used when Stripe keys are set). Charge the buy-in now via
// embedded Checkout; the client confirms with confirmAccept after completion.
export async function createAcceptCheckout(): Promise<{ clientSecret: string; sessionId: string }> {
  const m = await currentMember();
  if (!m) throw new Error("Not in a team.");
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded_page",
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: PRICE.currency === "€" ? "eur" : "usd",
          unit_amount: PRICE.perPerson * 100,
          product_data: { name: "Flash Company buy-in" },
        },
        quantity: 1,
      },
    ],
    redirect_on_completion: "never",
    metadata: { memberId: m.id, teamId: m.team_id },
  });
  if (!session.client_secret) throw new Error("Stripe did not return a client secret.");
  return { clientSecret: session.client_secret, sessionId: session.id };
}

// Server-verify the payment, then mark accepted. Don't trust the client.
export async function confirmAccept(sessionId: string): Promise<boolean> {
  const m = await currentMember();
  if (!m) return false;
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const paid = session.payment_status === "paid" || session.payment_status === "no_payment_required";
  if (!paid) return false;
  await setMemberPayment(m.id, sessionId, session.payment_status);
  await setMemberAccepted(m.id);
  return true;
}

export async function saveIntake(answers: Record<string, unknown>, complete: boolean): Promise<void> {
  const m = await currentMember();
  if (!m) return;
  const name = typeof answers?.name === "string" ? (answers.name as string) : undefined;
  const email = typeof answers?.email === "string" ? (answers.email as string) : undefined;
  await upsertIntake(m.id, m.team_id, answers, complete, { name, email });
  if (complete) await notifyTeammateFinished(m.team_id, m.id, name);
}

// Nudge the teammates still working when someone finishes their input.
async function notifyTeammateFinished(teamId: string, finishedId: string, name?: string): Promise<void> {
  if (!emailConfigured()) return;
  const [team, members] = await Promise.all([getTeamById(teamId), getTeamMembers(teamId)]);
  if (!team) return;
  const accepted = members.filter((x) => x.accepted);
  const done = accepted.filter((x) => x.intake_complete).length;
  const waiting = accepted.filter((x) => x.id !== finishedId && x.email && !x.intake_complete);
  await Promise.all(waiting.map((x) => {
    const { subject, html } = teammateFinishedEmail(team.token, x.id, name || "A teammate", done, accepted.length);
    return sendEmail(x.email, subject, html);
  }));
}

// Let the whole team know synthesis has been generated.
async function notifySynthesisReady(teamId: string): Promise<void> {
  if (!emailConfigured()) return;
  const [team, members] = await Promise.all([getTeamById(teamId), getTeamMembers(teamId)]);
  if (!team) return;
  await Promise.all(members.filter((x) => x.email).map((x) => {
    const { subject, html } = synthesisReadyEmail(team.token, x.id);
    return sendEmail(x.email, subject, html);
  }));
}

// Run (or return cached) synthesis. Normally gated on the whole team's intake
// being in; the host may force it through with at least the minimum team,
// leaving a non-responsive member behind. Re-checked server-side.
export async function runSynthesis(force = false): Promise<SynthesisData> {
  const m = await currentMember();
  if (!m) throw new Error("Not in a team.");

  const cached = await getSynthesis(m.team_id);
  if (cached) return cached as SynthesisData;

  const members = await getTeamMembers(m.team_id);
  const accepted = members.filter((x) => x.accepted);
  const complete = accepted.filter((x) => x.intake_complete);
  const hostForce = force && m.is_host;
  const ready = complete.length >= MIN_TEAM && (hostForce || complete.length >= accepted.length);
  if (!ready) {
    throw new Error("Synthesis runs once everyone's input is in.");
  }

  const intakes = await getTeamIntakes(m.team_id);
  const data = await synthesizeTeam(
    intakes.map((r) => ({ memberId: r.member_id, answers: (r.answers ?? {}) as Record<string, unknown> })),
  );
  await saveSynthesis(m.team_id, data);
  await notifySynthesisReady(m.team_id);
  return data;
}

// The team confirmed/edited Synthesis — persist it as the source of truth that
// the Opportunity step generates from.
export async function confirmSynthesis(data: SynthesisData): Promise<void> {
  const m = await currentMember();
  if (!m) return;
  await saveSynthesis(m.team_id, data);
  // This member's ranking = the order they left the lists in. Aggregated across
  // the team in runOpportunity to drive venture generation.
  await saveMemberRanking(m.team_id, m.id, {
    problems: data.problems.map((p) => p.id),
    obsessions: data.obsessions.map((o) => o.id),
    markets: data.markets.map((k) => k.id),
  });
}

// Reorder the synthesis lists by the team's consensus ranking (Borda) so the
// generation works from what the team agreed matters most.
function applyConsensus(s: SynthesisData, rankings: { memberId: string; data: unknown }[]): SynthesisData {
  const orders = (cat: "problems" | "obsessions" | "markets") =>
    rankings.map((r) => (r.data as Record<string, string[]> | null)?.[cat] ?? []).filter((a) => a.length > 0);
  return {
    ...s,
    problems: consensusItems(s.problems, orders("problems")),
    obsessions: consensusItems(s.obsessions, orders("obsessions")),
    markets: consensusItems(s.markets, orders("markets")),
  };
}

// Generate (or return cached) the Opportunity page from the confirmed synthesis:
// spaces + lenses (Claude) and PESTLE grounded by live web search.
export async function runOpportunity(): Promise<OpportunityData> {
  const m = await currentMember();
  if (!m) throw new Error("Not in a team.");

  const cached = await getOpportunity(m.team_id);
  if (cached) return cached as OpportunityData;

  const synthesis = await getSynthesis(m.team_id);
  if (!synthesis) throw new Error("Confirm your synthesis first.");

  // Aggregate every member's ranking into the team consensus that drives generation.
  const rankings = await getTeamRankings(m.team_id);
  const consensus = applyConsensus(synthesis as SynthesisData, rankings);

  const data = await generateOpportunity(consensus);
  await saveOpportunity(m.team_id, data);
  return data;
}

// Birth the venture in small steps (research -> core -> market & money -> lenses),
// one per call, so each fits a serverless invocation. The client calls this in a
// loop until { done: true }, persisting the accumulating build state server-side.
export async function runVentureStep(): Promise<{ stage: string; done: boolean; ventures?: Venture[] }> {
  const m = await currentMember();
  if (!m) throw new Error("Not in a team.");

  const cached = await getVentures(m.team_id);
  if (cached) return { stage: "done", done: true, ventures: cached as Venture[] };

  const [synthesis, opportunity, ratings] = await Promise.all([getSynthesis(m.team_id), getOpportunity(m.team_id), getTeamRatings(m.team_id)]);
  if (!synthesis || !opportunity) throw new Error("Agree your opportunity first.");

  // The venture the team is most convicted on (summed 1-10 conviction) — that's
  // the one we build. No separate "pick" step; the ratings decide it.
  const spaces = (opportunity as OpportunityData).spaces;
  const ratingMaps = ratings.map((r) => (r.data as Record<string, number> | null) ?? {});
  const winnerId = ratingOrder(spaces.map((s) => s.id), ratingMaps)[0]?.id ?? spaces[0]?.id;

  const state = ((await getVentureBuild(m.team_id)) as VentureBuildState | null) ?? {};
  const step = await advanceVenture(synthesis as SynthesisData, opportunity as OpportunityData, state, winnerId);
  if (step.done && step.ventures) {
    await saveVentures(m.team_id, step.ventures);
    return { stage: step.stage, done: true, ventures: step.ventures };
  }
  await saveVentureBuild(m.team_id, step.state);
  return { stage: step.stage, done: false };
}

// Save this member's conviction ratings (venture id -> 1-10). Aggregated in
// runVentureStep to pick the venture the team builds.
export async function saveRatings(ratings: Record<string, number>): Promise<void> {
  const m = await currentMember();
  if (!m) return;
  await saveVentureRating(m.team_id, m.id, ratings);
}

// Persist the team's edits to the working venture draft (the editable venture page).
export async function saveDraft(draft: VentureDraft): Promise<void> {
  const m = await currentMember();
  if (!m) return;
  await saveVentureDraft(m.team_id, draft);
}
