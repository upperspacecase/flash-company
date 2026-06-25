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
  setMemberIdentity,
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
import { emailConfigured, sendEmail, invitedToStartInputEmail, resumeLinkEmail, synthesisReadyEmail, teammateFinishedEmail } from "@/lib/email";
import { getStripe, paymentConfigured } from "@/lib/stripe";
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

type Identity = { name?: string; email?: string };

// A Flash holds three people: the host (seat one) plus up to two teammates.
const TEAM_CAP = 3;
export type JoinResult = "ok" | "full" | "notfound" | "exists";

// A real person opens the shared invite link and enters their name + email. One
// seat per email: if this address is already in the Flash — host or teammate — we
// never add a second row, we email that person their link back in and report
// "exists". Returning is always by emailed link, so a seat (or the host's) can't
// be taken just by typing someone's address here. A genuinely new email claims a
// seat; on the free plan (or with Stripe off) entering it also accepts, so it's
// one screen — otherwise the seat is held and they pay at the in-app gate.
export async function joinTeam(token: string, identity: { name: string; email: string }): Promise<JoinResult> {
  const team = await getTeamByToken(token);
  if (!team) return "notfound";
  const existing = await currentMember();
  if (existing && existing.team_id === team.id) return "ok"; // already in this team
  const roster = await getTeamMembers(team.id);
  const email = identity.email.trim().toLowerCase();

  // Already in this Flash → email them their link back; never duplicate the seat.
  const present = roster.find((m) => (m.email ?? "").toLowerCase() === email);
  if (present?.email) {
    await sendResumeLink(team.token, present);
    return "exists";
  }

  // New person. Capacity counts distinct teammate emails; the host holds seat one.
  const teammateEmails = new Set(roster.filter((m) => !m.is_host && m.email).map((m) => m.email!.toLowerCase()));
  if (teammateEmails.size >= TEAM_CAP - 1) return "full";

  const noCharge = team.plan === "free" || !paymentConfigured();
  const member = await createMemberRow(team.id, false);
  await setMemberIdentity(member.id, identity);
  await setMemberCookie(member.id);
  if (noCharge) await acceptMember(member, identity);
  return "ok";
}

// Persist the name + email, mark accepted, and (on the acceptance that forms the
// team) email both members. Shared by the free join, the in-app accept, and the
// paid confirm so there's one acceptance path.
async function acceptMember(member: MemberRow, identity?: Identity): Promise<void> {
  if (identity) await setMemberIdentity(member.id, identity);
  if (!member.accepted) {
    await setMemberAccepted(member.id);
    await maybeNotifyTeamFormed(member.team_id);
  }
}

// Email a member their personal link back into their seat — the one way back in.
async function sendResumeLink(token: string, member: MemberRow): Promise<void> {
  if (!member.email) return;
  const { subject, html } = resumeLinkEmail(token, member.id);
  await sendEmail(member.email, subject, html);
}

// Returning on a new browser/device: the shared invite link is the only link,
// so re-entering the email you joined with is how you get back. We email that
// person (host or teammate) their personal resume link rather than binding the
// seat on the spot — only the inbox owner can resume, so no one can grab a seat
// (or the host's) just by typing an email on the shared link. Always resolves
// the same way so it can't be used to probe who's in a Flash.
export async function requestResumeLink(token: string, email: string): Promise<void> {
  const target = email.trim().toLowerCase();
  if (!target) return;
  const team = await getTeamByToken(token);
  if (!team) return;
  const roster = await getTeamMembers(team.id);
  const member = roster.find((m) => (m.email ?? "").toLowerCase() === target);
  if (member) await sendResumeLink(team.token, member);
}

// In-app accept (the host's gate, and the paid plan's pre-payment gate).
export async function acceptInvite(identity?: Identity): Promise<void> {
  const m = await currentMember();
  if (!m) return;
  await acceptMember(m, identity);
}

// The team "forms" the moment a second person accepts. At that transition, email
// both of them inviting them to start their input.
async function maybeNotifyTeamFormed(teamId: string): Promise<void> {
  if (!emailConfigured()) return;
  const [team, members] = await Promise.all([getTeamById(teamId), getTeamMembers(teamId)]);
  if (!team) return;
  const accepted = members.filter((x) => x.accepted);
  if (accepted.length !== 2) return;
  await Promise.all(accepted.filter((x) => x.email).map((x) => {
    const { subject, html } = invitedToStartInputEmail(team.token, x.id);
    return sendEmail(x.email, subject, html);
  }));
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
    // Let buyers redeem promo codes (e.g. FLASH50, FLASH100TY) at checkout.
    allow_promotion_codes: true,
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
export async function confirmAccept(sessionId: string, identity?: Identity): Promise<boolean> {
  const m = await currentMember();
  if (!m) return false;
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const paid = session.payment_status === "paid" || session.payment_status === "no_payment_required";
  if (!paid) return false;
  await setMemberPayment(m.id, sessionId, session.payment_status);
  await acceptMember(m, identity);
  return true;
}

export async function saveIntake(answers: Record<string, unknown>, complete: boolean): Promise<void> {
  const m = await currentMember();
  if (!m) return;
  // Name and email are captured at accept time; the intake no longer carries them.
  await upsertIntake(m.id, m.team_id, answers, complete, {});
  if (complete) await notifyTeammateFinished(m.team_id, m.id, m.name ?? undefined);
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
  const nameById = new Map(members.map((x) => [x.id, x.name]));
  const data = await synthesizeTeam(
    intakes.map((r) => ({ memberId: r.member_id, name: nameById.get(r.member_id) ?? undefined, answers: (r.answers ?? {}) as Record<string, unknown> })),
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
