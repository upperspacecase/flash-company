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
          customer: { type: "string" },
          problem: { type: "string" },
          market: { type: "string" },
          advantage: { type: "string" },
          whyNow: { type: "string" },
          scores: {
            type: "object",
            additionalProperties: false,
            properties: { problem: { type: "integer" }, market: { type: "integer" }, fit: { type: "integer" } },
            required: ["problem", "market", "fit"],
          },
          scoreNote: { type: "string" },
        },
        required: ["title", "customer", "problem", "market", "advantage", "whyNow", "scores", "scoreNote"],
      },
    },
  },
  required: ["spaces"],
} as const;

type RawSpace = {
  title: string; customer: string; problem: string; market: string; advantage: string; whyNow: string;
  scores: { problem: number; market: number; fit: number }; scoreNote: string;
};

const clamp10 = (n: number) => Math.max(0, Math.min(10, Math.round(Number.isFinite(n) ? n : 5)));

async function generateSpaces(client: ReturnType<typeof getAnthropic>, ctx: string): Promise<OpportunityData["spaces"]> {
  const body = {
    model: "claude-sonnet-4-6",
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    output_config: { effort: "low", format: { type: "json_schema", schema: SPACES_SCHEMA } },
    system: SPACES_SYSTEM,
    messages: [{ role: "user", content: `The team's confirmed, consensus-ranked synthesis:\n\n${ctx}\n\nProduce 5 genuinely DISTINCT candidate ventures, scored.` }],
  };
  const message = (await client.messages.create(body as never)) as { content: { type: string; text?: string }[] };
  const raw = message.content.filter((b) => b.type === "text" && b.text).map((b) => b.text as string).join("");
  const parsed = JSON.parse(raw) as { spaces: RawSpace[] };
  return (parsed.spaces ?? [])
    .filter((s) => s.title && s.title.trim())
    .map((s, i) => ({
      id: `sp${i}`,
      title: s.title,
      customer: s.customer,
      problem: s.problem,
      market: s.market,
      advantage: s.advantage,
      whyNow: s.whyNow,
      scores: { problem: clamp10(s.scores?.problem), market: clamp10(s.scores?.market), fit: clamp10(s.scores?.fit) },
      scoreNote: s.scoreNote ?? "",
      votes: 0,
    }));
}

export async function generateOpportunity(synthesis: SynthesisData): Promise<OpportunityData> {
  const client = getAnthropic();
  const ctx = summarize(synthesis);
  const spaces = await generateSpaces(client, ctx);
  return { spaces };
}
