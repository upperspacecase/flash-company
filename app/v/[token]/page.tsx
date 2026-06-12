import { notFound } from "next/navigation";
import { getTeamByToken, getVentureDraft, getVentures } from "@/lib/db";
import { DEMO_TEAM_ID } from "@/lib/demo-seed";
import type { Venture, VentureDraft } from "@/app/demo/data";
import { PublicLanding } from "./public-landing";

export const dynamic = "force-dynamic";

// The published venture landing page. Live only once the team hits Publish in
// Validation (which persists published + landing on the draft). /v/demo serves
// the demo team's landing.
export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const teamId = token === "demo" ? DEMO_TEAM_ID : ((await getTeamByToken(token))?.id ?? null);
  if (!teamId) notFound();

  const [draft, vents] = await Promise.all([getVentureDraft(teamId), getVentures(teamId)]);
  const d = draft as VentureDraft | null;
  if (!d?.published || !d.landing) notFound(); // not published yet

  const name = (vents as Venture[] | null)?.[0]?.name ?? "This venture";
  return <PublicLanding token={token} name={name} landing={d.landing} />;
}
