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
} from "@/lib/db";
import { SPRINT, type OpportunityData, type SynthesisData, type Venture } from "@/app/demo/data";
import { paymentConfigured } from "@/lib/stripe";
import { JoinGate } from "./join-gate";
import { LiveWorkspace } from "./live-workspace";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const team = await getTeamByToken(token);
  if (!team) notFound();

  const c = await cookies();
  const meId = c.get("fc_member")?.value;
  const me = meId ? await getMemberRow(meId) : null;

  // No member for this browser+team yet → join (sets cookie) then re-render.
  if (!me || me.team_id !== team.id) {
    return <JoinGate token={token} />;
  }

  const [members, myIntake, synth, opp, vents] = await Promise.all([
    getTeamMembers(team.id),
    getIntake(me.id),
    getSynthesis(team.id),
    getOpportunity(team.id),
    getVentures(team.id),
  ]);
  const accepted = members.filter((m) => m.accepted);
  const allComplete = accepted.length >= 2 && accepted.every((m) => m.intake_complete);
  // The 48-hour window runs from when the host starts the Flash.
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
      windowEndsAt={windowEndsAt}
      paymentEnabled={paymentConfigured()}
    />
  );
}
