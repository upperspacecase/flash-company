import { getTeamByToken, getTeamMembers, getTeamRankings, getTeamRatings } from "@/lib/db";

export const dynamic = "force-dynamic";

// Polled by the live workspace so teammates accepting / finishing flow in,
// Synthesis unlocks once everyone's intake is complete, and Ventures unlocks once
// everyone has submitted their synthesis ranking.
export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const team = await getTeamByToken(token);
  if (!team) return Response.json({ members: [], allComplete: false }, { status: 404 });

  const [members, rankings, ratings] = await Promise.all([getTeamMembers(team.id), getTeamRankings(team.id), getTeamRatings(team.id)]);
  const rankedIds = new Set(rankings.map((r) => r.memberId));
  const ratedIds = new Set(ratings.map((r) => r.memberId));
  const accepted = members.filter((m) => m.accepted);
  const allComplete = accepted.length >= 2 && accepted.every((m) => m.intake_complete);

  return Response.json({
    members: members.map((m) => ({
      id: m.id,
      name: m.name,
      accepted: m.accepted,
      intakeComplete: m.intake_complete,
      ranked: rankedIds.has(m.id),
      rated: ratedIds.has(m.id),
    })),
    allComplete,
  });
}
