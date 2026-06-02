// Clickable prototype content for Flash Company — built from the PRD.
// One sprint: a 5-person cohort dumps input, converges, forms a venture
// ("Relaunch"), ships a venture birth certificate, then follows through.
// Phases: Cohort -> Convergence -> Formation -> Output -> Follow-through.

export type IconName =
  | "people" | "group" | "user" | "bolt" | "alert" | "sparkle" | "link" | "mic"
  | "image" | "doc" | "laptop" | "store" | "building" | "target" | "check"
  | "star" | "clock" | "calendar" | "scale" | "chart" | "thumb" | "lock"
  | "play" | "coins" | "message" | "minus" | "send" | "pause" | "refresh";

export const AGENT_NAME = "Flash";
export const TAGLINE = "Build together. Start clearly.";

export const SPRINT = {
  windowHours: 72,
  days: 3,
  buyInTotal: "$250",
  buyInPer: "~$50",
};

export type Member = {
  id: string;
  name: string;
  initials: string;
  role: string;
  skills: string;
  network: string;
  accepted: boolean;
  ring: string;
  dot: string;
};

// "You" are Maya for the purposes of the data-dump chat.
export const COHORT: Member[] = [
  { id: "maya", name: "Maya", initials: "MA", role: "Community & GTM", skills: "Product, UX, audience", network: "Runs a 4k-member community for new parents", accepted: true, ring: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  { id: "alex", name: "Alex", initials: "AL", role: "Product & Eng", skills: "Full-stack, ex-fintech", network: "Engineering leaders", accepted: true, ring: "bg-sky-100 text-sky-700", dot: "bg-sky-500" },
  { id: "priya", name: "Priya", initials: "PR", role: "Brand & Content", skills: "Design, content, creators", network: "Creator communities", accepted: true, ring: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  { id: "jordan", name: "Jordan", initials: "JO", role: "Ops & Delivery", skills: "Cohort programs, logistics", network: "Ops & partnerships", accepted: true, ring: "bg-violet-100 text-violet-700", dot: "bg-violet-500" },
  { id: "sam", name: "Sam", initials: "SA", role: "Research & Outcomes", skills: "Data, healthcare", network: "Clinicians & researchers", accepted: false, ring: "bg-rose-100 text-rose-700", dot: "bg-rose-500" },
];

export const YOU = "maya";
export const memberById = (id: string) => COHORT.find((m) => m.id === id)!;

export const PHASES = [
  { id: "cohort", label: "Cohort", day: "Kick-off", blurb: "Invite 3–5 people you trust and open the 72-hour window." },
  { id: "convergence", label: "Convergence", day: "Day 1", blurb: "Everyone dumps input separately. The agent finds the patterns." },
  { id: "formation", label: "Formation", day: "Day 2", blurb: "Ranked venture hypotheses, roles, and equity — you vote and commit." },
  { id: "output", label: "Output", day: "Day 3", blurb: "Walk away with a venture birth certificate ready to share." },
  { id: "followthrough", label: "Follow-through", day: "Day 7–30", blurb: "The agent goes quiet, returning only at day 7, 14, 21 and 30." },
] as const;

// ---------------------------------------------------------------- Cohort

export const SUGGESTED_CONTACTS = [
  { name: "Nadia K.", reason: "HR lead in your contacts — could open employer doors later." },
  { name: "Tom R.", reason: "Built two marketplaces; strong if you go two-sided." },
  { name: "Deb L.", reason: "Returned to work herself — a perfect first tester." },
];

export const COHORT_READINESS = [
  { label: "Cohort invited (4 of 5 in)", done: true },
  { label: "Buy-in agreed", done: true },
  { label: "72-hour window opened", done: true },
  { label: "Everyone accepted", done: false },
];

// ----------------------------------------------------------- Convergence

export const AGENT_INTRO =
  "Welcome to your 72-hour sprint. Don't structure anything yet — just dump. Problems you keep seeing, people you know, things you're weirdly good at, links, voice notes. I'll read across all five of you and find the patterns.";

export type DumpKind = "text" | "voice" | "link" | "image" | "doc";

export type Dump = {
  kind: DumpKind;
  label: string; // bubble content / attachment label
  agent: string; // agent's reflection after this dump
};

// "You" (Maya) dump these one at a time. Clickable in the prototype.
export const DUMPS: Dump[] = [
  { kind: "text", label: "Half my parents community asks the same thing: how do I go back to work after a long break without starting from zero?", agent: "Noted — 'returning to work after a break' is the third time that's surfaced across the group." },
  { kind: "voice", label: "Voice memo · 0:42 — \"employers ghost them the second they see a two-year gap…\"", agent: "Tension logged: strong demand from parents vs. employer hesitancy about gaps." },
  { kind: "link", label: "Link · article — \"The motherhood penalty costs returners ~20% of salary\"", agent: "Market signal added — the timing pressure is real and external." },
  { kind: "image", label: "Photo · screenshot of 30 DMs all asking the same thing", agent: "That's hard evidence of repeated, specific demand. Flagging it." },
  { kind: "text", label: "I'm not interested in building another job board. That's been done to death.", agent: "Constraint noted — not a job board. I'll keep proposals away from that shape." },
];

// What the rest of the cohort has already dumped (async).
export const COHORT_DUMPS: Record<string, { count: number; sample: string; kinds: DumpKind[] }> = {
  alex: { count: 6, sample: "Built matching infra before — wary of two-sided cold starts.", kinds: ["text", "link", "doc"] },
  priya: { count: 5, sample: "Creators love a 'comeback story' angle — I could make a content engine for it.", kinds: ["text", "image", "voice"] },
  jordan: { count: 4, sample: "I've run 8-week cohort programs. The ops is where the moat is.", kinds: ["text", "doc"] },
  sam: { count: 5, sample: "I have outcome data on confidence and re-employment after breaks.", kinds: ["text", "link", "doc"] },
};

export type Signal = { icon: IconName; kind: string; tone: "good" | "warn"; text: string };

// Revealed progressively as you dump (one per dump sent).
export const CONVERGENCE_SIGNALS: Signal[] = [
  { icon: "group", kind: "Overlap", tone: "good", text: "Returning to work after a break surfaced independently by Maya, Priya and Sam." },
  { icon: "alert", kind: "Tension", tone: "warn", text: "Parents want back in; employers hesitate at career gaps." },
  { icon: "minus", kind: "Gap", tone: "good", text: "No trusted, supportive path back — only cold job boards." },
  { icon: "sparkle", kind: "Hidden complementarity", tone: "good", text: "Maya's community (distribution) + Jordan's cohort ops + Sam's outcome data + Alex's platform + Priya's brand." },
  { icon: "chart", kind: "Market signal", tone: "good", text: "Motherhood penalty + the rise of returnships means timing is on your side." },
];

// ------------------------------------------------------------- Formation

export type Vote = { approve: number; challenge: number; pivot: number };
export type HypothesisStatus = "approved" | "tumble" | "folded" | "proposed";

export type Hypothesis = {
  id: string;
  rank: number;
  title: string;
  score: number;
  customer: string;
  problem: string;
  whyTeam: string;
  validation: string;
  votes: Vote;
  status: HypothesisStatus;
  note: string;
};

export const HYPOTHESES: Hypothesis[] = [
  {
    id: "relaunch",
    rank: 1,
    title: "Relaunch",
    score: 8.6,
    customer: "Parents (especially mothers) returning to work after a career break.",
    problem: "Re-entry is cold and confidence-eroding, and employers are wary of gaps.",
    whyTeam: "Maya's community for distribution, Jordan's cohort ops, Sam's outcome data, Alex's platform, Priya's brand.",
    validation: "Run a paid pilot cohort recruited from Maya's community; land 5 employer intros.",
    votes: { approve: 5, challenge: 0, pivot: 0 },
    status: "approved",
    note: "An 8-week guided returnship cohort. Strongest fit — distribution, ops and outcomes already in the room.",
  },
  {
    id: "flexmatch",
    rank: 2,
    title: "FlexMatch",
    score: 6.9,
    customer: "Returning parents and employers offering flexible roles.",
    problem: "Returners can't find genuinely flexible roles; employers can't find vetted returners.",
    whyTeam: "Alex has built matching infra; Maya has supply-side trust.",
    validation: "Concierge-match 10 returners to roles by hand before building anything.",
    votes: { approve: 2, challenge: 0, pivot: 3 },
    status: "tumble",
    note: "Marketplace. Parked — Alex flagged the two-sided cold-start risk. In the tumble dryer for now.",
  },
  {
    id: "comeback",
    rank: 3,
    title: "The Comeback",
    score: 6.2,
    customer: "Career returners across all fields.",
    problem: "No brand tells the comeback story or builds the returner community.",
    whyTeam: "Priya's content engine + Maya's audience.",
    validation: "Publish comeback-story content and measure list growth.",
    votes: { approve: 1, challenge: 3, pivot: 1 },
    status: "folded",
    note: "Content + community brand. Folded into Relaunch as its top-of-funnel rather than run standalone.",
  },
  {
    id: "employer",
    rank: 4,
    title: "Returnships-as-a-Service",
    score: 5.5,
    customer: "Employers who want to hire returners but lack a programme.",
    problem: "Companies want the talent but have no structured returnship to run.",
    whyTeam: "Jordan's programme ops; Sam's outcome reporting.",
    validation: "Pitch one employer a paid pilot returnship.",
    votes: { approve: 1, challenge: 1, pivot: 2 },
    status: "tumble",
    note: "B2B and slower. Parked for after consumer traction.",
  },
];

export const CHOSEN_ID = "relaunch";

export type Role = { memberId: string; title: string; responsibilities: string; equity: number };

export const ROLES: Role[] = [
  { memberId: "maya", title: "CEO · Community & GTM", responsibilities: "Recruits cohorts from her community; owns brand voice.", equity: 28 },
  { memberId: "alex", title: "CTO · Product & Eng", responsibilities: "Builds the cohort platform and intro flow.", equity: 26 },
  { memberId: "jordan", title: "COO · Ops & Delivery", responsibilities: "Runs the 8-week cohort and employer partnerships.", equity: 22 },
  { memberId: "priya", title: "CMO · Brand & Content", responsibilities: "Runs the comeback-story content engine.", equity: 14 },
  { memberId: "sam", title: "Head of Research · Outcomes", responsibilities: "Measures confidence and re-employment; owns the data moat.", equity: 10 },
];

export const EQUITY_NOTE = "Equity is embedded in role and is a starting framework — revisit at the day-30 review.";

export const DECISION_FRAMEWORK = [
  "The lead of each function decides within it.",
  "Any spend over €500 or any hire needs 3 of 5.",
  "A change to the core thesis needs 4 of 5.",
  "The day-30 review can rebalance roles and equity.",
];

// --------------------------------------------------------------- Output

export const BIRTH_CERTIFICATE = {
  thesis: {
    defineDifferentiate: {
      intro: "Uncovering the truth behind the assumptions.",
      points: [
        { icon: "user" as IconName, label: "Real customer", text: "Mothers returning after a 1–3 year career break — reached today through Maya's 4,000-member community. Not 'parents' broadly; specifically those who paused and want back in." },
        { icon: "alert" as IconName, label: "Exact problem (worth solving?)", text: "Re-entry is cold and confidence-eroding, and employers quietly screen out gaps. Worth solving: these returners are skilled and motivated but underserved, and the pain is acute and recurring — 30+ DMs a week." },
        { icon: "store" as IconName, label: "Competitors & alternatives", text: "Today they use cold job boards, big-firm 'returnship' PR programmes, and LinkedIn. Threat: an incumbent could bolt on a returner track. Opportunity: none combine community, real intros, and confidence-rebuilding for small and mid-size employers." },
        { icon: "sparkle" as IconName, label: "Radical differentiation", text: "The only path pairing a trusted community (distribution + safety), a structured 8-week cohort (ops moat), and measured outcomes (data moat). Not a job board — a guided way back." },
      ],
    },
    approach: {
      title: "The approach we agreed on",
      intro: "The chosen path — and the venture we're committing to.",
      chosen: "Relaunch — a guided returnship cohort, service-first. The fastest path to revenue and the best fit for the team's distribution and ops.",
      hypothesis: "We believe returning parents will pay for a guided cohort if it delivers community, real employer intros, and measurable confidence gains within 8 weeks.",
    },
  },
  roadmap: [
    { week: "Week 1", text: "Recruit 12 parents from Maya's community into a paid pilot cohort." },
    { week: "Week 2", text: "Run weeks 1–2 of the cohort; Sam baselines confidence and goals." },
    { week: "Week 3", text: "Land 5 employer intros for placements; Priya ships comeback content." },
    { week: "Week 4", text: "Measure interviews, placements and confidence lift; decide go / no-go." },
  ],
  deckNote: "Structured on the standard Y Combinator seed-deck format.",
  deck: [
    { title: "Relaunch", body: "A guided way back to work for parents. (Title slide — company, one-line pitch, contact.)" },
    { title: "Problem", body: "Parents who pause their careers face a cold, confidence-eroding path back, and employer bias against gaps." },
    { title: "Solution", body: "An 8-week guided returnship cohort: community, real employer intros, and rebuilt confidence." },
    { title: "Why now", body: "Returnships are going mainstream and the motherhood penalty is in the spotlight — demand and willingness to act are peaking." },
    { title: "Market", body: "Millions of skilled parents return to work after a break each year. We start with the reachable wedge — Maya's 4k community and similar networks — then expand." },
    { title: "Product", body: "Recruit a cohort → 8-week programme (community + coaching) → employer intros → measured outcomes." },
    { title: "Business model", body: "Paid cohort seats (buy-in per member), then employer placement fees, then a studio / white-label tier." },
    { title: "Team", body: "Distribution (Maya), platform (Alex), cohort ops (Jordan), brand (Priya), outcomes & data (Sam) — all in the founding five." },
    { title: "Traction plan", body: "Paid pilot cohort of 12 from the community plus 5 employer intros inside 30 days." },
    { title: "The ask", body: "Run the pilot, hit the day-30 decision gate, then open cohort two." },
  ],
  landing: {
    headline: "Your career didn't end. It paused.",
    subhead: "Relaunch is an 8-week guided cohort that gets parents back to work — with a community that gets it, real employer intros, and your confidence rebuilt.",
    cta: "Join the next cohort",
  },
  outreach: {
    linkedin: "If you paused your career to raise kids, going back can feel like starting from zero. It shouldn't.\n\nWe're piloting Relaunch — an 8-week guided cohort that gets parents back to work with community, real employer intros, and rebuilt confidence. Comment 'relaunch' for a spot.",
    dm: "Hey {name} — you mentioned wanting to go back to work but not knowing where to start. We're running a small guided cohort for exactly that — community, employer intros, confidence. Want the details?",
    email: "Subject: a guided way back to work\n\nHi {name},\n\nGoing back to work after a break is hard — cold job boards and employer bias don't help. Relaunch is an 8-week guided cohort built for returning parents: community, real employer intros, and rebuilt confidence.\n\nWe're taking a small pilot cohort. Want in?\n\nMaya — Relaunch",
    whatsapp: "Hi {name}! We're running a small 8-week cohort for parents going back to work — community + employer intros + confidence. Pilot spots are limited. Keen?",
  },
  validation: {
    tests: [
      "Landing page shared to Maya's community",
      "20 warm DMs to parents who've asked",
      "5 employer intros for placement demand",
    ],
    resultsNote: "Results populate during follow-through (day 7+). Nothing here is filled in yet — this is the plan, not measured outcomes.",
    decisionRule: "If 12 join the paid pilot and 3 employers commit to interviews within two weeks, we continue.",
  },
  nextSteps: [
    "Send the landing page and outreach to your first 10 by day 4.",
    "Record your commitments below.",
    "The agent goes quiet until day 7 — the work is yours.",
  ],
};

export type Commitment = { memberId: string; task: string; due: string; recorded: boolean };

export const COMMITMENTS: Commitment[] = [
  { memberId: "maya", task: "Recruit 12 parents into the pilot cohort", due: "Day 7", recorded: true },
  { memberId: "alex", task: "Ship the cohort signup + intro flow", due: "Day 7", recorded: true },
  { memberId: "jordan", task: "Line up 5 employer intros", due: "Day 10", recorded: false },
  { memberId: "priya", task: "Publish 3 comeback-story posts", due: "Day 7", recorded: true },
  { memberId: "sam", task: "Set the confidence baseline survey", due: "Day 5", recorded: false },
];

export const OUTPUT_MENU: { id: string; label: string; icon: IconName }[] = [
  { id: "thesis", label: "Thesis", icon: "bolt" },
  { id: "landing", label: "Landing page", icon: "laptop" },
  { id: "roles", label: "Roles & equity", icon: "scale" },
  { id: "decisions", label: "Decision framework", icon: "check" },
  { id: "roadmap", label: "30-day roadmap", icon: "calendar" },
  { id: "deck", label: "Pitch deck", icon: "chart" },
  { id: "outreach", label: "Outreach copy", icon: "message" },
  { id: "validation", label: "Validation report", icon: "target" },
  { id: "commitments", label: "Commitment ritual", icon: "play" },
];

// -------------------------------------------------------- Follow-through

export type Checkpoint = { day: string; status: "active" | "locked"; title: string; asks: string[]; due: string };

export const CHECKPOINTS: Checkpoint[] = [
  { day: "Day 7", status: "active", title: "First pulse", asks: ["Did the pilot cohort fill?", "What surprised you about the first returners?"], due: "Cohort recruited; signup live." },
  { day: "Day 14", status: "locked", title: "Mid-cohort", asks: ["How are interviews and placements tracking?", "Where is the cohort getting stuck?"], due: "Weeks 1–2 of the cohort run." },
  { day: "Day 21", status: "locked", title: "Outcomes check", asks: ["What's the confidence lift?", "Any churn, and why?"], due: "Sam's outcome data in." },
  { day: "Day 30", status: "locked", title: "Go / no-go", asks: ["Continue, pivot or stop?", "Rebalance roles and equity?"], due: "Decision gate + role review." },
];
