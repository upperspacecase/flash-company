import { NextResponse } from "next/server";
import { getTeamByToken, getMemberRow } from "@/lib/db";

export const dynamic = "force-dynamic";

// Resume link: re-binds the fc_member cookie to an existing member, so losing a
// cookie (or switching device) doesn't strand you as a brand-new member. The
// member id is an unguessable UUID — same trust model as the invite link.
export async function GET(req: Request, { params }: { params: Promise<{ token: string; mid: string }> }) {
  const { token, mid } = await params;
  const dest = new URL(`/s/${token}`, req.url);
  const res = NextResponse.redirect(dest, 303);

  const team = await getTeamByToken(token);
  const member = team ? await getMemberRow(mid) : null;
  if (team && member && member.team_id === team.id) {
    res.cookies.set("fc_member", mid, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  return res;
}
