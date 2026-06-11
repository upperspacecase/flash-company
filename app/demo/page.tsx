import { DemoWorkspace, type DemoSeed } from "./workspace";
import { getSynthesis, getOpportunity, getVentures, getVentureDraft } from "@/lib/db";
import { DEMO_TEAM_ID } from "@/lib/demo-seed";
import type { SynthesisData, OpportunityData, Venture, VentureDraft } from "@/app/demo/data";

export const dynamic = "force-dynamic";

// Feed the demo with the real, pipeline-generated sprint persisted under the demo
// team (seeded via POST /api/seed-demo). If the DB is unseeded or unreachable,
// `seed` is null and the workspace falls back to its authored mocks.
export default async function Page() {
  let seed: DemoSeed | null = null;
  try {
    const [synthesis, opportunity, ventures, draft] = await Promise.all([
      getSynthesis(DEMO_TEAM_ID),
      getOpportunity(DEMO_TEAM_ID),
      getVentures(DEMO_TEAM_ID),
      getVentureDraft(DEMO_TEAM_ID),
    ]);
    if (synthesis || opportunity || ventures || draft) {
      seed = {
        synthesis: (synthesis as SynthesisData | null) ?? null,
        opportunity: (opportunity as OpportunityData | null) ?? null,
        ventures: (ventures as Venture[] | null) ?? null,
        draft: (draft as VentureDraft | null) ?? null,
      };
    }
  } catch {
    // No DB / not seeded — the demo uses its authored mocks.
  }
  return <DemoWorkspace plan="full" seed={seed} />;
}
