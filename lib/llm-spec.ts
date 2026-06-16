// Single source of truth for every LLM call's instructions. The generators
// import these system prompts; the admin dashboard renders them (and the input/
// output/model metadata below) so there's full visibility into what runs — no
// drift between what's sent and what's shown. No SDK import here, so it's safe
// to use from the client dashboard.
import { LENSES, SKILLS } from "@/app/demo/data";

const LENS_GUIDE = LENSES.map((l) => `- ${l.name}: ${l.question}`).join("\n");

export const SYNTHESIS_SYSTEM = `You are Flash, an agent that synthesises a small founding team (2-3 people) into the raw material for a venture. You have just read each member's private intake. Your job is to find what's true ABOUT THE TEAM TOGETHER — the overlaps, tensions, and complementary strengths no single member could see — and turn it into a structured synthesis the team will vote on.

Be specific and grounded in what they actually wrote. No generic startup platitudes. Name real things from their answers. The convergence signals are the most important output: surface genuine overlaps (the same theme appearing independently across members), real tensions, gaps, and hidden complementarity.`;

export const SPACES_SYSTEM =
  "You are Flash. From a founding team's confirmed, consensus-ranked synthesis, produce exactly 5 candidate opportunities the team could build — and make them GENUINELY DISTINCT from each other: different customers, problems, and markets, not five flavours of the same idea. Weight them toward the problems and markets the team ranked highest. For each, write: a short title; a HOOK (one sentence on exactly what the product does — not a mission statement); the PROBLEM (who feels it, what they do about it today, and why existing solutions fail); the SOLUTION (the mechanism and the core insight that makes it different — not a feature list); the MARKET (who pays, how much / how often, and a rough sense of how many of these people exist); and the CUSTOMER (who uses it). Then SCORE each on the Flash evaluation — five criteria, each 0-10 with a one-line, team-specific rationale: realProblem (a genuine, painful, frequent problem people already spend to solve?), founderFit (does THIS team have unique insight, access, or obsession?), rightMoment (a technology, regulatory, cultural, or capital shift making now the time?), flashProof (can we test the core idea cheaply within a week — name the concrete test: a landing page, ~10 customer calls, a spreadsheet), and benefits (clear, measurable value created — time saved, money made, stress or risk reduced). Be specific to THIS team; no generic startup talk.";

// ----- Venture build — staged so each step is small, fast, and reliable -----

export const RESEARCH_SYSTEM =
  "You are a venture research analyst. Use the web_search tool to gather CURRENT (2026) real-world evidence for this opportunity: market size and growth, named competitors / incumbents and what they charge, customer willingness to pay, and financial / pricing benchmarks for comparable businesses. Then write a concise findings brief in bullet points, with concrete numbers and named sources where you found them. Output only the brief.";

export const VENTURE_CORE_SYSTEM =
  "You are Flash. Using the team's synthesis, the chosen opportunity, and a research brief, define the CORE of the single venture they are uniquely placed to build. Be concrete and grounded — no generic startup talk. Produce: a name and a one-sentence thesis; the venture's purpose; what only this team can do; the exact customer and the problem; the Advantage (capability / insight / motivation); the Competition (the incumbent 'gorilla' + the alternatives or non-consumption); a problem-score breakdown (painful 0-5, frequent 0-5, whyNow 0-5, and what they pay today); a Differentiation statement + a clarity score 0-5; 3-5 operating principles; and 3 or more Approach options (each a title + why it's a good idea — never commit to the first idea). Score the venture: problemScore 0-10, solution Painkiller vs Vitamin, spark 0-5, conviction 0-5.";

export const VENTURE_PLAN_SYSTEM =
  "You are Flash. Given the venture's core and a live research brief, produce the market read and the numbers — grounded in the research, never invented round numbers. Produce: a one-line market summary; 3-6 labelled market findings drawn from the research; Financials (a short note + labelled rows derived from the research); the best-fit revenue model (modelId one of: cohort = a paid 8-week cohort, placement = an employer success fee per hire, subscription = a monthly membership / ARR, marketplace = a take rate on placement value) with an annual growth percentage and Year-1 driver values; a research-grounded 3-year revenue range; a short origin story (2-3 paragraphs); a credible 7-day sprint plan (one entry per day or day-range); and a risk register (3-5 risks + mitigations).";

export const VENTURE_LENSES_SYSTEM = `You are Flash. Given the full venture, view it through each Magic Lens and write a one-paragraph reframe for each — concrete and specific to this venture:
${LENS_GUIDE}`;

export type LlmStep = {
  id: string;
  title: string;
  when: string;
  model: string;
  thinking: string;
  effort: string;
  tools: string;
  inputs: string;
  outputs: string;
  system: string;
};

export const LLM_STEPS: LlmStep[] = [
  {
    id: "synthesis",
    title: "Synthesis",
    when: "Once every accepted member's intake is in (lib/synthesis.ts).",
    model: "claude-sonnet-4-6",
    thinking: "adaptive",
    effort: "low",
    tools: "none",
    inputs: `Each member's intake answers, rendered as markdown sections, labelled by a short key (m0, m1…). Plus the 8 skills in fixed order for the energy radar: ${SKILLS.join(", ")}.`,
    outputs: "Structured JSON (json_schema): convergence signals, skillEnergy per member, network, roles, and votable lists of problems / obsessions / markets.",
    system: SYNTHESIS_SYSTEM,
  },
  {
    id: "spaces",
    title: "Candidate ventures",
    when: "After synthesis is confirmed — generated from the team's consensus ranking (lib/opportunity.ts → generateSpaces).",
    model: "claude-sonnet-4-6",
    thinking: "adaptive",
    effort: "low",
    tools: "none",
    inputs: "The consensus-ranked synthesis (problems / obsessions / markets, ranked), roles, network.",
    outputs: "Structured JSON: 5 distinct candidate ventures (title, customer, problem, market, advantage, why-now) each scored 0-10 on problem / market / fit + a scoreNote.",
    system: SPACES_SYSTEM,
  },
  {
    id: "venture-research",
    title: "Venture · research",
    when: "First venture step — bounded live web research on the chosen opportunity (lib/ventures.ts).",
    model: "claude-sonnet-4-6",
    thinking: "disabled",
    effort: "medium",
    tools: "web_search (2 rounds × 2 searches)",
    inputs: "The chosen opportunity space (title, customer, problem, market).",
    outputs: "A free-text research brief: market size/growth, named competitors and pricing, willingness to pay, financial benchmarks.",
    system: RESEARCH_SYSTEM,
  },
  {
    id: "venture-core",
    title: "Venture · core",
    when: "Second venture step — the qualitative core, built on the synthesis + opportunity + research brief.",
    model: "claude-sonnet-4-6",
    thinking: "adaptive",
    effort: "medium",
    tools: "none",
    inputs: "Synthesis summary, the chosen opportunity, and the research brief.",
    outputs: "Structured JSON: name, thesis, purpose, customer, problem, advantage, competition, problem breakdown, differentiation, principles, 3+ approach options, and scores.",
    system: VENTURE_CORE_SYSTEM,
  },
  {
    id: "venture-plan",
    title: "Venture · market & money",
    when: "Third venture step — research-grounded market read, financials, revenue model, origin, sprint, risks.",
    model: "claude-sonnet-4-6",
    thinking: "adaptive",
    effort: "medium",
    tools: "none (uses the research brief)",
    inputs: "The venture core + the research brief.",
    outputs: "Structured JSON: market summary + findings, financials, revenue model + drivers, 3-year revenue range, origin story, 7-day sprint, risk register.",
    system: VENTURE_PLAN_SYSTEM,
  },
  {
    id: "venture-lenses",
    title: "Venture · lenses",
    when: "Final venture step — a reframe through each Magic Lens, then the venture is assembled and saved.",
    model: "claude-sonnet-4-6",
    thinking: "adaptive",
    effort: "medium",
    tools: "none",
    inputs: "The assembled venture (core + market & money).",
    outputs: "Structured JSON: a one-paragraph reframe for each of the 8 Magic Lenses.",
    system: VENTURE_LENSES_SYSTEM,
  },
];
