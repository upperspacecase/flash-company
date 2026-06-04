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
  { id: "invite", label: "Invite", day: "Kick-off", blurb: "Share a link. The team forms when everyone accepts." },
  { id: "input", label: "Input", day: "Day 1", blurb: "Each person answers 15 questions privately. Typed or voice." },
  { id: "synthesis", label: "Synthesis", day: "Day 1", blurb: "The agent finds your convergence map and opportunity spaces." },
  { id: "ventures", label: "Ventures", day: "Day 2", blurb: "Five venture outlines. Vote, comment, and pick one." },
  { id: "validation", label: "Validation", day: "Day 2–30", blurb: "Assets to test, feedback synthesis, and the 7/14/21/30 check-ins." },
] as const;

// ------------------------------------------------------------- Invite

export const INVITE = {
  url: "flashco.app/s/3kq9-relaunch",
  note: "No app download. No account creation. Just a link.",
  forms: "The team forms when everyone accepts — then the 48-hour window starts (or the invite auto-expires).",
  members: COHORT,
};

// -------------------------------------------------------------- Input

export type Question = { q: string; a: string; voice?: boolean };

// "You" are Maya; these are her answers. 15 questions, sampled from the spec.
export const QUESTIONS: Question[] = [
  { q: "What's a problem you keep noticing that nobody is solving well?", a: "Parents in my community ask the same thing constantly: how do I go back to work after a long break without starting from zero?" },
  { q: "What skill or resource do you have that the other two don't know about?", a: "I've quietly built a 4,000-person community of new parents who trust me.", voice: true },
  { q: "What's something you've built, sold, or shipped before — even something small?", a: "I ran a paid 6-week parenting course last year — 80 people, sold out twice." },
  { q: "What would you do for free if you didn't need money?", a: "Help people feel capable again after a setback. That's the thread in everything I do." },
  { q: "What's the biggest risk you're willing to take right now?", a: "Going public with a paid product to my community and being judged if it flops." },
  { q: "Who do you have unusual access to — a community, network, or type of customer?", a: "Returning parents, and through them, the small employers who'd hire them." },
  { q: "What trend are you convinced is about to get much bigger?", a: "Returnships and flexible re-entry — the motherhood penalty is finally in the spotlight." },
  { q: "What do people consistently ask you for help with?", a: "How to restart a career and how to rebuild confidence after time out.", voice: true },
  { q: "What's something you believe that most people in your field disagree with?", a: "Job boards are the worst possible re-entry path. People need a guided cohort, not a search box." },
  { q: "How much time can you give this over the next two weeks?", a: "About 20 hours a week — evenings and the kids' nap windows." },
  { q: "What could you put in beyond time — money, tools, an audience?", a: "My community as distribution, and a small budget for a landing page." },
  { q: "What kind of work drains you that you'd want to avoid?", a: "Cold B2B sales. I'd rather build trust at scale than chase logos." },
  { q: "What would make you proud to have built in a year?", a: "A hundred parents back in work who'd told me they'd given up." },
  { q: "When did you last see a customer or friend clearly frustrated?", a: "Last week — a friend got ghosted by three employers the moment they saw her two-year gap." },
  { q: "If this works, what does winning look like for you personally?", a: "Doing work that matters with people I trust, and not having to ask permission to do it." },
];

// Other members' progress (anonymous until synthesis completes).
export const INPUT_STATUS: Record<string, { done: number; total: number }> = {
  maya: { done: 0, total: QUESTIONS.length },
  alex: { done: 15, total: 15 },
  priya: { done: 12, total: 15 },
};

// ----------------------------------------------------------- Synthesis

export type Signal = { icon: IconName; kind: string; tone: "good" | "warn"; text: string };

export const CONVERGENCE_SIGNALS: Signal[] = [
  { icon: "group", kind: "Overlap", tone: "good", text: "Returning to work after a break surfaced independently across all three intakes." },
  { icon: "alert", kind: "Tension", tone: "warn", text: "Strong demand from parents vs. employer hesitancy about career gaps." },
  { icon: "minus", kind: "Gap", tone: "good", text: "No trusted, supportive path back — only cold job boards." },
  { icon: "sparkle", kind: "Hidden complementarity", tone: "good", text: "Maya's community (distribution) + Alex's platform + Priya's brand and content." },
  { icon: "chart", kind: "Market signal", tone: "good", text: "The motherhood penalty and the rise of returnships put timing on your side." },
];

export type Slider = { spark: number; conviction: number }; // 0–5

export type OpportunitySpace = {
  id: string;
  title: string;
  text: string;
  votes: number;
  spark: number;
  conviction: number;
  top?: boolean;
};

export const OPPORTUNITY_SPACES: OpportunitySpace[] = [
  { id: "reentry", title: "Guided re-entry for parents", text: "A supportive, structured path back to work for parents after a career break.", votes: 3, spark: 5, conviction: 5, top: true },
  { id: "employer", title: "Employer returnship programmes", text: "Help companies run structured returnships and hire from an overlooked talent pool.", votes: 2, spark: 4, conviction: 3 },
  { id: "confidence", title: "Confidence & coaching for returners", text: "Rebuild the confidence that erodes during time out of the workforce.", votes: 2, spark: 4, conviction: 4 },
  { id: "flexmatch", title: "Flexible-role matching", text: "Connect returners with genuinely flexible roles, not only 'remote-friendly'.", votes: 1, spark: 3, conviction: 3 },
  { id: "community", title: "Community for career returners", text: "A place returners swap leads, stories, and accountability.", votes: 2, spark: 4, conviction: 3 },
];

// ------------------------------------------------------------ Ventures

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
};

export const VALIDATION = {
  hypothesis: "We believe returning parents will pay for a guided cohort if it delivers community, real employer intros, and measurable confidence gains within 8 weeks.",
  assumptions: [
    "Parents will give an email to join a returnship waitlist.",
    "At least 1 in 4 waitlisters will book a call.",
    "Employers will take a warm intro to a vetted returner.",
  ],
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
  // YC seed-deck order, generated from the venture outline + team + financials.
  deck: [
    { kind: "title", label: "Title", headline: VENTURE_DETAILS.name, points: ["A guided way back to work for parents."], footnote: "Maya · Alex · Priya — founding team" },
    { label: "Problem", headline: "Parents who pause their careers face a cold, confidence-eroding path back.", points: ["Job boards screen people out the moment they see a two-year gap.", "No trusted, supportive route back — only a cold search box.", "Confidence erodes the longer the time out of work runs."] },
    { label: "Solution", headline: "An 8-week guided returnship cohort.", points: ["A community that gets it.", "Real, warm employer introductions.", "Confidence rebuilt and measured over 8 weeks."] },
    { label: "Why now", headline: "Returnships are going mainstream.", points: ["The motherhood penalty is finally in the spotlight.", "Flexible and returner hiring is becoming the default ask."] },
    { kind: "market", label: "Market", headline: "Millions of parents return to work every year.", points: ["Wedge: Maya's 4,000-member parent community.", "Expand into adjacent returner networks and employer partners."], footnote: CHOSEN.earn },
    { label: "Product", headline: "Recruit → 8-week programme → employer intros → measured outcomes.", points: ["A waitlist opens to the community.", "The cohort runs the guided 8-week programme.", "Warm employer intros, with outcomes tracked."] },
    { label: "Business model", headline: "Paid cohort seats now, employer placement fees later.", points: ["≈ $250 per parent, per cohort.", "Year-1 illustrative: 6 cohorts × 12 seats ≈ $180k.", "Then: placement fees from employers who hire."] },
    { kind: "traction", label: "Traction", headline: "Distribution and proof before a line of code.", points: ["4,000-member parent community", "Sold-out course — 80 parents, twice", "Validation waitlist live"] },
    { label: "Why us", headline: "Community + cohort ops + real employer intros, in one path. Not a job board.", points: [CHOSEN.unique] },
    { kind: "team", label: "Team", headline: "Three founders, one problem they can't stop noticing." },
    { kind: "ask", label: "The ask", headline: "Run the pilot, hit the day-30 gate, open cohort two.", points: ["First cohort: 12 parents.", "5 warm employer intros pre-lined.", "Day-30 go/no-go → a Series-A-ready traction story."] },
  ] as DeckSlide[],
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
// Simple guidance prompts (capability / insight / contrast) plus a clarity score.
export const DIFFERENTIATION = {
  statement: "Community + cohort ops + real employer intros, in one path. Not a job board.",
  clarity: 4, // 0–5
  guidance: [
    { key: "Capability", prompt: "What can only this team do?", text: "A trusted 4,000-parent community, a builder, and a brand that's lived the comeback." },
    { key: "Insight", prompt: "What do you know that the market doesn't?", text: "Job boards are the worst re-entry path — people need a guided cohort, not a search box." },
    { key: "Contrast", prompt: "Why you over the gorilla?", text: "Warm, guided, outcome-measured — not cold and self-serve like LinkedIn or job boards." },
  ],
};

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

export type VentureDraft = {
  thesis: string;
  purpose: string;
  problem: { painful: number; frequent: number; whyNow: number; payNow: string };
  solution: string;
  market: string;
  differentiation: { statement: string; clarity: number };
  revenue: { id: string; growth: number; drivers: Record<string, number> };
  unique: string;
  capTable: { pool: number; rows: { memberId: string; role: string; responsibility: string; equity: string; vesting: string }[] };
};

// A working draft of the chosen venture the cohort edits in the demo.
export function makeVentureDraft(): VentureDraft {
  return {
    thesis: CHOSEN.thesis,
    purpose: CHOSEN.purpose,
    problem: { ...PROBLEM_BREAKDOWN },
    solution: CHOSEN.solution,
    market: CHOSEN.market,
    differentiation: { statement: DIFFERENTIATION.statement, clarity: DIFFERENTIATION.clarity },
    revenue: revenueDefaults(REVENUE_MODELS[0]),
    unique: CHOSEN.unique,
    capTable: {
      pool: CAP_TABLE.pool,
      rows: VENTURE_DETAILS.team.map((r) => ({ memberId: r.memberId, role: r.role, responsibility: r.responsibility, equity: "", vesting: CAP_TABLE.vestingDefault })),
    },
  };
}

// ------------------------------------------------------- Lenses (Click)
// The core engine: view the opportunity through different worldviews, pull the
// bits that ring true, and a clear, concrete venture story assembles. Ordered
// to zoom out (see the big opportunity) then zoom in (make it real).

export type Lens = {
  id: string;
  name: string;
  icon: IconName;
  band: "big" | "real"; // see the big opportunity | bring it down to earth
  question: string; // the question this lens forces
  reframe: string; // the big opportunity it sees
  insights: string[]; // pullable bits for the story
};

export const LENSES: Lens[] = [
  {
    id: "click",
    name: "Click",
    icon: "sparkle",
    band: "big",
    question: "Does the right person instantly get it and switch?",
    reframe: "It clicks in one line: “Your career didn’t end — it paused.” A returning parent feels that immediately.",
    insights: [
      "Lead with the line that clicks: “Your career didn’t end. It paused.”",
      "Name the switch: from cold job boards to a guided path back.",
    ],
  },
  {
    id: "firstprinciples",
    name: "First principles",
    icon: "bolt",
    band: "big",
    question: "Strip it down — why is re-entry actually hard?",
    reframe: "The real blocker isn’t skills, it’s a broken signal: employers can’t read a gap and parents lose confidence. Solve the signal.",
    insights: [
      "The core problem is a trust/signal gap, not a skills gap — design for proof, not training.",
      "The irreducible job is “restore a credible signal to employers”; a cohort is just one way to deliver it.",
    ],
  },
  {
    id: "blueocean",
    name: "Blue Ocean",
    icon: "target",
    band: "big",
    question: "Red ocean, or uncontested space?",
    reframe: "Job boards and bootcamps fight in a red ocean. The open water is guided re-entry sold as an outcome: back to work, with warm intros.",
    insights: [
      "Eliminate the cold search box; make warm employer intros the headline value.",
      "Compete on “back to work in 8 weeks,” not on listings or courses.",
    ],
  },
  {
    id: "exo",
    name: "ExO",
    icon: "chart",
    band: "big",
    question: "What makes this 10x, not 10%?",
    reframe: "An exponential version leverages community, templates, and hiring data — not headcount — to get returners placed at scale.",
    insights: [
      "MTP: “Every capable parent back into meaningful work.”",
      "Scale via community + templated cohorts + an employer network — asset-light, not staff-heavy.",
    ],
  },
  {
    id: "xprize",
    name: "XPRIZE",
    icon: "star",
    band: "big",
    question: "Is there an audacious, measurable moonshot?",
    reframe: "The moonshot is measurable and world-positive: tens of thousands of parents back into meaningful work, income recovered.",
    insights: [
      "Set a measurable moonshot: 100,000 parents placed within 3 years.",
      "Report impact in placements and income recovered — prize-worthy and fundable.",
    ],
  },
  {
    id: "trimtab",
    name: "Trimtab",
    icon: "scale",
    band: "real",
    question: "What’s the smallest lever that moves the biggest system?",
    reframe: "One small move turns the whole flywheel: a handful of warm employer intros creates proof, word-of-mouth, and pricing power.",
    insights: [
      "Trimtab: pre-line 5 warm employer intros per cohort — the smallest move that unlocks everything.",
      "Start with one community (Maya’s 4k) as the lever, not a broad launch.",
    ],
  },
  {
    id: "lean",
    name: "Lean",
    icon: "refresh",
    band: "real",
    question: "What’s the riskiest assumption, and the smallest test?",
    reframe: "Make it real this week: the riskiest belief is that parents pay before results — test it with a paid pilot of twelve.",
    insights: [
      "Riskiest assumption: parents pay before seeing outcomes — test with a paid pilot of 12.",
      "Smallest test: landing page → waitlist → booked calls; decide at day 30.",
    ],
  },
];
