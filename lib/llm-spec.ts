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

export const RESEARCH_SYSTEM =
  "You are a venture research analyst. Use the web_search tool to gather CURRENT (2026) real-world evidence for this opportunity: market size and growth, named competitors / incumbents and what they charge, customer willingness to pay, and financial / pricing benchmarks for comparable businesses. Then write a concise findings brief in bullet points, with concrete numbers and named sources where you found them. Output only the brief.";

export const VENTURES_SYSTEM = `You are Flash. The team has chosen one opportunity. Using their synthesis, the chosen opportunity, and a live research brief, build the SINGLE comprehensive venture they are uniquely placed to build. Real best-effort — fill every field thoroughly and concretely, grounded in the research (especially the market read and financials; financials must be derived from the research, not invented round numbers). Give it a name and a one-sentence thesis. In detail, write: the exact customer and the problem; the Advantage (capability/insight/motivation); the Competition (incumbent gorilla + alternatives/non-consumption); a problem-score breakdown (painful 0-5, frequent 0-5, whyNow 0-5, and what they pay today); a Differentiation statement + a clarity score 0-10; 3-5 operating Principles; a short origin story (2-3 paragraphs); a credible 7-day sprint plan (one entry per day or day-range); a risk register (3-5 risks + mitigations); illustrative-but-research-grounded Financials (a note + labelled rows); and a market read (3-6 labelled findings drawn from the research). Score the venture: problemScore 0-10, solution Painkiller vs Vitamin, spark 0-5, conviction 0-5. earn is a research-grounded 3-year revenue range. Then view the venture through each Magic Lens and write a one-paragraph reframe for each:
${LENS_GUIDE}
No generic startup talk; ground everything in the chosen opportunity, the team, and the research.`;

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
    title: "Venture research (phase 1)",
    when: "When the venture is birthed, before synthesis (lib/ventures.ts → research).",
    model: "claude-sonnet-4-6",
    thinking: "disabled",
    effort: "medium",
    tools: "web_search (max 5 uses, looped up to 8 turns)",
    inputs: "The chosen opportunity space (title, customer, problem, market).",
    outputs: "A free-text research brief: market size/growth, named competitors and pricing, willingness to pay, financial benchmarks.",
    system: RESEARCH_SYSTEM,
  },
  {
    id: "venture-build",
    title: "Venture build (phase 2)",
    when: "Immediately after research, to fill the comprehensive venture (lib/ventures.ts → generateVentures).",
    model: "claude-sonnet-4-6",
    thinking: "adaptive",
    effort: "high",
    tools: "none (uses the phase-1 research brief)",
    inputs: "The synthesis summary, the chosen opportunity, and the phase-1 research brief.",
    outputs: "Structured JSON: the single venture (name, thesis, scores) + detail (customer, problem, advantage, competition, problem breakdown, differentiation, principles, origin, 7-day sprint, risks, financials, market read) + a per-lens reframe.",
    system: VENTURES_SYSTEM,
  },
];
