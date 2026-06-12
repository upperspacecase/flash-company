import { COHORT, draftFromVenture, type SynthesisData, type OpportunityData } from "@/app/demo/data";
import { DEMO_TEAM_ID, DEMO_INTAKES } from "@/lib/demo-seed";
import { synthesizeTeam } from "@/lib/synthesis";
import { generateOpportunity } from "@/lib/opportunity";
import { advanceVenture, type VentureBuildState } from "@/lib/ventures";
import {
  getSynthesis, getOpportunity, getVentures, getVentureDraft,
  saveSynthesis, saveOpportunity, saveVentures, saveVentureDraft,
  getVentureBuild, saveVentureBuild, resetVentureData,
} from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 800;

// GET: what's seeded so far, incl. staged venture-build progress (cheap — no generation).
export async function GET() {
  const [s, o, v, d, b] = await Promise.all([
    getSynthesis(DEMO_TEAM_ID).catch(() => null),
    getOpportunity(DEMO_TEAM_ID).catch(() => null),
    getVentures(DEMO_TEAM_ID).catch(() => null),
    getVentureDraft(DEMO_TEAM_ID).catch(() => null),
    getVentureBuild(DEMO_TEAM_ID).catch(() => null),
  ]);
  const bs = (b as VentureBuildState | null) ?? {};
  return Response.json({ synthesis: !!s, opportunity: !!o, ventures: !!v, draft: !!d, build: { brief: !!bs.brief, briefLen: (bs.brief ?? "").trim().length, core: !!bs.core, plan: !!bs.plan } });
}

// POST: run the real sprint pipeline over the demo team's intakes and persist it
// under DEMO_TEAM_ID. Staged and resumable — each call does the next missing step
// (so no single call exceeds the function limit). POST until { complete: true }.
// POST ?force=1 to regenerate synthesis from scratch.
export async function POST(req: Request) {
  const url = new URL(req.url);
  // Clear the generated opportunity + venture (keep synthesis) for a fresh re-seed.
  if (url.searchParams.get("reset") === "1") {
    await resetVentureData(DEMO_TEAM_ID);
    return Response.json({ reset: true });
  }
  const force = url.searchParams.get("force") === "1";

  const synthesis = force ? null : ((await getSynthesis(DEMO_TEAM_ID).catch(() => null)) as SynthesisData | null);
  if (!synthesis) {
    const s = await synthesizeTeam(DEMO_INTAKES);
    await saveSynthesis(DEMO_TEAM_ID, s);
    return Response.json({ step: "synthesis", next: "POST again for opportunity" });
  }

  const opportunity = (await getOpportunity(DEMO_TEAM_ID).catch(() => null)) as OpportunityData | null;
  if (!opportunity) {
    const o = await generateOpportunity(synthesis);
    await saveOpportunity(DEMO_TEAM_ID, o);
    return Response.json({ step: "opportunity", spaces: o.spaces.length, next: "POST again for ventures" });
  }

  const ventures = await getVentures(DEMO_TEAM_ID).catch(() => null);
  if (!ventures) {
    // Build the venture one step at a time (research -> core -> plan -> lenses).
    const state = ((await getVentureBuild(DEMO_TEAM_ID).catch(() => null)) as VentureBuildState | null) ?? {};
    const step = await advanceVenture(synthesis, opportunity, state);
    if (step.done && step.ventures) {
      await saveVentures(DEMO_TEAM_ID, step.ventures);
      if (step.ventures[0]) await saveVentureDraft(DEMO_TEAM_ID, draftFromVenture(step.ventures[0], COHORT));
      return Response.json({ step: `venture:${step.stage}`, venture: step.ventures[0]?.name ?? null, complete: true });
    }
    await saveVentureBuild(DEMO_TEAM_ID, step.state);
    return Response.json({ step: `venture:${step.stage}`, next: "POST again for the next venture step" });
  }

  return Response.json({ seeded: true, complete: true });
}
