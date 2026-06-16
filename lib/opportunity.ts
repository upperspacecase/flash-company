import { type OpportunityData, type SynthesisData } from "@/app/demo/data";
import { getAnthropic } from "@/lib/synthesis";
import { SPACES_SYSTEM } from "@/lib/llm-spec";

function summarize(s: SynthesisData): string {
  const list = (xs: { text: string }[]) => xs.map((x) => `- ${x.text}`).join("\n");
  return [
    `Lived problems (ranked by the team — most important first):\n${list(s.problems)}`,
    `Obsessions (ranked):\n${list(s.obsessions)}`,
    `Target markets (ranked):\n${list(s.markets)}`,
    `Roles: ${s.roles.map((r) => r.role).join(", ")}`,
    `Network: ${s.network.map((n) => n.name).join(", ")}`,
  ].join("\n\n");
}

/* ----------------------------------- candidate ventures (scored, distinct) */

const CRIT = {
  type: "object",
  additionalProperties: false,
  properties: { score: { type: "integer" }, note: { type: "string" } },
  required: ["score", "note"],
} as const;

const SPACES_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    spaces: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          hook: { type: "string" },
          problem: { type: "string" },
          solution: { type: "string" },
          market: { type: "string" },
          customer: { type: "string" },
          evaluation: {
            type: "object",
            additionalProperties: false,
            properties: { realProblem: CRIT, founderFit: CRIT, rightMoment: CRIT, flashProof: CRIT, benefits: CRIT },
            required: ["realProblem", "founderFit", "rightMoment", "flashProof", "benefits"],
          },
        },
        required: ["title", "hook", "problem", "solution", "market", "customer", "evaluation"],
      },
    },
  },
  required: ["spaces"],
} as const;

type RawCrit = { score: number; note: string };
type RawSpace = {
  title: string; hook: string; problem: string; solution: string; market: string; customer: string;
  evaluation: { realProblem: RawCrit; founderFit: RawCrit; rightMoment: RawCrit; flashProof: RawCrit; benefits: RawCrit };
};

const clamp10 = (n: number) => Math.max(0, Math.min(10, Math.round(Number.isFinite(n) ? n : 5)));
const crit = (c?: RawCrit) => ({ score: clamp10(c?.score ?? 5), note: c?.note ?? "" });

async function generateSpaces(client: ReturnType<typeof getAnthropic>, ctx: string): Promise<OpportunityData["spaces"]> {
  const body = {
    model: "claude-sonnet-4-6",
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    output_config: { effort: "low", format: { type: "json_schema", schema: SPACES_SCHEMA } },
    system: SPACES_SYSTEM,
    messages: [{ role: "user", content: `The team's confirmed, consensus-ranked synthesis:\n\n${ctx}\n\nProduce 5 genuinely DISTINCT opportunities, each scored on the five weighted criteria with a one-line rationale per criterion.` }],
  };
  const message = (await client.messages.create(body as never)) as { content: { type: string; text?: string }[] };
  const raw = message.content.filter((b) => b.type === "text" && b.text).map((b) => b.text as string).join("");
  const parsed = JSON.parse(raw) as { spaces: RawSpace[] };
  return (parsed.spaces ?? [])
    .filter((s) => s.title && s.title.trim())
    .map((s, i) => ({
      id: `sp${i}`,
      title: s.title,
      hook: s.hook,
      problem: s.problem,
      solution: s.solution,
      market: s.market,
      customer: s.customer,
      evaluation: {
        realProblem: crit(s.evaluation?.realProblem),
        founderFit: crit(s.evaluation?.founderFit),
        rightMoment: crit(s.evaluation?.rightMoment),
        flashProof: crit(s.evaluation?.flashProof),
        benefits: crit(s.evaluation?.benefits),
      },
      votes: 0,
    }));
}

export async function generateOpportunity(synthesis: SynthesisData): Promise<OpportunityData> {
  const client = getAnthropic();
  const ctx = summarize(synthesis);
  const spaces = await generateSpaces(client, ctx);
  return { spaces };
}
