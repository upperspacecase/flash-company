import { getTeamByToken, saveVentureSignup } from "@/lib/db";
import { DEMO_TEAM_ID } from "@/lib/demo-seed";

export const dynamic = "force-dynamic";

// A signup from a published venture landing page (/v/[token]).
export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const teamId = token === "demo" ? DEMO_TEAM_ID : (await getTeamByToken(token))?.id;
  if (!teamId) return Response.json({ ok: false }, { status: 404 });
  const body = (await req.json().catch(() => null)) as { email?: string } | null;
  const email = body?.email?.trim().toLowerCase();
  if (!email || !email.includes("@")) return Response.json({ ok: false }, { status: 400 });
  await saveVentureSignup(teamId, email);
  return Response.json({ ok: true });
}
