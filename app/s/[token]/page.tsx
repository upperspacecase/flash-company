import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import {
  getTeamByToken,
  getMemberRow,
  getTeamMembers,
  getIntake,
  getSynthesis,
  getOpportunity,
  getVentures,
  getVentureDraft,
} from "@/lib/db";
import { SPRINT, type OpportunityData, type SynthesisData, type Venture, type VentureDraft } from "@/app/demo/data";
import { paymentConfigured } from "@/lib/stripe";
import { JoinGate } from "./join-gate";
import { LiveWorkspace } from "./live-workspace";

export const dynamic = "force-dynamic";
// The live sprint runs the LLM pipeline (synthesis / opportunity / venture) as
// server actions dispatched from this page — give them room past the default.
export const maxDuration = 800;

export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const team = await getTeamByToken(token);
  if (!team) notFound();

  const c = await cookies();
  const meId = c.get("fc_member")?.value;
  const me = meId ? await getMemberRow(meId) : null;

  // The 48-hour window runs from when the host starts the Flash. Once it's closed,
  // new people can no longer join — but existing seat-holders can still get back
  // in (resume link) to review what the team built.
  const windowExpired = Date.now() >= new Date(team.created_at).getTime() + SPRINT.windowHours * 3_600_000;

  // No member for this browser+team yet → show the join gate. It claims a seat by
  // email (reclaiming an existing one if this person already joined), so the cap
  // is enforced there, per person, rather than per click.
  if (!me || me.team_id !== team.id) {
    const roster = await getTeamMembers(team.id);
    const inviterName = roster.find((m) => m.is_host)?.name ?? null;
    return <JoinGate token={token} plan={team.plan === "free" ? "free" : "full"} inviterName={inviterName} expired={windowExpired} />;
  }

  const [members, myIntake, synth, opp, vents, draft] = await Promise.all([
    getTeamMembers(team.id),
    getIntake(me.id),
    getSynthesis(team.id),
    getOpportunity(team.id),
    getVentures(team.id),
    getVentureDraft(team.id),
  ]);
  const accepted = members.filter((m) => m.accepted);
  const allComplete = accepted.length >= 2 && accepted.every((m) => m.intake_complete);
  const windowEndsAt = new Date(new Date(team.created_at).getTime() + SPRINT.windowHours * 3_600_000).toISOString();

  return (
    <LiveWorkspace
      token={token}
      plan={team.plan === "free" ? "free" : "full"}
      meId={me.id}
      accepted={me.accepted}
      initialAnswers={(myIntake?.answers as Record<string, unknown>) ?? {}}
      teamIntakeComplete={allComplete}
      status={members.map((m) => ({ id: m.id, name: m.name, accepted: m.accepted, intakeComplete: m.intake_complete }))}
      synthesis={(synth as SynthesisData | null) ?? null}
      opportunity={(opp as OpportunityData | null) ?? null}
      ventures={(vents as Venture[] | null) ?? null}
      initialDraft={(draft as VentureDraft | null) ?? null}
      windowEndsAt={windowEndsAt}
      isHost={me.is_host}
      paymentEnabled={paymentConfigured()}
    />
  );
}
