"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createTeamRow,
  getTeamByToken,
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
  setMemberPayment,
  type MemberRow,
} from "@/lib/db";
import { synthesizeTeam } from "@/lib/synthesis";
import { generateOpportunity } from "@/lib/opportunity";
import { generateVentures } from "@/lib/ventures";
import { getStripe } from "@/lib/stripe";
import { PRICE, type OpportunityData, type SynthesisData, type Venture } from "@/app/demo/data";

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
  await upsertIntake(m.id, m.team_id, answers, complete, { name });
}

// Run (or return cached) synthesis. Gated on the whole team's intake being in —
// re-checked server-side so it can't be forced early from the client.
export async function runSynthesis(): Promise<SynthesisData> {
  const m = await currentMember();
  if (!m) throw new Error("Not in a team.");

  const cached = await getSynthesis(m.team_id);
  if (cached) return cached as SynthesisData;

  const members = await getTeamMembers(m.team_id);
  const accepted = members.filter((x) => x.accepted);
  const complete = accepted.filter((x) => x.intake_complete);
  if (accepted.length < MIN_TEAM || complete.length < accepted.length) {
    throw new Error("Synthesis runs once everyone's input is in.");
  }

  const intakes = await getTeamIntakes(m.team_id);
  const data = await synthesizeTeam(
    intakes.map((r) => ({ memberId: r.member_id, answers: (r.answers ?? {}) as Record<string, unknown> })),
  );
  await saveSynthesis(m.team_id, data);
  return data;
}

// The team confirmed/edited Synthesis — persist it as the source of truth that
// the Opportunity step generates from.
export async function confirmSynthesis(data: SynthesisData): Promise<void> {
  const m = await currentMember();
  if (!m) return;
  await saveSynthesis(m.team_id, data);
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

  const data = await generateOpportunity(synthesis as SynthesisData);
  await saveOpportunity(m.team_id, data);
  return data;
}

// Generate (or return cached) the candidate ventures, born from the confirmed
// synthesis + agreed opportunity.
export async function runVentures(): Promise<Venture[]> {
  const m = await currentMember();
  if (!m) throw new Error("Not in a team.");

  const cached = await getVentures(m.team_id);
  if (cached) return cached as Venture[];

  const [synthesis, opportunity] = await Promise.all([getSynthesis(m.team_id), getOpportunity(m.team_id)]);
  if (!synthesis || !opportunity) throw new Error("Agree your opportunity first.");

  const data = await generateVentures(synthesis as SynthesisData, opportunity as OpportunityData);
  await saveVentures(m.team_id, data);
  return data;
}
