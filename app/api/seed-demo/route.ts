import { COHORT, draftFromVenture } from "@/app/demo/data";
import { DEMO_TEAM_ID, DEMO_INTAKES } from "@/lib/demo-seed";
import { synthesizeTeam } from "@/lib/synthesis";
import { generateOpportunity } from "@/lib/opportunity";
import { generateVentures } from "@/lib/ventures";
import { getSynthesis, saveSynthesis, saveOpportunity, saveVentures, saveVentureDraft } from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

// One-time (idempotent) demo seed: run the real sprint pipeline over the demo
// team's intakes and persist synthesis / opportunity / ventures / draft under
// DEMO_TEAM_ID so /demo shows a real generated sprint. POST ?force=1 to redo.
export async function POST(req: Request) {
  const force = new URL(req.url).searchParams.get("force") === "1";
  const existing = await getSynthesis(DEMO_TEAM_ID).catch(() => null);
  if (existing && !force) {
    return Response.json({ seeded: true, skipped: "already seeded — POST ?force=1 to regenerate" });
  }

  try {
    const synthesis = await synthesizeTeam(DEMO_INTAKES);
    await saveSynthesis(DEMO_TEAM_ID, synthesis);

    const opportunity = await generateOpportunity(synthesis);
    await saveOpportunity(DEMO_TEAM_ID, opportunity);

    const ventures = await generateVentures(synthesis, opportunity);
    await saveVentures(DEMO_TEAM_ID, ventures);

    if (ventures[0]) await saveVentureDraft(DEMO_TEAM_ID, draftFromVenture(ventures[0], COHORT));

    return Response.json({
      seeded: true,
      spaces: opportunity.spaces.length,
      venture: ventures[0]?.name ?? null,
    });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
