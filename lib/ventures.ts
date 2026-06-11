import {
  LENSES,
  type OpportunityData,
  type SynthesisData,
  type Venture,
} from "@/app/demo/data";
import { getAnthropic } from "@/lib/synthesis";

// The single venture the team is uniquely placed to build, born from the
// opportunity space they chose. Returns a one-element Venture[] (the UI renders
// a list) with the Magic Lenses generated for its Approach.

const clamp = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, Math.round(Number.isFinite(n) ? n : lo)));

const LENS_NAMES = LENSES.map((l) => l.name);
const LENS_GUIDE = LENSES.map((l) => `- ${l.name}: ${l.question}`).join("\n");

const VENT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    venture: {
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
      },
      required: [
        "name", "thesis", "problemScore", "solution", "market",
        "differentiation", "purpose", "unique", "earn", "spark", "conviction",
      ],
    },
    lenses: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string", enum: LENS_NAMES },
          reframe: { type: "string" },
        },
        required: ["name", "reframe"],
      },
    },
  },
  required: ["venture", "lenses"],
};

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
};

function context(synthesis: SynthesisData, opportunity: OpportunityData, chosenSpaceId?: string): string {
  const space = opportunity.spaces.find((s) => s.id === chosenSpaceId) ?? opportunity.spaces[0];
  const list = (xs: { text: string }[]) => xs.map((x) => `- ${x.text}`).join("\n");
  return [
    space
      ? `The team chose this opportunity — build the venture from it:\nTitle: ${space.title}\nCustomer: ${space.customer}\nProblem: ${space.problem}\nMarket: ${space.market}\nUnfair advantage: ${space.advantage}\nWhy now: ${space.whyNow}`
      : "",
    `Lived problems:\n${list(synthesis.problems)}`,
    `Obsessions:\n${list(synthesis.obsessions)}`,
    `Target markets:\n${list(synthesis.markets)}`,
    `Roles: ${synthesis.roles.map((r) => r.role).join(", ")}`,
    `Network: ${synthesis.network.map((n) => `${n.name} (${n.opportunity})`).join("; ")}`,
  ].filter(Boolean).join("\n\n");
}

const SYSTEM = `You are Flash. The team has chosen one opportunity space. Birth the SINGLE venture they are uniquely placed to build from it — concrete and specific to THIS team. Give it a name, a one-sentence thesis (what it is, for whom, why now), the market they can actually reach, what makes it differentiated, the purpose driving it, and the "only this team" reason. Score it: problemScore 0-10 (how real/painful), solution Painkiller vs Vitamin, spark 0-5 (energy), conviction 0-5 (fit). earn is an illustrative 3-year revenue range. Then view the venture through each of these Magic Lenses and write a one-paragraph reframe for each (how that lens sees THIS venture):
${LENS_GUIDE}
No generic startup talk; ground everything in the chosen opportunity and what the team brings.`;

export async function generateVentures(
  synthesis: SynthesisData,
  opportunity: OpportunityData,
  chosenSpaceId?: string,
): Promise<Venture[]> {
  const client = getAnthropic();
  const body = {
    model: "claude-sonnet-4-6",
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    output_config: { effort: "low", format: { type: "json_schema", schema: VENT_SCHEMA } },
    system: SYSTEM,
    messages: [{ role: "user", content: `The confirmed synthesis and the chosen opportunity:\n\n${context(synthesis, opportunity, chosenSpaceId)}\n\nBirth the single venture, and the lens reframes.` }],
  };
  const message = (await client.messages.create(body as never)) as { content: { type: string; text?: string }[] };
  const raw = message.content.filter((b) => b.type === "text" && b.text).map((b) => b.text as string).join("");
  const parsed = JSON.parse(raw) as { venture: RawVenture; lenses: { name: string; reframe: string }[] };
  const v = parsed.venture;

  const byName: Record<string, string> = {};
  for (const l of parsed.lenses ?? []) byName[l.name] = l.reframe;
  const lenses = LENSES.map((base) => ({ ...base, reframe: byName[base.name] || base.reframe }));

  const venture: Venture = {
    id: "v0",
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
    recommended: true,
    lenses,
  };
  return [venture];
}
