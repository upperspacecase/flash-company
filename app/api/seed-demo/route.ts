import { COHORT, draftFromVenture, type SynthesisData, type OpportunityData } from "@/app/demo/data";
import { DEMO_TEAM_ID, DEMO_INTAKES } from "@/lib/demo-seed";
import { synthesizeTeam } from "@/lib/synthesis";
import { generateOpportunity } from "@/lib/opportunity";
import { generateVentures } from "@/lib/ventures";
import {
  getSynthesis, getOpportunity, getVentures, getVentureDraft,
  saveSynthesis, saveOpportunity, saveVentures, saveVentureDraft,
} from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 800;

// GET: what's seeded so far (cheap — no generation).
export async function GET() {
  const [s, o, v, d] = await Promise.all([
    getSynthesis(DEMO_TEAM_ID).catch(() => null),
    getOpportunity(DEMO_TEAM_ID).catch(() => null),
    getVentures(DEMO_TEAM_ID).catch(() => null),
    getVentureDraft(DEMO_TEAM_ID).catch(() => null),
  ]);
  return Response.json({ synthesis: !!s, opportunity: !!o, ventures: !!v, draft: !!d });
}

// POST: run the real sprint pipeline over the demo team's intakes and persist it
// under DEMO_TEAM_ID. Staged and resumable — each call does the next missing step
// (so no single call exceeds the function limit). POST until { complete: true }.
// POST ?force=1 to regenerate synthesis from scratch.
export async function POST(req: Request) {
  const force = new URL(req.url).searchParams.get("force") === "1";

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
    const v = await generateVentures(synthesis, opportunity);
    await saveVentures(DEMO_TEAM_ID, v);
    if (v[0]) await saveVentureDraft(DEMO_TEAM_ID, draftFromVenture(v[0], COHORT));
    return Response.json({ step: "ventures", venture: v[0]?.name ?? null, complete: true });
  }

  return Response.json({ seeded: true, complete: true });
}
