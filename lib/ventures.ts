import {
  type OpportunityData,
  type SynthesisData,
  type Venture,
} from "@/app/demo/data";
import { getAnthropic } from "@/lib/synthesis";

// Candidate ventures born from the team's confirmed synthesis + agreed
// opportunity. Same shape the Ventures phase already renders (Venture[]), keyed
// with stable ids and a single recommended pick. Mirrors lib/opportunity.ts.

const clamp = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, Math.round(Number.isFinite(n) ? n : lo)));

const VENT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    ventures: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          thesis: { type: "string" },
          problemScore: { type: "integer" },
          solution: { type: "string", enum: ["Painkiller", "Vitamin"] },
          market: { type: "string" },
          differentiation: { type: "string" },
          purpose: { type: "string" },
          unique: { type: "string" },
          earn: { type: "string" },
          spark: { type: "integer" },
          conviction: { type: "integer" },
          recommended: { type: "boolean" },
        },
        required: [
          "name", "thesis", "problemScore", "solution", "market",
          "differentiation", "purpose", "unique", "earn", "spark",
          "conviction", "recommended",
        ],
      },
    },
  },
  required: ["ventures"],
} as const;

type RawVenture = {
  name: string;
  thesis: string;
  problemScore: number;
  solution: string;
  market: string;
  differentiation: string;
  purpose: string;
  unique: string;
  earn: string;
  spark: number;
  conviction: number;
  recommended: boolean;
};

function context(synthesis: SynthesisData, opportunity: OpportunityData): string {
  const list = (xs: { text: string }[]) => xs.map((x) => `- ${x.text}`).join("\n");
  const topSpace = [...opportunity.spaces].sort((a, b) => b.votes - a.votes)[0]?.text;
  return [
    topSpace ? `Agreed opportunity space:\n${topSpace}` : "",
    `Lived problems:\n${list(synthesis.problems)}`,
    `Obsessions:\n${list(synthesis.obsessions)}`,
    `Target markets:\n${list(synthesis.markets)}`,
    `Roles: ${synthesis.roles.map((r) => r.role).join(", ")}`,
    `Network: ${synthesis.network.map((n) => `${n.name} (${n.opportunity})`).join("; ")}`,
    `Strategic angles:\n${opportunity.lenses.map((l) => `- ${l.name}: ${l.reframe}`).join("\n")}`,
  ].filter(Boolean).join("\n\n");
}

const SYSTEM = `You are Flash. From a founding team's confirmed synthesis and agreed opportunity space, birth 4-5 candidate VENTURES the three of them are uniquely placed to build. Each venture is concrete and specific to THIS team — name it, state a one-sentence thesis (what it is, for whom, why now), the market they can actually reach, what makes it differentiated, the purpose driving it, and the "only this team" reason. Score each: problemScore 0-10 (how real/painful the problem), solution Painkiller vs Vitamin, spark 0-5 (energy/excitement), conviction 0-5 (how strongly it fits the team). Mark exactly ONE as recommended — the strongest fit. earn is an illustrative 3-year revenue range. No generic startup talk; ground everything in what the team actually brings.`;

export async function generateVentures(
  synthesis: SynthesisData,
  opportunity: OpportunityData,
): Promise<Venture[]> {
  const client = getAnthropic();
  const body = {
    model: "claude-sonnet-4-6",
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    output_config: { effort: "low", format: { type: "json_schema", schema: VENT_SCHEMA } },
    system: SYSTEM,
    messages: [{ role: "user", content: `The confirmed synthesis and opportunity:\n\n${context(synthesis, opportunity)}\n\nBirth 4-5 candidate ventures.` }],
  };
  const message = (await client.messages.create(body as never)) as { content: { type: string; text?: string }[] };
  const raw = message.content.filter((b) => b.type === "text" && b.text).map((b) => b.text as string).join("");
  const parsed = JSON.parse(raw) as { ventures: RawVenture[] };

  const ventures: Venture[] = (parsed.ventures ?? []).slice(0, 5).map((v, i) => ({
    id: `v${i}`,
    name: v.name,
    thesis: v.thesis,
    problemScore: clamp(v.problemScore, 0, 10),
    solution: v.solution === "Vitamin" ? "Vitamin" : "Painkiller",
    market: v.market,
    differentiation: v.differentiation,
    purpose: v.purpose,
    unique: v.unique,
    earn: v.earn,
    votes: 0,
    spark: clamp(v.spark, 0, 5),
    conviction: clamp(v.conviction, 0, 5),
    recommended: false,
  }));

  // Exactly one recommended: honour the model's pick, else the highest-scored.
  const flagged = (parsed.ventures ?? []).findIndex((v) => v.recommended);
  const recIdx = flagged >= 0 && flagged < ventures.length
    ? flagged
    : ventures.reduce((best, v, i, arr) => (v.problemScore + v.conviction > arr[best].problemScore + arr[best].conviction ? i : best), 0);
  if (ventures[recIdx]) ventures[recIdx].recommended = true;

  return ventures;
}
