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
  "You are Flash. From a founding team's confirmed synthesis, birth 4-6 OPPORTUNITY SPACES they're uniquely placed to pursue. Frame each as a small, comparable mini-venture using the Click framework's basics, so the team can vote between them: a short title, the specific customer, the problem they face, the market, why THIS team has an unfair advantage, and a concrete why-now signal. Be specific to THIS team — no generic startup talk.";

export const PESTLE_SYSTEM =
  "You are a market analyst. Use the web_search tool to find CURRENT (2026) real-world signals, then write a PESTLE scan. Ground each finding in what you actually found — concrete trends, policies, numbers. After researching, output ONLY a JSON object (no prose around it) with exactly these keys: political, economic, social, technological, environmental, legal. Each value is one or two sentences.";

// ----- Venture build — staged so each step is small, fast, and reliable -----

export const RESEARCH_SYSTEM =
  "You are a venture research analyst. Use the web_search tool to gather CURRENT (2026) real-world evidence for this opportunity: market size and growth, named competitors / incumbents and what they charge, customer willingness to pay, and financial / pricing benchmarks for comparable businesses. Then write a concise findings brief in bullet points, with concrete numbers and named sources where you found them. Output only the brief.";

export const VENTURE_CORE_SYSTEM =
  "You are Flash. Using the team's synthesis, the chosen opportunity, and a research brief, define the CORE of the single venture they are uniquely placed to build. Be concrete and grounded — no generic startup talk. Produce: a name and a one-sentence thesis; the venture's purpose; what only this team can do; the exact customer and the problem; the Advantage (capability / insight / motivation); the Competition (the incumbent 'gorilla' + the alternatives or non-consumption); a problem-score breakdown (painful 0-5, frequent 0-5, whyNow 0-5, and what they pay today); a Differentiation statement + a clarity score 0-10; 3-5 operating principles; and 3 or more Approach options (each a title + why it's a good idea — never commit to the first idea). Score the venture: problemScore 0-10, solution Painkiller vs Vitamin, spark 0-5, conviction 0-5.";

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
    title: "Opportunity spaces",
    when: "After synthesis is confirmed (lib/opportunity.ts → generateSpaces).",
    model: "claude-sonnet-4-6",
    thinking: "adaptive",
    effort: "low",
    tools: "none",
    inputs: "A summary of the confirmed synthesis: lived problems, obsessions, target markets, roles, network.",
    outputs: "Structured JSON: 4-6 opportunity spaces, each a mini-venture (title, customer, problem, market, advantage, why-now).",
    system: SPACES_SYSTEM,
  },
  {
    id: "pestle",
    title: "PESTLE market scan",
    when: "Alongside opportunity spaces (lib/opportunity.ts → generatePestle). Falls back to authored scan on failure.",
    model: "claude-sonnet-4-6",
    thinking: "disabled",
    effort: "low",
    tools: "web_search (max 2 uses)",
    inputs: "A theme derived from the top market + top problem.",
    outputs: "JSON object with political/economic/social/technological/environmental/legal findings (parsed from prose).",
    system: PESTLE_SYSTEM,
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
