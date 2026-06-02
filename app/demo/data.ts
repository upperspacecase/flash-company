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

export const VALIDATION = {
  hypothesis: "We believe returning parents will pay for a guided cohort if it delivers community, real employer intros, and measurable confidence gains within 8 weeks.",
  assumptions: [
    "Parents will give an email to join a returnship waitlist.",
    "At least 1 in 4 waitlisters will book a call.",
    "Employers will take a warm intro to a vetted returner.",
  ],
  landing: {
    headline: "Your career didn't end. It paused.",
    subhead: "Relaunch is an 8-week guided cohort that gets parents back to work — with a community that gets it, real employer intros, and your confidence rebuilt.",
    cta: "Join the next cohort",
  },
  deck: [
    { title: "Relaunch", body: "A guided way back to work for parents. (Title — one-line pitch, contact.)" },
    { title: "Problem", body: "Parents who pause their careers face a cold, confidence-eroding path back." },
    { title: "Solution", body: "An 8-week guided returnship cohort: community, intros, rebuilt confidence." },
    { title: "Why now", body: "Returnships are mainstream; the motherhood penalty is in the spotlight." },
    { title: "Market", body: "Millions of parents return each year; start with Maya's 4k community." },
    { title: "Product", body: "Recruit → 8-week programme → employer intros → measured outcomes." },
    { title: "Team", body: "Community (Maya), platform (Alex), brand (Priya) — the founding three." },
    { title: "The ask", body: "Run the pilot, hit the day-30 gate, open cohort two." },
  ],
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
