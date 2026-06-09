import { getTeamByToken, getTeamMembers } from "@/lib/db";

export const dynamic = "force-dynamic";

// Polled by the live workspace so teammates accepting / finishing flow in and
// Synthesis unlocks once everyone's intake is complete.
export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const team = await getTeamByToken(token);
  if (!team) return Response.json({ members: [], allComplete: false }, { status: 404 });

  const members = await getTeamMembers(team.id);
  const accepted = members.filter((m) => m.accepted);
  const allComplete = accepted.length >= 2 && accepted.every((m) => m.intake_complete);

  return Response.json({
    members: members.map((m) => ({
      id: m.id,
      name: m.name,
      accepted: m.accepted,
      intakeComplete: m.intake_complete,
    })),
    allComplete,
  });
}
