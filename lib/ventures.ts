import {
  LENSES,
  type OpportunityData,
  type SynthesisData,
  type Venture,
} from "@/app/demo/data";
import { getAnthropic } from "@/lib/synthesis";
import { RESEARCH_SYSTEM, VENTURES_SYSTEM } from "@/lib/llm-spec";

// Birth the single, comprehensive venture from the chosen opportunity. Two
// phases: (1) deep live web-search research (market, competition, willingness to
// pay, financial benchmarks), then (2) synthesize the full, research-grounded
// venture — the editable detail the venture page renders and the team edits.

const clamp = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, Math.round(Number.isFinite(n) ? n : lo)));

const LENS_NAMES = LENSES.map((l) => l.name);

type Space = OpportunityData["spaces"][number];

function chosen(opportunity: OpportunityData, chosenSpaceId?: string): Space | undefined {
  return opportunity.spaces.find((s) => s.id === chosenSpaceId) ?? opportunity.spaces[0];
}

function teamContext(synthesis: SynthesisData, space?: Space): string {
  const list = (xs: { text: string }[]) => xs.map((x) => `- ${x.text}`).join("\n");
  return [
    space
      ? `The chosen opportunity (build the venture from this):\nTitle: ${space.title}\nCustomer: ${space.customer}\nProblem: ${space.problem}\nMarket: ${space.market}\nUnfair advantage: ${space.advantage}\nWhy now: ${space.whyNow}`
      : "",
    `Lived problems:\n${list(synthesis.problems)}`,
    `Obsessions:\n${list(synthesis.obsessions)}`,
    `Target markets:\n${list(synthesis.markets)}`,
    `Roles: ${synthesis.roles.map((r) => r.role).join(", ")}`,
    `Network: ${synthesis.network.map((n) => `${n.name} (${n.opportunity})`).join("; ")}`,
  ].filter(Boolean).join("\n\n");
}

function extractText(content: { type: string; text?: string }[]): string {
  return content.filter((b) => b.type === "text" && b.text).map((b) => b.text as string).join("\n");
}

/* ------------------------------------- Phase 1: deep web-search research */

async function research(client: ReturnType<typeof getAnthropic>, space?: Space): Promise<string> {
  if (!space) return "";
  const system = RESEARCH_SYSTEM;
  const messages: { role: "user" | "assistant"; content: unknown }[] = [
    { role: "user", content: `Opportunity:\nTitle: ${space.title}\nCustomer: ${space.customer}\nProblem: ${space.problem}\nMarket: ${space.market}\n\nResearch it thoroughly.` },
  ];
  let text = "";
  for (let i = 0; i < 8; i++) {
    const body = {
      model: "claude-sonnet-4-6",
      max_tokens: 8000,
      thinking: { type: "disabled" },
      output_config: { effort: "medium" },
      tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 5 }],
      system,
      messages,
    };
    const message = (await client.messages.create(body as never)) as { content: { type: string; text?: string }[]; stop_reason?: string };
    text = extractText(message.content);
    if (message.stop_reason !== "pause_turn") break;
    messages.push({ role: "assistant", content: message.content });
  }
  return text;
}

/* ------------------------------------- Phase 2: synthesize the full venture */

const VENT_SCHEMA = {
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
    detail: {
      type: "object",
      additionalProperties: false,
      properties: {
        customer: { type: "string" },
        problem: { type: "string" },
        advantage: {
          type: "object",
          additionalProperties: false,
          properties: { capability: { type: "string" }, insight: { type: "string" }, motivation: { type: "string" } },
          required: ["capability", "insight", "motivation"],
        },
        competition: {
          type: "object",
          additionalProperties: false,
          properties: { gorilla: { type: "string" }, alternatives: { type: "string" } },
          required: ["gorilla", "alternatives"],
        },
        problemBreakdown: {
          type: "object",
          additionalProperties: false,
          properties: { painful: { type: "integer" }, frequent: { type: "integer" }, whyNow: { type: "integer" }, payNow: { type: "string" } },
          required: ["painful", "frequent", "whyNow", "payNow"],
        },
        differentiation: {
          type: "object",
          additionalProperties: false,
          properties: { statement: { type: "string" }, clarity: { type: "integer" } },
          required: ["statement", "clarity"],
        },
        principles: { type: "array", items: { type: "string" } },
        origin: { type: "array", items: { type: "string" } },
        sprint: {
          type: "array",
          items: { type: "object", additionalProperties: false, properties: { days: { type: "string" }, text: { type: "string" } }, required: ["days", "text"] },
        },
        risks: {
          type: "array",
          items: { type: "object", additionalProperties: false, properties: { risk: { type: "string" }, mitigation: { type: "string" } }, required: ["risk", "mitigation"] },
        },
        financials: {
          type: "object",
          additionalProperties: false,
          properties: {
            note: { type: "string" },
            rows: { type: "array", items: { type: "object", additionalProperties: false, properties: { label: { type: "string" }, value: { type: "string" } }, required: ["label", "value"] } },
          },
          required: ["note", "rows"],
        },
        market: {
          type: "array",
          items: { type: "object", additionalProperties: false, properties: { label: { type: "string" }, finding: { type: "string" } }, required: ["label", "finding"] },
        },
        approaches: {
          type: "array",
          items: { type: "object", additionalProperties: false, properties: { title: { type: "string" }, why: { type: "string" } }, required: ["title", "why"] },
        },
        revenue: {
          type: "object",
          additionalProperties: false,
          properties: {
            modelId: { type: "string", enum: ["cohort", "placement", "subscription", "marketplace"] },
            growth: { type: "integer" },
            drivers: { type: "array", items: { type: "object", additionalProperties: false, properties: { key: { type: "string" }, value: { type: "number" } }, required: ["key", "value"] } },
          },
          required: ["modelId", "growth", "drivers"],
        },
      },
      required: ["customer", "problem", "advantage", "competition", "problemBreakdown", "differentiation", "principles", "origin", "sprint", "risks", "financials", "market", "approaches", "revenue"],
    },
    lenses: {
      type: "array",
      items: { type: "object", additionalProperties: false, properties: { name: { type: "string", enum: LENS_NAMES }, reframe: { type: "string" } }, required: ["name", "reframe"] },
    },
  },
  required: ["name", "thesis", "problemScore", "solution", "market", "differentiation", "purpose", "unique", "earn", "spark", "conviction", "detail", "lenses"],
};

type RawDetail = {
  customer: string;
  problem: string;
  advantage: { capability: string; insight: string; motivation: string };
  competition: { gorilla: string; alternatives: string };
  problemBreakdown: { painful: number; frequent: number; whyNow: number; payNow: string };
  differentiation: { statement: string; clarity: number };
  principles: string[];
  origin: string[];
  sprint: { days: string; text: string }[];
  risks: { risk: string; mitigation: string }[];
  financials: { note: string; rows: { label: string; value: string }[] };
  market: { label: string; finding: string }[];
  approaches: { title: string; why: string }[];
  revenue: { modelId: string; growth: number; drivers: { key: string; value: number }[] };
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
  detail: RawDetail;
  lenses: { name: string; reframe: string }[];
};

export async function generateVentures(
  synthesis: SynthesisData,
  opportunity: OpportunityData,
  chosenSpaceId?: string,
): Promise<Venture[]> {
  const client = getAnthropic();
  const space = chosen(opportunity, chosenSpaceId);
  const findings = await research(client, space);
  const ctx = teamContext(synthesis, space);

  const body = {
    model: "claude-sonnet-4-6",
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    output_config: { effort: "high", format: { type: "json_schema", schema: VENT_SCHEMA } },
    system: VENTURES_SYSTEM,
    messages: [{ role: "user", content: `Synthesis and chosen opportunity:\n\n${ctx}\n\nResearch brief:\n${findings || "(no external findings available — reason from the opportunity and team)"}\n\nBuild the comprehensive venture and the lens reframes.` }],
  };
  const message = (await client.messages.create(body as never)) as { content: { type: string; text?: string }[] };
  const raw = extractText(message.content);
  const parsed = JSON.parse(raw) as RawVenture;
  const d = parsed.detail;

  const byName: Record<string, string> = {};
  for (const l of parsed.lenses ?? []) byName[l.name] = l.reframe;
  const lenses = LENSES.map((base) => ({ ...base, reframe: byName[base.name] || base.reframe }));

  const venture: Venture = {
    id: "v0",
    name: parsed.name,
    thesis: parsed.thesis,
    problemScore: clamp(parsed.problemScore, 0, 10),
    solution: parsed.solution === "Vitamin" ? "Vitamin" : "Painkiller",
    market: parsed.market,
    differentiation: parsed.differentiation,
    purpose: parsed.purpose,
    unique: parsed.unique,
    earn: parsed.earn,
    votes: 0,
    spark: clamp(parsed.spark, 0, 5),
    conviction: clamp(parsed.conviction, 0, 5),
    recommended: true,
    lenses,
    detail: {
      customer: d.customer,
      problem: d.problem,
      advantage: d.advantage,
      competition: d.competition,
      problemBreakdown: {
        painful: clamp(d.problemBreakdown.painful, 0, 5),
        frequent: clamp(d.problemBreakdown.frequent, 0, 5),
        whyNow: clamp(d.problemBreakdown.whyNow, 0, 5),
        payNow: d.problemBreakdown.payNow,
      },
      differentiation: { statement: d.differentiation.statement, clarity: clamp(d.differentiation.clarity, 0, 10) },
      principles: d.principles ?? [],
      origin: d.origin ?? [],
      sprint: d.sprint ?? [],
      risks: d.risks ?? [],
      financials: d.financials ?? { note: "", rows: [] },
      market: d.market ?? [],
      approaches: d.approaches ?? [],
      revenue: d.revenue ?? { modelId: "cohort", growth: 80, drivers: [] },
    },
  };
  return [venture];
}
