import {
  RESEARCH_LENSES,
  type OpportunityData,
  type ResearchLens,
  type SynthesisData,
} from "@/app/demo/data";
import { getAnthropic } from "@/lib/synthesis";
import { SPACES_SYSTEM, PESTLE_SYSTEM } from "@/lib/llm-spec";

const PESTLE: { key: ResearchLens["key"]; label: string }[] = [
  { key: "political", label: "Political" },
  { key: "economic", label: "Economic" },
  { key: "social", label: "Social" },
  { key: "technological", label: "Technological" },
  { key: "environmental", label: "Environmental" },
  { key: "legal", label: "Legal" },
];

function summarize(s: SynthesisData): string {
  const list = (xs: { text: string }[]) => xs.map((x) => `- ${x.text}`).join("\n");
  return [
    `Lived problems:\n${list(s.problems)}`,
    `Obsessions:\n${list(s.obsessions)}`,
    `Target markets:\n${list(s.markets)}`,
    `Roles: ${s.roles.map((r) => r.role).join(", ")}`,
    `Network: ${s.network.map((n) => n.name).join(", ")}`,
  ].join("\n\n");
}

/* ----------------------------------- opportunity spaces (mini-ventures) */

// Each space is a small, comparable mini-venture — framed with the Click basics
// the venture step uses — so the team can vote between them. The chosen one is
// what the venture step births a single full venture from.
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
        },
        required: ["title", "customer", "problem", "market", "advantage", "whyNow"],
      },
    },
  },
  required: ["spaces"],
} as const;

type RawSpace = { title: string; customer: string; problem: string; market: string; advantage: string; whyNow: string };

async function generateSpaces(client: ReturnType<typeof getAnthropic>, ctx: string): Promise<OpportunityData["spaces"]> {
  const body = {
    model: "claude-sonnet-4-6",
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    output_config: { effort: "low", format: { type: "json_schema", schema: SPACES_SCHEMA } },
    system: SPACES_SYSTEM,
    messages: [{ role: "user", content: `The confirmed synthesis:\n\n${ctx}\n\nProduce 4-6 opportunity spaces as mini-ventures.` }],
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
      votes: 0,
    }));
}

/* ------------------------------------- PESTLE: live web search + LLM grounding */

function extractJson(text: string): unknown | null {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fence ? fence[1] : text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  try {
    return JSON.parse(candidate);
  } catch {
    return null;
  }
}

async function generatePestle(client: ReturnType<typeof getAnthropic>, theme: string): Promise<ResearchLens[]> {
  const system = PESTLE_SYSTEM;
  const messages: { role: "user" | "assistant"; content: unknown }[] = [
    { role: "user", content: `Run a PESTLE scan for this opportunity: ${theme}` },
  ];
  let text = "";
  for (let i = 0; i < 4; i++) {
    const body = {
      model: "claude-sonnet-4-6",
      max_tokens: 6000,
      thinking: { type: "disabled" },
      output_config: { effort: "low" },
      tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 2 }],
      system,
      messages,
    };
    const message = (await client.messages.create(body as never)) as {
      content: { type: string; text?: string }[];
      stop_reason?: string;
    };
    text = message.content.filter((b) => b.type === "text" && b.text).map((b) => b.text as string).join("\n");
    if (message.stop_reason !== "pause_turn") break;
    messages.push({ role: "assistant", content: message.content });
  }
  const obj = extractJson(text) as Record<string, string> | null;
  if (!obj) throw new Error("PESTLE: could not parse findings");
  return PESTLE.map(({ key, label }) => ({ key, label, finding: (obj[key] ?? "").trim() || "—" }));
}

/* ----------------------------------------------------------------- combine */

export async function generateOpportunity(synthesis: SynthesisData): Promise<OpportunityData> {
  const client = getAnthropic();
  const ctx = summarize(synthesis);
  const theme = [synthesis.markets[0]?.text, synthesis.problems[0]?.text].filter(Boolean).join(" — ") || "this founding team's opportunity";

  const [spaces, research] = await Promise.all([
    generateSpaces(client, ctx),
    // Live web search powers PESTLE for the chosen direction; fall back to the
    // authored scan only on a hard error.
    generatePestle(client, theme).catch(() => RESEARCH_LENSES.map((r) => ({ ...r }))),
  ]);

  return { spaces, research };
}
