import {
  RESEARCH_LENSES,
  type OpportunityData,
  type ResearchLens,
  type SynthesisData,
} from "@/app/demo/data";
import { getAnthropic } from "@/lib/synthesis";

const LENS_ICONS = ["bolt", "target", "star", "chart", "copy", "alert", "scale", "sparkle", "refresh", "link", "thumb"] as const;
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

/* ---------------------------------------------- spaces + lenses (structured) */

const SL_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    spaces: { type: "array", items: { type: "string" } },
    lenses: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          icon: { type: "string", enum: [...LENS_ICONS] },
          question: { type: "string" },
          reframe: { type: "string" },
        },
        required: ["name", "icon", "question", "reframe"],
      },
    },
  },
  required: ["spaces", "lenses"],
} as const;

type RawSL = { spaces: string[]; lenses: { name: string; icon: string; question: string; reframe: string }[] };

async function generateSpacesAndLenses(client: ReturnType<typeof getAnthropic>, ctx: string) {
  const body = {
    model: "claude-sonnet-4-6",
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    output_config: { effort: "low", format: { type: "json_schema", schema: SL_SCHEMA } },
    system:
      "You are Flash. Given a founding team's confirmed synthesis, birth the broad OPPORTUNITY SPACES they're uniquely placed to pursue (each a crisp one-sentence space combining a problem, an obsession and a market), then reframe the strongest space through several distinct strategic LENSES (e.g. first principles, blue ocean, an audacious moonshot, exponential/10x, transplant-from-elsewhere, break-a-rule, smallest-lever, the one-line 'click', riskiest-assumption test). Be specific to THIS team — no generic startup talk.",
    messages: [{ role: "user", content: `The confirmed synthesis:\n\n${ctx}\n\nProduce 4-6 opportunity spaces and 6-9 lenses.` }],
  };
  const message = (await client.messages.create(body as never)) as { content: { type: string; text?: string }[] };
  const raw = message.content.filter((b) => b.type === "text" && b.text).map((b) => b.text as string).join("");
  const parsed = JSON.parse(raw) as RawSL;
  const spaces = (parsed.spaces ?? []).filter((t) => t && t.trim()).map((text, i) => ({ id: `sp${i}`, text, votes: 0 }));
  const lenses = (parsed.lenses ?? []).map((l, i) => ({
    id: `l${i}`,
    name: l.name,
    icon: (LENS_ICONS as readonly string[]).includes(l.icon) ? (l.icon as OpportunityData["lenses"][number]["icon"]) : "sparkle",
    question: l.question,
    reframe: l.reframe,
  }));
  return { spaces, lenses };
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
  const system =
    "You are a market analyst. Use the web_search tool to find CURRENT (2026) real-world signals, then write a PESTLE scan. Ground each finding in what you actually found — concrete trends, policies, numbers. After researching, output ONLY a JSON object (no prose around it) with exactly these keys: political, economic, social, technological, environmental, legal. Each value is one or two sentences.";
  const messages: { role: "user" | "assistant"; content: unknown }[] = [
    { role: "user", content: `Run a PESTLE scan for this opportunity: ${theme}` },
  ];
  let text = "";
  for (let i = 0; i < 4; i++) {
    const body = {
      model: "claude-sonnet-4-6",
      max_tokens: 6000,
      // No extended thinking + a tight search cap keeps this background step to
      // a sensible latency; it still searches the live web before answering.
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
    messages.push({ role: "assistant", content: message.content }); // resume server tool loop
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

  const [sl, research] = await Promise.all([
    generateSpacesAndLenses(client, ctx),
    // Live web search powers PESTLE; fall back to the authored scan only on a hard error.
    generatePestle(client, theme).catch(() => RESEARCH_LENSES.map((r) => ({ ...r }))),
  ]);

  return { spaces: sl.spaces, research, lenses: sl.lenses };
}
