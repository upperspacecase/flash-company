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
  type MemberRow,
} from "@/lib/db";
import { synthesizeTeam } from "@/lib/synthesis";
import type { SynthesisData } from "@/app/demo/data";

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
