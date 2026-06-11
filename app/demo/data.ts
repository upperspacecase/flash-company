// Clickable prototype content for Flash Company — feature spec v2 (June 02).
// One sprint: a 3-person cohort answers a 15-question intake, the agent
// synthesises opportunity spaces and venture outlines, the team votes and
// picks one ("Relaunch"), then validates it.
// Phases: Invite -> Input -> Synthesis -> Ventures -> Validation.

export type IconName =
  | "people" | "group" | "user" | "bolt" | "alert" | "sparkle" | "link" | "mic"
  | "image" | "doc" | "laptop" | "store" | "building" | "target" | "check"
  | "star" | "clock" | "calendar" | "scale" | "chart" | "thumb" | "lock"
  | "play" | "coins" | "message" | "minus" | "send" | "pause" | "refresh"
  | "copy" | "shield" | "heart" | "comment";

export const AGENT_NAME = "Flash";
export const TAGLINE = "Build together. Start clearly.";

export const SPRINT = { windowHours: 48, freeHours: 24 };

// Buy-in per person for the full sprint (EUR — EU-only audience). Charged on
// accept; see the Invite phase.
export const PRICE = { perPerson: 10, currency: "€" };

export type Member = {
  id: string;
  name: string;
  initials: string;
  role: string;
  brings: string;
  accepted: boolean;
  ring: string;
  dot: string;
};

export const COHORT: Member[] = [
  { id: "maya", name: "Maya", initials: "MA", role: "Community & GTM", brings: "Runs a 4k-member community for new parents", accepted: true, ring: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  { id: "alex", name: "Alex", initials: "AL", role: "Product & Eng", brings: "Full-stack, ex-fintech", accepted: true, ring: "bg-sky-100 text-sky-700", dot: "bg-sky-500" },
  { id: "priya", name: "Priya", initials: "PR", role: "Brand & Content", brings: "Designer with a creator network", accepted: false, ring: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
];

export const YOU = "maya";
export const memberById = (id: string) => COHORT.find((m) => m.id === id)!;

export const PHASES = [
  { id: "invite", label: "Invite", blurb: "Share a link. The team forms when everyone accepts." },
  { id: "input", label: "Input", blurb: "Each person answers privately. Typed or voice." },
  { id: "synthesis", label: "Synthesis", blurb: "The agent maps the team and surfaces problems, obsessions, and markets to confirm and narrow into a focus." },
  { id: "opportunity", label: "Opportunity", blurb: "Agree broad opportunity spaces, research them, and birth candidate ventures." },
  { id: "ventures", label: "Ventures", blurb: "Pick a birthed venture and flesh it out." },
  { id: "validation", label: "Validation", blurb: "Assets to test, feedback synthesis, and the 7/14/21/30 check-ins." },
] as const;

// ------------------------------------------------------------- Invite

export const INVITE = {
  url: "flashco.org/s/k7m2qp",
  note: "No app download. No account creation. Just a link.",
  forms: "The team forms when everyone accepts — then the 48-hour window starts (or the invite auto-expires).",
  members: COHORT,
};

// -------------------------------------------------------------- Input
// A persona data-dump: six sections of mixed-format questions. Pure intake —
// answers are NOT yet wired to anything downstream. The logic for turning these
// into opportunity spaces and ventures comes later.

export type IntakeField =
  | { kind: "short"; voice?: boolean; max?: number; placeholder?: string }
  | { kind: "long"; voice?: boolean; max?: number; placeholder?: string }
  | { kind: "slider"; min: number; max: number; step: number; unit?: string }
  | { kind: "location"; placeholder?: string }
  | { kind: "multiSelect"; options: string[]; allowOther?: boolean }
  | { kind: "ranked"; options: string[] }; // ranked multi-select + an optional note

export type IntakeQuestion = { id: string; q: string; help?: string; optional?: boolean; field: IntakeField };
export type IntakeSection = { id: string; title: string; blurb: string; questions: IntakeQuestion[] };

const LANGUAGES = ["English", "Spanish", "Portuguese", "Mandarin", "French", "German", "Italian", "Greek", "Japanese", "Arabic", "Hindi"];
const ROLE_OPTIONS = ["Founder/CEO", "CTO/Technical lead", "Product manager", "Designer", "Engineer/Developer", "Sales/Business dev", "Marketing/Growth", "Operations", "Consultant/Advisor", "Researcher/Analyst", "Freelancer"];
const INDUSTRY_OPTIONS = ["Tech/Startup", "Real estate", "Rural land", "Agriculture", "Creative/Design", "Health/Wellness", "Education", "Finance", "Hospitality", "Environmental"];
const PUT_IN_OPTIONS = ["Money", "Tools", "Audience", "Introductions", "Space/Equipment"];

// Every free-text question accepts a voice note except the name.
export const INTAKE: IntakeSection[] = [
  {
    id: "identity", title: "Identity & anchor", blurb: "The basics — who you are and where you're based.",
    questions: [
      { id: "name", q: "What's your name?", field: { kind: "short", placeholder: "Your name" } },
      { id: "email", q: "What's your email?", help: "So we can ping you when your synthesis is ready and your teammates finish. No spam.", field: { kind: "short", placeholder: "you@email.com" } },
      { id: "location", q: "What's your primary location?", help: "As specific as you like — city, region, or exact spot. We'll infer your timezone.", field: { kind: "location", placeholder: "Where are you based?" } },
      { id: "otherLocations", q: "Any other locations that shaped who you are?", help: "Comma-separated. As specific as you like.", optional: true, field: { kind: "short", placeholder: "e.g. Lisbon, rural Otago, Berlin" } },
      { id: "languages", q: "What languages do you speak fluently?", field: { kind: "multiSelect", options: LANGUAGES, allowOther: true } },
    ],
  },
  {
    id: "done", title: "What you've done", blurb: "Track record — what you've built and learned.",
    questions: [
      { id: "built", q: "What have you built, sold, or run before — even something small?", field: { kind: "long", voice: true, max: 500 } },
      { id: "roles", q: "What roles have you held in the past 5 years?", field: { kind: "multiSelect", options: ROLE_OPTIONS, allowOther: true } },
      { id: "orgs", q: "What organisations have you worked for or with?", help: "The most significant — companies, startups, nonprofits, agencies, projects. If they're not well known, add a little context.", field: { kind: "long", voice: true, max: 500 } },
      { id: "achievements", q: "What major achievements have you made in those roles?", help: "Specific outcomes — revenue, users, systems built, teams led, problems solved.", field: { kind: "long", voice: true, max: 500 } },
      { id: "failure", q: "Tell us about a time you failed and what you learned.", field: { kind: "long", voice: true, max: 500 } },
    ],
  },
  {
    id: "bring", title: "What you bring", blurb: "Your edge — the things you're genuinely strong at.",
    questions: [
      { id: "greatAt", q: "What are you genuinely great at? Not good — great.", field: { kind: "short", voice: true, max: 200 } },
      { id: "paidFor", q: "What have people paid you for?", field: { kind: "short", voice: true, max: 200 } },
      { id: "superpowers", q: "What are your hidden superpowers others overlook?", field: { kind: "short", voice: true, max: 500 } },
    ],
  },
  {
    id: "work", title: "How you work", blurb: "How you operate, decide, and handle friction.",
    questions: [
      { id: "decisions", q: "How do you make decisions?", help: "Pick any that fit.", field: { kind: "multiSelect", options: ["Fast gut", "Slow data", "Talk it out", "Wait for clarity"], allowOther: true } },
      { id: "pressure", q: "How are you under pressure?", help: "Pick any that fit.", field: { kind: "multiSelect", options: ["Push harder", "Step back", "Freeze", "Find flow"], allowOther: true } },
      { id: "conflict", q: "How do you prefer to handle conflict?", help: "Pick any that fit.", field: { kind: "multiSelect", options: ["Direct", "Avoidant", "Mediate", "Escalate"], allowOther: true } },
      { id: "comms", q: "How do you prefer to communicate?", help: "Tap in order of preference.", field: { kind: "ranked", options: ["Text", "Voice memo", "Video call", "In-person"] } },
      { id: "energizes", q: "What work energises you?", field: { kind: "short", voice: true, max: 200 } },
      { id: "drains", q: "What work drains you?", field: { kind: "short", voice: true, max: 200 } },
      { id: "boundary", q: "What's your absolute boundary — what makes you quit?", field: { kind: "long", voice: true, max: 500 } },
    ],
  },
  {
    id: "putIn", title: "What you'll put in", blurb: "Who you can reach, and what you can commit.",
    questions: [
      { id: "industries", q: "What industries or communities are you embedded in?", field: { kind: "multiSelect", options: INDUSTRY_OPTIONS, allowOther: true } },
      { id: "market", q: "What's a market you can reach that most people can't?", field: { kind: "short", voice: true, max: 200 } },
      { id: "hours", q: "How many hours per week can you commit?", field: { kind: "slider", min: 0, max: 60, step: 5, unit: "hrs/wk" } },
      { id: "runway", q: "How many months of financial runway without income?", field: { kind: "slider", min: 0, max: 24, step: 1, unit: "months" } },
      { id: "putIn", q: "Beyond time, what can you put in?", help: "Money, tools, an audience, introductions.", field: { kind: "multiSelect", options: PUT_IN_OPTIONS, allowOther: true } },
    ],
  },
  {
    id: "why", title: "Why you care & what you see", blurb: "The spark — what you notice and what drives you.",
    questions: [
      { id: "trend", q: "What inefficiency, annoying problem, or shifting trend in your industry over the last 6 months keeps bouncing around in your head?", field: { kind: "long", voice: true, max: 500 } },
      { id: "forFree", q: "What do you love doing so much that you'd do it for free?", field: { kind: "short", voice: true, max: 500 } },
      { id: "obsessed", q: "What are you obsessed with that isn't logical?", field: { kind: "short", voice: true, max: 200 } },
      { id: "changeWorld", q: "If you could change one thing about the world, what would it be?", field: { kind: "short", voice: true, max: 200 } },
    ],
  },
];

export const INTAKE_TOTAL = INTAKE.reduce((n, s) => n + s.questions.length, 0);

// ----------------------------------------------------------- Synthesis

export type Signal = { icon: IconName; kind: string; tone: "good" | "warn"; text: string };

export const CONVERGENCE_SIGNALS: Signal[] = [
  { icon: "group", kind: "Overlap", tone: "good", text: "Returning to work after a break surfaced independently across all three intakes." },
  { icon: "alert", kind: "Tension", tone: "warn", text: "Strong demand from parents vs. employer hesitancy about career gaps." },
  { icon: "minus", kind: "Gap", tone: "good", text: "No trusted, supportive path back — only cold job boards." },
  { icon: "sparkle", kind: "Hidden complementarity", tone: "good", text: "Maya's community (distribution) + Alex's platform + Priya's brand and content." },
  { icon: "chart", kind: "Market signal", tone: "good", text: "The motherhood penalty and the rise of returnships put timing on your side." },
];

// --- Team ---

// Energy/skill map. 0–5 energy per skill: high = it energises you ("create"),
// low = it drains you. Editable in the demo.
export const SKILLS = ["Product", "Engineering", "Design", "Sales & GTM", "Community", "Ops & Finance", "Brand", "Research"];
export const SKILL_ENERGY: Record<string, number[]> = {
  maya: [3, 1, 2, 4, 5, 2, 4, 3],
  alex: [4, 5, 2, 2, 1, 4, 1, 3],
  priya: [2, 1, 5, 3, 3, 1, 5, 2],
};

// Network map — industry- and location-based opportunities.
export type NetworkNode = { name: string; kind: "industry" | "location"; members: string[]; opportunity: string };
export const NETWORK: NetworkNode[] = [
  { name: "Parent communities", kind: "industry", members: ["maya"], opportunity: "Warm distribution to thousands of returning parents." },
  { name: "Fintech", kind: "industry", members: ["alex"], opportunity: "Compliance rigor; payments and payroll know-how." },
  { name: "Creator & design", kind: "industry", members: ["priya"], opportunity: "A content engine and a network of creators for reach." },
  { name: "Auckland, NZ", kind: "location", members: ["maya", "priya"], opportunity: "Local employer pilots and in-person cohort events." },
  { name: "Remote / global", kind: "location", members: ["alex"], opportunity: "Async build; reach beyond a single city." },
];

// Proposed roles & tasks (editable, confirmable).
export const SYNTH_ROLES = [
  { memberId: "maya", role: "Community & GTM", tasks: "Recruit cohorts; own brand voice and member trust." },
  { memberId: "alex", role: "Product & Engineering", tasks: "Build the platform, signup, and employer-intro flow." },
  { memberId: "priya", role: "Brand & Content", tasks: "Run the comeback-story content engine and brand." },
];

// --- Opportunity ---

// Votable lists. `votes` is seeded for the later Opportunity-spaces and Ventures
// pages, where voting happens; Synthesis itself only confirms, edits, and vetoes.
export type Votable = { id: string; text: string; votes: number };

export const LIVED_PROBLEMS: Votable[] = [
  { id: "reentry", text: "Parents can't find a supportive path back to work after a break.", votes: 2 },
  { id: "gap", text: "A career gap gets you screened out before a human ever sees you.", votes: 2 },
  { id: "confidence", text: "Confidence erodes during time out — people stop applying.", votes: 1 },
  { id: "flex", text: "'Flexible' roles are rarely actually flexible.", votes: 1 },
  { id: "isolation", text: "Returning is lonely — no peers going through the same thing.", votes: 0 },
];

export const OBSESSIONS: Votable[] = [
  { id: "capable", text: "Helping capable people feel capable again after a setback.", votes: 2 },
  { id: "comeback", text: "The comeback story — making returning feel normal, not shameful.", votes: 2 },
  { id: "matching", text: "Matching hidden talent to the employers who'd value it.", votes: 1 },
  { id: "secondact", text: "Second-act careers and reinvention at any age.", votes: 1 },
];

export const TARGET_MARKETS: Votable[] = [
  { id: "parents", text: "Parents returning after a 1–5 year break.", votes: 3 },
  { id: "employers", text: "Employers running structured returnship programmes.", votes: 1 },
  { id: "carers", text: "Carers returning after time out for family.", votes: 1 },
  { id: "changers", text: "Mid-career changers re-entering a new field.", votes: 1 },
  { id: "expats", text: "Returning expats rebuilding a local network.", votes: 0 },
  { id: "students", text: "Mature students entering the workforce late.", votes: 0 },
];

// The full bundle the Synthesis phase renders. In the demo it's the authored
// mock below; in the live flow it's generated by Claude from the real intakes
// (see lib/synthesis.ts) — same shape, keyed by real member ids.
export type SynthesisData = {
  convergence: Signal[];
  skillEnergy: Record<string, number[]>;
  network: NetworkNode[];
  roles: { memberId: string; role: string; tasks: string }[];
  problems: Votable[];
  obsessions: Votable[];
  markets: Votable[];
};

export function mockSynthesisData(): SynthesisData {
  return {
    convergence: CONVERGENCE_SIGNALS.map((s) => ({ ...s })),
    skillEnergy: { maya: [...SKILL_ENERGY.maya], alex: [...SKILL_ENERGY.alex], priya: [...SKILL_ENERGY.priya] },
    network: NETWORK.map((n) => ({ ...n })),
    roles: SYNTH_ROLES.map((r) => ({ ...r })),
    problems: LIVED_PROBLEMS.map((p) => ({ ...p })),
    obsessions: OBSESSIONS.map((p) => ({ ...p })),
    markets: TARGET_MARKETS.map((p) => ({ ...p })),
  };
}

// ---------------------------------------------------- Opportunity spaces
// Before agreeing a venture, the group agrees a broad opportunity space. These
// are fed by the synthesis voting (top problems × obsessions × markets). Votes
// here are seeded from the other two members.
// Each opportunity is a small, researched mini-venture — enough to compare and
// vote on — framed with the Click "basics" the venture step uses as guides.
export type OpportunitySpace = {
  id: string;
  title: string;
  customer: string;
  problem: string;
  market: string;
  advantage: string; // why this team
  whyNow: string;
  votes: number;
};

export const OPPORTUNITY_SPACES: OpportunitySpace[] = [
  { id: "reentry", title: "Guided re-entry", customer: "Parents returning to work after a career break.", problem: "Going back is cold and confidence-eroding; job boards screen out the gap.", market: "Millions of returners a year; returnship demand is climbing.", advantage: "A trusted 4,000-parent community and a team that's lived the comeback.", whyNow: "Returnships are going mainstream and tight labour markets prize overlooked talent.", votes: 3 },
  { id: "employer", title: "Employer returnships", customer: "Companies that want to hire from an overlooked talent pool.", problem: "They can't read a career gap and miss capable candidates.", market: "Enterprise talent + DEI budgets; returnship programmes scaling.", advantage: "Warm access to returners plus insight into what employers misread.", whyNow: "Returnship incentives and DEI pressure make this fundable now.", votes: 1 },
  { id: "confidence", title: "Confidence & coaching", customer: "Returners whose self-belief eroded during time out.", problem: "The block isn't skills — it's confidence and a broken signal.", market: "Coaching and upskilling spend; large and fragmented.", advantage: "A brand that's lived the comeback and a community to coach within.", whyNow: "The motherhood penalty is in the spotlight; returning is being destigmatised.", votes: 1 },
  { id: "community", title: "Returner community", customer: "Parents who need peers, leads, and accountability for the comeback.", problem: "Re-entry is isolating; there's no trusted place for warm intros and momentum.", market: "Community plus jobs; recurring-membership potential.", advantage: "An existing 4,000-member community to build the flywheel on.", whyNow: "Warm intros and word-of-mouth compound fastest right now.", votes: 2 },
];

// Stage 3 market research — PESTLE's six dimensions, run against the agreed
// opportunity space. The generative reframes live in the Lenses (angles) below.
// Illustrative for the demo.
export type ResearchLens = { key: string; label: string; finding: string };
export const RESEARCH_LENSES: ResearchLens[] = [
  { key: "political", label: "Political", finding: "Government returnship incentives and parental-leave reform are active tailwinds." },
  { key: "economic", label: "Economic", finding: "Tight labour markets make overlooked talent valuable; households need a second income." },
  { key: "social", label: "Social", finding: "The motherhood penalty is in the spotlight; returning is being destigmatised." },
  { key: "technological", label: "Technological", finding: "Remote / hybrid tooling makes flexible re-entry viable; AI screening can be reframed in your favour." },
  { key: "environmental", label: "Environmental", finding: "Less commuting and local, flexible work align with rising sustainability expectations." },
  { key: "legal", label: "Legal", finding: "Flexible-work and anti-discrimination rights are strengthening; gap-based screening is a growing legal risk." },
];

// ------------------------------------------------------------ Ventures

// The comprehensive, research-grounded venture the birth step fills in. Seeds the
// editable venture page; rendered/edited live (not just the read-only summary).
export type VentureDetail = {
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
  market: { label: string; finding: string }[]; // research-grounded market read
  approaches: { title: string; why: string }[]; // Click "Approach" options (>=3)
  revenue: { modelId: string; growth: number; drivers: { key: string; value: number }[] };
};

export type Venture = {
  id: string;
  name: string;
  thesis: string;
  problemScore: number; // /10
  solution: "Painkiller" | "Vitamin";
  market: string;
  differentiation: string;
  purpose: string;
  unique: string;
  earn: string; // projected 3-yr range (illustrative)
  votes: number;
  spark: number;
  conviction: number;
  recommended?: boolean;
  lenses?: Lens[]; // Magic Lenses — generated for this venture's Approach
  detail?: VentureDetail; // comprehensive research-grounded fill (live)
};

export const VENTURES: Venture[] = [
  {
    id: "relaunch",
    name: "Relaunch",
    thesis: "An 8-week guided returnship cohort that gets parents back to work, for parents after a career break, now that returnships are going mainstream.",
    problemScore: 9,
    solution: "Painkiller",
    market: "Parents returning after a break — reachable through Maya's 4k community and similar networks.",
    differentiation: "Community + cohort ops + real employer intros in one path. Not a job board.",
    purpose: "Help capable people feel capable again after a setback.",
    unique: "Only this trio can pair a trusted parent community, a builder, and a brand voice that's lived the comeback.",
    earn: "$120k–600k by year 3 (illustrative)",
    votes: 3,
    spark: 5,
    conviction: 5,
    recommended: true,
  },
  {
    id: "flexmatch",
    name: "FlexMatch",
    thesis: "A matching service pairing returners with genuinely flexible roles, for returning parents and flexible employers, now that flexible work is the default ask.",
    problemScore: 7,
    solution: "Vitamin",
    market: "Returners + employers offering flexible roles.",
    differentiation: "Supply-side trust via Maya's community.",
    purpose: "Make flexible work findable.",
    unique: "Warm supply, but the team has no two-sided marketplace experience.",
    earn: "$80k–400k by year 3 (illustrative)",
    votes: 1,
    spark: 3,
    conviction: 3,
  },
  {
    id: "comeback",
    name: "The Comeback",
    thesis: "A content brand and community for career returners, for anyone restarting a career, now that the comeback story resonates widely.",
    problemScore: 6,
    solution: "Vitamin",
    market: "Career returners across fields.",
    differentiation: "Priya's content engine + Maya's audience.",
    purpose: "Make returning feel normal, not shameful.",
    unique: "Strong top-of-funnel — better as Relaunch's front door than a standalone business.",
    earn: "$40k–250k by year 3 (illustrative)",
    votes: 2,
    spark: 4,
    conviction: 3,
  },
  {
    id: "returnos",
    name: "ReturnOS",
    thesis: "Returnship-as-a-service for employers, for companies that want returner talent, now that hiring pools are tight.",
    problemScore: 7,
    solution: "Painkiller",
    market: "Employers wanting structured returnships.",
    differentiation: "Programme ops + outcome reporting.",
    purpose: "Open the door employers keep shut.",
    unique: "Real, but B2B and slower — better once consumer traction exists.",
    earn: "$100k–800k by year 3 (illustrative)",
    votes: 1,
    spark: 3,
    conviction: 4,
  },
  {
    id: "confidence",
    name: "Confidence Lab",
    thesis: "Coaching that rebuilds confidence after a career break, for returners who feel rusty, now that re-entry anxiety is widely felt.",
    problemScore: 6,
    solution: "Vitamin",
    market: "Returners lacking confidence to re-enter.",
    differentiation: "Outcome focus on confidence + re-employment.",
    purpose: "Restore self-belief.",
    unique: "Meaningful, but a feature of Relaunch more than a business on its own.",
    earn: "$50k–300k by year 3 (illustrative)",
    votes: 1,
    spark: 4,
    conviction: 3,
  },
];

export const CHOSEN_ID = "relaunch";

// -------------------------------------------------- Full venture details

export type TeamRole = {
  memberId: string;
  role: string;
  responsibility: string;
  tasks: string;
  equity: number;
  resource: string; // time / capital / skills / connections
};

export type Commitment = { memberId: string; statement: string; recorded: boolean };

export const VENTURE_DETAILS = {
  name: "Relaunch",
  thesis: "An 8-week guided returnship cohort that gets parents back to work, with community, real employer intros, and rebuilt confidence.",
  origin: [
    "All three of you, separately, pointed at the same wall: capable parents who want back into work and have no supportive way in. Maya hears it weekly from a 4,000-person community; Alex has watched skilled friends get screened out for a gap; Priya keeps being asked to tell the comeback story.",
    "Put together, you're a path no one of you could build alone — trusted distribution, a platform to run cohorts, and a brand that's lived the comeback. That's the 'only we can do this' moment: community + product + story, aimed at a problem all three of you can't stop noticing.",
  ],
  team: [
    { memberId: "maya", role: "CEO · Community & GTM", responsibility: "Recruit cohorts; own the brand voice and member trust.", tasks: "Open a waitlist to the community; run the first cohort.", equity: 40, resource: "20 hrs/wk · 4k-member audience · course-selling track record" },
    { memberId: "alex", role: "CTO · Product & Eng", responsibility: "Build the cohort platform, signup, and employer intro flow.", tasks: "Ship the landing page + signup; wire up intros.", equity: 35, resource: "25 hrs/wk · full-stack build · fintech rigor" },
    { memberId: "priya", role: "CMO · Brand & Content", responsibility: "Run the comeback-story content engine and brand.", tasks: "Publish 3 comeback stories; design the brand.", equity: 25, resource: "15 hrs/wk · creator network · design" },
  ] as TeamRole[],
  financials: {
    note: "Illustrative starting model — replace with real numbers as you test.",
    rows: [
      { label: "Income / pricing", value: "Paid cohort seat (~$250/parent), later employer placement fees" },
      { label: "Revenue (yr 1)", value: "Illustrative: 6 cohorts × 12 seats ≈ $180k" },
      { label: "Costs", value: "Coaching time, platform, content, employer outreach" },
    ],
  },
  sprint: [
    { days: "Day 1–2", text: "Validation probe — landing page to the community, measure signups." },
    { days: "Day 3–4", text: "Customer conversations / a simple prototype / employer intros." },
    { days: "Day 5–6", text: "Synthesise learnings — what's resonating, what's not." },
    { days: "Day 7", text: "Go / no-go decision." },
  ],
  risks: [
    { risk: "Parents won't pay before seeing results.", mitigation: "Offer a pay-on-placement or partial-refund pilot." },
    { risk: "Employers won't interview returners.", mitigation: "Pre-line 5 warm employer intros before the cohort starts." },
    { risk: "Cohort ops don't scale.", mitigation: "Cap the pilot at 12 and templatise everything." },
  ],
  commitments: [
    { memberId: "maya", statement: "I'm in for 7 days. My first task is to open a waitlist to my community.", recorded: true },
    { memberId: "alex", statement: "I'm in for 7 days. My first task is to ship the signup + intro flow.", recorded: true },
    { memberId: "priya", statement: "I'm in for 7 days. My first task is to publish 3 comeback-story posts.", recorded: false },
  ] as Commitment[],
};

// ----------------------------------------------------------- Validation

// The chosen venture — the deck and landing page below are generated from it
// plus the team, financials, and traction surfaced in the earlier phases.
const CHOSEN = VENTURES.find((v) => v.id === CHOSEN_ID)!;

// A pitch-deck slide. `kind` drives the layout; everything else is content
// pulled forward from the venture outline, team map, and validation plan.
export type DeckSlide = {
  label: string; // YC slide name, shown as the kicker
  headline: string;
  points?: string[];
  kind?: "title" | "market" | "team" | "traction" | "ask";
  footnote?: string;
  team?: { memberId: string; role: string; equity: string }[]; // for the team slide, fed from the cap table
};

export const VALIDATION = {
  // Hosted by us once the team publishes the page.
  liveUrl: "flashco.app/v/relaunch",
  // Live signups feed the validation dashboard (seeded for the demo).
  liveMetrics: [
    { label: "Visitors", value: "318" },
    { label: "Signups", value: "47" },
    { label: "Signup rate", value: "14.8%" },
    { label: "Calls booked", value: "9" },
  ],
  // Each thing we're testing -> the live signal that proves or kills it.
  scorecard: [
    { test: "Parents will join the waitlist", metric: "Signups", value: 47, target: 50 },
    { test: "1 in 4 will book a call", metric: "Calls booked", value: 9, target: 12 },
    { test: "Employers take a warm intro", metric: "Intros accepted", value: 3, target: 5 },
  ],
  // Built on the proven 5-part landing formula:
  // value (1) -> how (2) -> visual (3) -> social proof (4) -> next step (5).
  landing: {
    headline: "Your career didn't end. It paused.", // 1 · value
    subhead: "Relaunch is an 8-week guided cohort that gets parents back to work — a community that gets it, real employer intros, and your confidence rebuilt.", // 2 · how
    visualCaption: "See how an 8-week Relaunch cohort works", // 3 · visual
    proof: { stat: "Trusted by 4,000+ parents", detail: "From Maya's community and a sold-out course — 80 parents, twice over." }, // 4 · social proof
    cta: "Join the next cohort", // 5 · next step
  },
  outreach: {
    linkedin: "If you paused your career to raise kids, going back can feel like starting from zero. It shouldn't.\n\nWe're piloting Relaunch — an 8-week guided cohort that gets parents back to work with community, real employer intros, and rebuilt confidence. Comment 'relaunch' for a spot.",
    dm: "Hey {name} — you mentioned wanting to go back to work but not knowing where to start. We're running a small guided cohort for exactly that. Want the details?",
    email: "Subject: a guided way back to work\n\nHi {name},\n\nGoing back after a break is hard — cold job boards and employer bias don't help. Relaunch is an 8-week guided cohort built for returning parents: community, real employer intros, and rebuilt confidence.\n\nWe're taking a small pilot cohort. Want in?\n\nMaya — Relaunch",
    whatsapp: "Hi {name}! Running a small 8-week cohort for parents going back to work — community + employer intros + confidence. Pilot spots are limited. Keen?",
  },
  sendTarget: "Each founder sends the assets to 10–20 people for first feedback.",
  feedbackEdits: [
    "Lead with 'employer intros' — testers cared more about that than community.",
    "Add a price anchor; people asked 'how much?' before booking.",
    "Swap 'cohort' for 'programme' — clearer to first-timers.",
  ],
  feedbackNote: "Feedback aggregates into the shared agent, which suggests edits to the venture outline. Nothing here is measured yet — these are example suggestions.",
  checkins: [
    { day: "Day 7", status: "active", text: "Did the waitlist fill? What surprised you?" },
    { day: "Day 14", status: "locked", text: "How are calls and employer intros tracking?" },
    { day: "Day 21", status: "locked", text: "Confidence lift? Any churn?" },
    { day: "Day 30", status: "locked", text: "Go / no-go, and rebalance roles & equity." },
  ],
};

// -------------------------------------- Editable venture detail (Click-aligned)
// The chosen venture's working draft — everything below is editable in the demo.

// Problem score, broken down: how painful, how frequent, why now, and what
// people already pay to solve it today. Sub-scores are 0–5.
export const PROBLEM_BREAKDOWN = {
  painful: 5,
  frequent: 4,
  whyNow: 5,
  payNow: "Parents already pay $1–3k for coaching and bootcamps with worse fit.",
};

// Differentiation, Click-style — "differentiation makes products click."
// A statement plus a clarity score (the founder's-advantage detail now lives
// in the editable Advantage block: capability / insight / motivation).
export const DIFFERENTIATION = {
  statement: "Community + cohort ops + real employer intros, in one path. Not a job board.",
  clarity: 4, // 0–5
};

// The Click validation scorecard — the six questions validation answers.
export const SCORECARD = [
  { key: "rightCustomer", label: "Right customer?" },
  { key: "rightProblem", label: "Right problem?" },
  { key: "rightApproach", label: "Right approach?" },
  { key: "willSwitch", label: "Will they switch?" },
  { key: "rightDifferentiation", label: "Right differentiation?" },
  { key: "doesItClick", label: "Does it click?" },
] as const;

export type ScorecardKey = (typeof SCORECARD)[number]["key"];

// Earning potential — each model is a real bottoms-up build a founder would
// put in front of a VC: editable Year-1 drivers + an annual growth rate, which
// compute a 3-year revenue ramp. Different models -> different revenues.
export type RevDriver = { key: string; label: string; value: number; prefix?: string; suffix?: string };
export type RevenueModel = {
  id: string;
  label: string;
  pitch: string; // the one-liner a founder gives a VC
  unit: string; // headline metric, e.g. "revenue" or "ARR"
  growth: number; // default % annual growth
  drivers: RevDriver[]; // Year-1 assumptions
  fits: string;
  doesnt: string;
};

export const REVENUE_MODELS: RevenueModel[] = [
  {
    id: "cohort",
    label: "Paid cohort",
    pitch: "Parents pay per seat in an 8-week cohort; we add cohorts as the community grows.",
    unit: "revenue",
    growth: 80,
    drivers: [
      { key: "cohorts", label: "Cohorts / year", value: 6 },
      { key: "seats", label: "Seats / cohort", value: 12 },
      { key: "price", label: "Price / seat", value: 250, prefix: "$" },
    ],
    fits: "Matches the 8-week format and a community that already buys courses.",
    doesnt: "Revenue is lumpy — tied to cohort cadence, not recurring.",
  },
  {
    id: "placement",
    label: "Placement fee",
    pitch: "Employers pay a success fee for every vetted returner we place into a role.",
    unit: "revenue",
    growth: 120,
    drivers: [
      { key: "placements", label: "Placements / year", value: 20 },
      { key: "fee", label: "Fee / placement", value: 4000, prefix: "$" },
    ],
    fits: "Employers pay well for vetted returner hires.",
    doesnt: "Slower B2B sale; needs proven placement outcomes first.",
  },
  {
    id: "subscription",
    label: "Membership",
    pitch: "Returners pay monthly for ongoing community, coaching, and intros — recurring ARR.",
    unit: "ARR",
    growth: 140,
    drivers: [
      { key: "members", label: "Members", value: 300 },
      { key: "price", label: "Price / month", value: 25, prefix: "$" },
    ],
    fits: "Smooths revenue into predictable ARR across an ongoing community.",
    doesnt: "Hard to justify a monthly charge once someone is back at work.",
  },
  {
    id: "marketplace",
    label: "Marketplace",
    pitch: "We take a cut of the placement value flowing through a returner–employer marketplace.",
    unit: "revenue",
    growth: 180,
    drivers: [
      { key: "gmv", label: "Placement value / year", value: 400000, prefix: "$" },
      { key: "take", label: "Take rate", value: 12, suffix: "%" },
    ],
    fits: "Scales fast if two-sided liquidity ever arrives.",
    doesnt: "No marketplace experience on the team; cold-start risk.",
  },
];

// Year-1 revenue from a model's drivers.
export function revenueYear1(id: string, d: Record<string, number>): number {
  switch (id) {
    case "cohort": return (d.cohorts || 0) * (d.seats || 0) * (d.price || 0);
    case "placement": return (d.placements || 0) * (d.fee || 0);
    case "subscription": return (d.members || 0) * (d.price || 0) * 12;
    case "marketplace": return (d.gmv || 0) * ((d.take || 0) / 100);
    default: return 0;
  }
}

// 3-year build: Year 1 grown by the annual growth rate.
export function revenueBuild(id: string, d: Record<string, number>, growth: number): number[] {
  const y1 = revenueYear1(id, d);
  const g = 1 + (growth || 0) / 100;
  return [y1, y1 * g, y1 * g * g];
}

export function revenueDefaults(m: RevenueModel) {
  return { id: m.id, growth: m.growth, drivers: Object.fromEntries(m.drivers.map((d) => [d.key, d.value])) };
}

// Cap table — equity blank to start, standard founder vesting + an option pool.
export const CAP_TABLE = { pool: 10, vestingDefault: "4 yr · 1 yr cliff" };

// Click "Approach" — never commit to the first idea. Generate at least three
// options; each is a one-pager (title, why it's a good idea, a quick sketch).
export type ApproachOption = { id: string; title: string; why: string };
export const APPROACH_OPTIONS: ApproachOption[] = [
  { id: "cohort", title: "Guided 8-week cohort", why: "A supported group programme that gets parents back to work — community plus warm employer intros." },
  { id: "concierge", title: "1:1 concierge placement", why: "High-touch, done-for-you placement at a premium — proves demand before building any ops." },
  { id: "marketplace", title: "Self-serve returner marketplace", why: "Returners and flexible employers match themselves — scales, but needs two-sided liquidity first." },
];

// In-depth market report — generated on demand from the team's inputs + public
// data. Illustrative for the demo.
export const MARKET_REPORT = {
  summary: "Millions of parents return to work each year — a large, under-served re-entry market with strong tailwinds.",
  stats: [
    { label: "TAM", value: "~$12B", note: "Global career re-entry, coaching & placement spend" },
    { label: "SAM", value: "~$1.4B", note: "English-speaking returning parents" },
    { label: "SOM · yr 1", value: "~$2–4M", note: "Reachable through communities like Maya's" },
  ],
  trends: [
    "Returnship programmes are going mainstream at major employers.",
    "The motherhood penalty is in the policy and media spotlight.",
    "Flexible / hybrid roles are the default ask, widening re-entry paths.",
  ],
  segments: [
    "Parents 0–3 yrs out — highest confidence, fastest to place.",
    "Parents 3–7 yrs out — need the most support; highest willingness to pay.",
    "Career-changers returning — adjacent, larger, lower intent.",
  ],
  competition: "Job boards (broad, cold), returnship bootcamps (expensive, one-off), Facebook groups (free, unstructured).",
  sources: ["Team intake — 3 founders", "Labour-force participation data", "Returnship programme directories", "Community survey signals"],
};

export type VentureDraft = {
  thesis: string;
  // Click "Basics" — Customer, Advantage, Competition.
  basics: { customer: string; problem: string };
  advantage: { capability: string; insight: string; motivation: string };
  competition: { gorilla: string; alternatives: string };
  purpose: string;
  problem: { painful: number; frequent: number; whyNow: number; payNow: string };
  // Click "Differentiation" — the statement, a clarity score, and operating principles.
  differentiation: { statement: string; clarity: number };
  principles: string[];
  // Click "Approach" — the options (≥3) and the chosen one.
  approaches: ApproachOption[];
  approachId: string;
  revenue: { id: string; growth: number; drivers: Record<string, number> };
  unique: string;
  scorecard: Record<ScorecardKey, boolean>; // the Click validation scorecard
  capTable: { pool: number; rows: { memberId: string; role: string; responsibility: string; equity: string; vesting: string }[] };
  lenses: Lens[]; // Click "Approach" — Magic Lenses on the chosen venture
};

// A working draft of the chosen venture the cohort edits in the demo.
export function makeVentureDraft(): VentureDraft {
  return {
    thesis: CHOSEN.thesis,
    basics: {
      customer: "Parents returning to work after a career break — reachable through Maya's 4,000-member community.",
      problem: "Going back after a break is cold and confidence-eroding; job boards screen out a career gap.",
    },
    advantage: {
      capability: "A trusted 4,000-parent community, a full-stack builder, and a brand that's lived the comeback.",
      insight: "Job boards are the worst re-entry path — people need a guided cohort, not a search box.",
      motivation: "We've watched capable people give up on work that mattered. We want them back.",
    },
    competition: {
      gorilla: "LinkedIn / mainstream job boards",
      alternatives: "Career coaches, returnship bootcamps, Facebook parent groups",
    },
    purpose: CHOSEN.purpose,
    problem: { ...PROBLEM_BREAKDOWN },
    differentiation: { statement: DIFFERENTIATION.statement, clarity: DIFFERENTIATION.clarity },
    principles: [
      "Warm beats cold — always lead with a real introduction.",
      "Outcomes over activity — measure placements, not logins.",
      "The community is the product — protect trust above growth.",
    ],
    approaches: APPROACH_OPTIONS.map((a) => ({ ...a })),
    approachId: APPROACH_OPTIONS[0].id,
    revenue: revenueDefaults(REVENUE_MODELS[0]),
    unique: CHOSEN.unique,
    scorecard: { rightCustomer: true, rightProblem: true, rightApproach: false, willSwitch: false, rightDifferentiation: false, doesItClick: false },
    capTable: {
      pool: CAP_TABLE.pool,
      rows: VENTURE_DETAILS.team.map((r) => ({ memberId: r.memberId, role: r.role, responsibility: r.responsibility, equity: "", vesting: CAP_TABLE.vestingDefault })),
    },
    lenses: LENSES.map((l) => ({ ...l })),
  };
}

// Map a generated revenue pick onto a known model + its driver defaults (so the
// revenue modeller's math stays valid), overriding any driver values the LLM gave.
function seedRevenue(r: VentureDetail["revenue"]): VentureDraft["revenue"] {
  const model = REVENUE_MODELS.find((m) => m.id === r.modelId) ?? REVENUE_MODELS[0];
  const drivers: Record<string, number> = Object.fromEntries(model.drivers.map((d) => [d.key, d.value]));
  for (const dv of r.drivers ?? []) if (dv.key in drivers) drivers[dv.key] = dv.value;
  return { id: model.id, growth: r.growth || model.growth, drivers };
}

// Seed the editable draft from a live, LLM-generated venture: free-text Click
// fields come from the venture's detail; structural widgets (approach, revenue,
// scorecard) keep sensible defaults; the cap table is the real team.
export function draftFromVenture(v: Venture, cohort: Member[]): VentureDraft {
  const base = makeVentureDraft();
  const d = v.detail;
  return {
    ...base,
    thesis: v.thesis,
    purpose: v.purpose,
    unique: v.unique,
    lenses: v.lenses && v.lenses.length ? v.lenses.map((l) => ({ ...l })) : base.lenses,
    basics: d ? { customer: d.customer, problem: d.problem } : base.basics,
    advantage: d ? { ...d.advantage } : base.advantage,
    competition: d ? { ...d.competition } : base.competition,
    problem: d
      ? { painful: d.problemBreakdown.painful, frequent: d.problemBreakdown.frequent, whyNow: d.problemBreakdown.whyNow, payNow: d.problemBreakdown.payNow }
      : base.problem,
    differentiation: d ? { statement: d.differentiation.statement, clarity: d.differentiation.clarity } : base.differentiation,
    principles: d && d.principles.length ? [...d.principles] : base.principles,
    approaches: d && d.approaches.length ? d.approaches.map((a, i) => ({ id: `a${i}`, title: a.title, why: a.why })) : base.approaches,
    approachId: d && d.approaches.length ? "a0" : base.approachId,
    revenue: d ? seedRevenue(d.revenue) : base.revenue,
    capTable: {
      pool: base.capTable.pool,
      rows: cohort.length
        ? cohort.map((m) => ({ memberId: m.id, role: m.role ?? "", responsibility: m.brings ?? "", equity: "", vesting: CAP_TABLE.vestingDefault }))
        : base.capTable.rows,
    },
  };
}

// ----------------------------------------------- Lenses (opportunity angles)
// View the agreed opportunity space through different lenses — each gives a
// different "version" or angle of the opportunity (the X-Prize version, the
// Blue Ocean angle, the transplant play...). Used in the Opportunity phase.
export type Lens = {
  id: string;
  name: string;
  icon: IconName;
  question: string; // the question this lens forces
  reframe: string; // the angle / version it sees in the opportunity
};

export const LENSES: Lens[] = [
  { id: "firstprinciples", name: "First principles", icon: "bolt", question: "Strip it down — why is re-entry actually hard?", reframe: "The real blocker isn't skills, it's a broken signal: employers can't read a gap and parents lose confidence. The opportunity is to fix the signal." },
  { id: "blueocean", name: "Blue Ocean", icon: "target", question: "Where's the uncontested space?", reframe: "Job boards and bootcamps fight in a red ocean. The open water is guided re-entry sold as an outcome — back to work, with warm employer intros." },
  { id: "xprize", name: "X-Prize", icon: "star", question: "What's the audacious, measurable moonshot?", reframe: "The X-Prize version: tens of thousands of parents back into meaningful work in three years — measurable, world-positive, fundable." },
  { id: "exo", name: "ExO", icon: "chart", question: "What makes this 10x, not 10%?", reframe: "The exponential version leverages community, templates, and hiring data — not headcount — to place returners at scale." },
  { id: "transplant", name: "Transplant", icon: "copy", question: "What's worked elsewhere that no one has brought here?", reframe: "Take the outcomes-based cohort model proven in tech bootcamps and transplant it to parent re-entry — a trend-backed playbook no one has run here with real employer intros." },
  { id: "pirate", name: "Pirate", icon: "alert", question: "What rule can we break?", reframe: "The pirate version flips who pays — employers fund placements and returners join free, breaking the candidate-pays norm." },
  { id: "trimtab", name: "Trimtab", icon: "scale", question: "What's the smallest lever that moves the biggest system?", reframe: "One small move turns the whole flywheel: a handful of warm employer intros creates proof, word-of-mouth, and pricing power." },
  { id: "click", name: "Click", icon: "sparkle", question: "Does the right person instantly get it?", reframe: "It clicks in one line — 'Your career didn't end. It paused.' A returning parent feels that immediately." },
  { id: "lean", name: "Lean", icon: "refresh", question: "What's the riskiest assumption, and the smallest test?", reframe: "Make it real this week: the riskiest belief is that parents pay before results — test it with a paid pilot of twelve." },
];

// The full bundle the Opportunity phase renders. In the demo it's the authored
// mock below; in the live flow it's generated by Claude from the *confirmed*
// synthesis (spaces + lenses), with PESTLE findings grounded by live web search
// — see lib/opportunity.ts. Same shapes the UI already renders.
export type OpportunityData = {
  spaces: OpportunitySpace[];
  research: ResearchLens[];
};

export function mockOpportunityData(): OpportunityData {
  return {
    spaces: OPPORTUNITY_SPACES.map((s) => ({ ...s })),
    research: RESEARCH_LENSES.map((r) => ({ ...r })),
  };
}
