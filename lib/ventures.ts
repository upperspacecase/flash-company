import {
  LENSES,
  type OpportunityData,
  type SynthesisData,
  type Venture,
} from "@/app/demo/data";
import { getAnthropic } from "@/lib/synthesis";
import { getPrompt } from "@/lib/prompts";

// Birth the single venture from the chosen opportunity — in small, sequential
// agent steps that build on each other, so each one is fast and reliable and
// fits inside a serverless function: research -> core -> market & money -> lenses.
// advanceVenture() does exactly ONE step per call; the caller persists `state`
// between calls (live: a server action loop; seed: one POST per step).

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
      ? `The chosen opportunity (build the venture from this):\nTitle: ${space.title}\nHook: ${space.hook}\nCustomer: ${space.customer}\nProblem: ${space.problem}\nSolution: ${space.solution}\nMarket: ${space.market}`
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

async function callJson<T>(
  client: ReturnType<typeof getAnthropic>,
  system: string,
  user: string,
  schema: object,
  effort: "low" | "medium" | "high",
): Promise<T> {
  const body = {
    model: "claude-sonnet-4-6",
    max_tokens: 12000,
    thinking: { type: "adaptive" },
    output_config: { effort, format: { type: "json_schema", schema } },
    system,
    messages: [{ role: "user", content: user }],
  };
  const message = (await client.messages.create(body as never)) as { content: { type: string; text?: string }[] };
  return JSON.parse(extractText(message.content)) as T;
}

/* ----------------------------------------- step 1: research (web search) */

async function research(client: ReturnType<typeof getAnthropic>, space?: Space): Promise<string> {
  if (!space) return "";
  // Stream the web-search turn. A non-streamed web_search request hangs until the
  // function is killed (the brief never saves) — streaming keeps the connection
  // alive through the searches. Falls back to an empty brief on any failure.
  try {
    const body = {
      model: "claude-sonnet-4-6",
      max_tokens: 6000,
      thinking: { type: "disabled" },
      output_config: { effort: "low" },
      tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 3 }],
      system: await getPrompt("venture-research"),
      messages: [{ role: "user", content: `Opportunity:\nTitle: ${space.title}\nCustomer: ${space.customer}\nProblem: ${space.problem}\nMarket: ${space.market}\n\nResearch it thoroughly.` }],
    };
    const stream = client.messages.stream(body as never) as unknown as { finalMessage: () => Promise<{ content: { type: string; text?: string }[] }> };
    const final = await stream.finalMessage();
    return extractText(final.content);
  } catch (e) {
    console.error("[venture] research/web_search failed:", e instanceof Error ? e.message : e);
    return "";
  }
}

/* ----------------------------------------- step 2: core (qualitative) */

const CORE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    name: { type: "string" },
    thesis: { type: "string" },
    purpose: { type: "string" },
    unique: { type: "string" },
    problemScore: { type: "integer" },
    solution: { type: "string", enum: ["Painkiller", "Vitamin"] },
    spark: { type: "integer" },
    conviction: { type: "integer" },
    customer: { type: "string" },
    problem: { type: "string" },
    advantage: { type: "object", additionalProperties: false, properties: { capability: { type: "string" }, insight: { type: "string" }, motivation: { type: "string" } }, required: ["capability", "insight", "motivation"] },
    competition: { type: "object", additionalProperties: false, properties: { gorilla: { type: "string" }, alternatives: { type: "string" } }, required: ["gorilla", "alternatives"] },
    problemBreakdown: { type: "object", additionalProperties: false, properties: { painful: { type: "integer" }, frequent: { type: "integer" }, whyNow: { type: "integer" }, payNow: { type: "string" } }, required: ["painful", "frequent", "whyNow", "payNow"] },
    differentiation: { type: "object", additionalProperties: false, properties: { statement: { type: "string" }, clarity: { type: "integer" } }, required: ["statement", "clarity"] },
    principles: { type: "array", items: { type: "string" } },
    approaches: { type: "array", items: { type: "object", additionalProperties: false, properties: { title: { type: "string" }, why: { type: "string" } }, required: ["title", "why"] } },
  },
  required: ["name", "thesis", "purpose", "unique", "problemScore", "solution", "spark", "conviction", "customer", "problem", "advantage", "competition", "problemBreakdown", "differentiation", "principles", "approaches"],
};

type RawCore = {
  name: string; thesis: string; purpose: string; unique: string;
  problemScore: number; solution: string; spark: number; conviction: number;
  customer: string; problem: string;
  advantage: { capability: string; insight: string; motivation: string };
  competition: { gorilla: string; alternatives: string };
  problemBreakdown: { painful: number; frequent: number; whyNow: number; payNow: string };
  differentiation: { statement: string; clarity: number };
  principles: string[];
  approaches: { title: string; why: string }[];
};

async function buildCore(client: ReturnType<typeof getAnthropic>, synthesis: SynthesisData, space: Space | undefined, brief: string): Promise<RawCore> {
  const user = `Synthesis and chosen opportunity:\n\n${teamContext(synthesis, space)}\n\nResearch brief:\n${brief || "(no external findings — reason from the opportunity and team)"}\n\nDefine the venture's core.`;
  return callJson<RawCore>(client, await getPrompt("venture-core"), user, CORE_SCHEMA, "medium");
}

/* ----------------------------------------- step 3: market & money */

const PLAN_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    marketSummary: { type: "string" },
    market: { type: "array", items: { type: "object", additionalProperties: false, properties: { label: { type: "string" }, finding: { type: "string" } }, required: ["label", "finding"] } },
    financials: { type: "object", additionalProperties: false, properties: { note: { type: "string" }, rows: { type: "array", items: { type: "object", additionalProperties: false, properties: { label: { type: "string" }, value: { type: "string" } }, required: ["label", "value"] } } }, required: ["note", "rows"] },
    revenue: { type: "object", additionalProperties: false, properties: { modelId: { type: "string", enum: ["cohort", "placement", "subscription", "marketplace"] }, growth: { type: "integer" }, drivers: { type: "array", items: { type: "object", additionalProperties: false, properties: { key: { type: "string" }, value: { type: "number" } }, required: ["key", "value"] } } }, required: ["modelId", "growth", "drivers"] },
    earn: { type: "string" },
    origin: { type: "array", items: { type: "string" } },
    sprint: { type: "array", items: { type: "object", additionalProperties: false, properties: { days: { type: "string" }, text: { type: "string" } }, required: ["days", "text"] } },
    risks: { type: "array", items: { type: "object", additionalProperties: false, properties: { risk: { type: "string" }, mitigation: { type: "string" } }, required: ["risk", "mitigation"] } },
  },
  required: ["marketSummary", "market", "financials", "revenue", "earn", "origin", "sprint", "risks"],
};

type RawPlan = {
  marketSummary: string;
  market: { label: string; finding: string }[];
  financials: { note: string; rows: { label: string; value: string }[] };
  revenue: { modelId: string; growth: number; drivers: { key: string; value: number }[] };
  earn: string;
  origin: string[];
  sprint: { days: string; text: string }[];
  risks: { risk: string; mitigation: string }[];
};

async function buildPlan(client: ReturnType<typeof getAnthropic>, space: Space | undefined, brief: string, core: RawCore): Promise<RawPlan> {
  const user = `Venture core:\nName: ${core.name}\nThesis: ${core.thesis}\nCustomer: ${core.customer}\nProblem: ${core.problem}\nAdvantage: ${core.advantage.capability}\nChosen market: ${space?.market ?? ""}\n\nResearch brief:\n${brief || "(no external findings)"}\n\nProduce the market read and the numbers, grounded in the research.`;
  return callJson<RawPlan>(client, await getPrompt("venture-plan"), user, PLAN_SCHEMA, "medium");
}

/* ----------------------------------------- step 4: lenses */

const LENSES_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: { lenses: { type: "array", items: { type: "object", additionalProperties: false, properties: { name: { type: "string", enum: LENS_NAMES }, reframe: { type: "string" } }, required: ["name", "reframe"] } } },
  required: ["lenses"],
};

async function buildLenses(client: ReturnType<typeof getAnthropic>, core: RawCore, plan: RawPlan): Promise<{ lenses: { name: string; reframe: string }[] }> {
  const user = `The venture:\nName: ${core.name}\nThesis: ${core.thesis}\nCustomer: ${core.customer}\nProblem: ${core.problem}\nDifferentiation: ${core.differentiation.statement}\nApproaches: ${core.approaches.map((a) => a.title).join("; ")}\nMarket: ${plan.marketSummary}\nRevenue model: ${plan.revenue.modelId}\n\nWrite a one-paragraph reframe for each Magic Lens.`;
  return callJson(client, await getPrompt("venture-lenses"), user, LENSES_SCHEMA, "medium");
}

/* ----------------------------------------- assemble */

function assemble(core: RawCore, plan: RawPlan, lensesRaw: { lenses: { name: string; reframe: string }[] }): Venture {
  const byName: Record<string, string> = {};
  for (const l of lensesRaw.lenses ?? []) byName[l.name] = l.reframe;
  const lenses = LENSES.map((base) => ({ ...base, reframe: byName[base.name] || base.reframe }));
  return {
    id: "v0",
    name: core.name,
    thesis: core.thesis,
    problemScore: clamp(core.problemScore, 0, 10),
    solution: core.solution === "Vitamin" ? "Vitamin" : "Painkiller",
    market: plan.marketSummary,
    differentiation: core.differentiation.statement,
    purpose: core.purpose,
    unique: core.unique,
    earn: plan.earn,
    votes: 0,
    spark: clamp(core.spark, 0, 5),
    conviction: clamp(core.conviction, 0, 5),
    recommended: true,
    lenses,
    detail: {
      customer: core.customer,
      problem: core.problem,
      advantage: core.advantage,
      competition: core.competition,
      problemBreakdown: {
        painful: clamp(core.problemBreakdown.painful, 0, 5),
        frequent: clamp(core.problemBreakdown.frequent, 0, 5),
        whyNow: clamp(core.problemBreakdown.whyNow, 0, 5),
        payNow: core.problemBreakdown.payNow,
      },
      differentiation: { statement: core.differentiation.statement, clarity: clamp(core.differentiation.clarity, 0, 5) },
      principles: core.principles ?? [],
      origin: plan.origin ?? [],
      sprint: plan.sprint ?? [],
      risks: plan.risks ?? [],
      financials: plan.financials ?? { note: "", rows: [] },
      market: plan.market ?? [],
      approaches: core.approaches ?? [],
      revenue: plan.revenue ?? { modelId: "cohort", growth: 80, drivers: [] },
    },
  };
}

/* ----------------------------------------- the staged engine */

export type VentureBuildState = { brief?: string; core?: RawCore; plan?: RawPlan };
export type VentureStep = { state: VentureBuildState; stage: "research" | "core" | "plan" | "lenses"; done: boolean; ventures?: Venture[] };

// Do exactly one build step, given what's been built so far. The caller persists
// `state` and calls again until `done`.
export async function advanceVenture(
  synthesis: SynthesisData,
  opportunity: OpportunityData,
  state: VentureBuildState,
  chosenSpaceId?: string,
): Promise<VentureStep> {
  const client = getAnthropic();
  const space = chosen(opportunity, chosenSpaceId);

  if (!state.brief) {
    const brief = await research(client, space);
    return { state: { ...state, brief: brief || " " }, stage: "research", done: false };
  }
  if (!state.core) {
    const core = await buildCore(client, synthesis, space, state.brief);
    return { state: { ...state, core }, stage: "core", done: false };
  }
  if (!state.plan) {
    const plan = await buildPlan(client, space, state.brief, state.core);
    return { state: { ...state, plan }, stage: "plan", done: false };
  }
  const lensesRaw = await buildLenses(client, state.core, state.plan);
  const venture = assemble(state.core, state.plan, lensesRaw);
  return { state, stage: "lenses", done: true, ventures: [venture] };
}
