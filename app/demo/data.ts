// Canned content for the Flash Company sprint demo.
// Narrative: Maya, Alex & Priya use the sprint to find their own strongest
// venture. Flow: Basics -> Shared inputs -> Opportunity map -> Approaches -> Output.

export const TAGLINE = "Build together. Start clearly.";

export type IconName =
  | "people"
  | "question"
  | "bulb"
  | "folder"
  | "scale"
  | "alert"
  | "sparkle"
  | "minus"
  | "group"
  | "user"
  | "doc"
  | "laptop"
  | "store"
  | "flask"
  | "clock"
  | "chart"
  | "shield"
  | "gear"
  | "dollar"
  | "star"
  | "check"
  | "tag";

export type Member = {
  id: string;
  name: string;
  initials: string;
  lead?: boolean;
  tags: string[];
  network: string;
  contributed: string;
  ring: string; // avatar circle classes
  dot: string;
};

export const MEMBERS: Member[] = [
  {
    id: "maya",
    name: "Maya",
    initials: "MA",
    lead: true,
    tags: ["product", "ops", "research"],
    network: "early builders",
    contributed: "15 min ago",
    ring: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
  },
  {
    id: "alex",
    name: "Alex",
    initials: "AL",
    tags: ["engineering", "technical", "ops"],
    network: "dev partners",
    contributed: "12 min ago",
    ring: "bg-sky-100 text-sky-700",
    dot: "bg-sky-500",
  },
  {
    id: "priya",
    name: "Priya",
    initials: "PR",
    tags: ["design", "community", "sales"],
    network: "creator communities",
    contributed: "8 min ago",
    ring: "bg-amber-100 text-amber-700",
    dot: "bg-amber-500",
  },
];

export const memberById = (id: string) => MEMBERS.find((m) => m.id === id)!;

export const STAGES = [
  { id: "basics", label: "Basics" },
  { id: "shared", label: "Shared Inputs" },
  { id: "map", label: "Opportunity Map" },
  { id: "approaches", label: "Approaches" },
  { id: "output", label: "Output" },
] as const;

// ---------------------------------------------------------------------------
// Stage 1 — Basics
// ---------------------------------------------------------------------------

export const BASICS_QUESTIONS: { icon: IconName; q: string; a: string }[] = [
  {
    icon: "people",
    q: "Who are we building for?",
    a: "2–5 person groups (friends, colleagues, co-founders) who want to build something together but lack clarity on where to start.",
  },
  {
    icon: "question",
    q: "What problem keeps showing up?",
    a: "They have energy, ideas, and relationships, but no structured way to turn them into a focused opportunity.",
  },
  {
    icon: "bulb",
    q: "What do we already know?",
    a: "People iterate better when they have shared context and outside perspectives. Without structure, ideas stall.",
  },
  {
    icon: "folder",
    q: "What assets do we have?",
    a: "Experience building products, design sprints, a founder network, an early community of builders, and a tooling stack.",
  },
  {
    icon: "scale",
    q: "What constraints matter?",
    a: "Limited time, low budget, testing phase, no full-time commitment yet.",
  },
];

export const SHARED_CONTEXT: Record<string, string[]> = {
  maya: ["Focus on groups, not individuals", "Fast path to first clarity matters"],
  alex: ["Leverage async + automation", "Keep the tool stack simple"],
  priya: ["Community feedback early", "Tell the story through examples"],
};

export const CONSTRAINTS = [
  "2 days / week",
  "Low budget",
  "Want to test fast",
  "No full-time commitment yet",
];

export const FOUNDATION = {
  customer:
    "2–5 person groups who want to build something together but lack clarity.",
  problem:
    "They have energy, ideas, and relationships, but no structured way to turn them into a focused opportunity.",
  matters:
    "Helping groups move from scattered ideas to a clear, testable path increases the chances of building something real.",
  edge: ["shared context", "multiple perspectives", "fast synthesis"],
  readiness: ["Customer named", "Problem articulated", "Constraints captured"],
};

// ---------------------------------------------------------------------------
// Stage 2 — Shared inputs
// ---------------------------------------------------------------------------

export const SHARED_PROMPTS: { icon: IconName; q: string }[] = [
  { icon: "alert", q: "What problems do you keep seeing?" },
  { icon: "question", q: "What do people ask you for help with?" },
  { icon: "group", q: "What communities do you have access to?" },
  { icon: "sparkle", q: "What would you be weirdly well-positioned to build?" },
  { icon: "minus", q: "What do you not want to build?" },
];

// answers[memberId][promptIndex]
export const SHARED_ANSWERS: Record<string, string[]> = {
  maya: [
    "Small groups struggle to turn loose ideas into action.",
    "How to get aligned and move forward with confidence.",
    "Early-stage founders and product communities.",
    "A lightweight way to turn ideas into testable next steps.",
    "Another project management tool.",
  ],
  alex: [
    "Too many tools fragment decision-making.",
    "Choosing the right tools and simplifying the stack.",
    "Engineering leaders and tech operator networks.",
    "A decision layer that cuts through tool chaos.",
    "A heavy, all-in-one platform.",
  ],
  priya: [
    "People want clearer ways to collaborate before committing.",
    "Building community and engaging early users.",
    "Design communities and creator networks.",
    "A community-driven validation and feedback engine.",
    "Anything that competes with existing communities.",
  ],
};

export const CROSS_NOTES: Record<string, string[]> = {
  maya: ["Early alignment is a core pain", "People need simple next steps", "Trust and clarity matter most"],
  alex: ["Tool fatigue is real", "Decision support > more features", "Simplicity creates leverage"],
  priya: ["Community is a force multiplier", "Validation before building", "Build with, not for, communities"],
};

export type Signal = { icon: IconName; title: string; text: string };

export const SIGNALS: Signal[] = [
  {
    icon: "alert",
    title: "Repeated problem",
    text: "Small teams struggle to turn ideas into action and are overwhelmed by fragmented tools.",
  },
  {
    icon: "group",
    title: "Strong customer access",
    text: "You have direct access to early-stage builders, engineering leaders, and creator communities.",
  },
  {
    icon: "sparkle",
    title: "Unique overlap",
    text: "You can combine lightweight action, decision clarity, and community validation in one flow.",
  },
  {
    icon: "minus",
    title: "Tension to resolve",
    text: "Builders want simplicity and guidance, not another heavy or all-in-one platform.",
  },
  {
    icon: "people",
    title: "Potential customer groups",
    text: "Early-stage founders, product teams, engineering leaders, and design/creator communities.",
  },
];

export const PATTERN_CHIPS = [
  "collaboration",
  "early-stage builders",
  "fragmented tools",
  "small-group decisions",
  "validation",
];

export const SYNTHESIS_READINESS = [
  { label: "Inputs collected", done: true },
  { label: "Overlaps visible", done: true },
  { label: "Tensions noted", done: true },
  { label: "Ready to map opportunities", done: false },
];

// ---------------------------------------------------------------------------
// Stage 3 — Opportunity map (the centrepiece)
// ---------------------------------------------------------------------------

export const MAP_INGREDIENTS: { icon: IconName; label: string; sub: string }[] = [
  { icon: "user", label: "Customer", sub: "Who is the opportunity for?" },
  { icon: "alert", label: "Problem", sub: "What painful problem are we solving?" },
  { icon: "sparkle", label: "Why us", sub: "Why are we uniquely positioned?" },
  { icon: "doc", label: "Evidence", sub: "What signals support this opportunity?" },
  { icon: "shield", label: "Risk", sub: "What could prevent success?" },
];

export type ScoreBar = { label: string; value: number }; // value 0–5

export type Quote = { memberId: string; text: string };

// ---------------------------------------------------------------------------
// Stage 4 — Approaches
// ---------------------------------------------------------------------------

export const SNAP_LABELS = [
  "Ease to test",
  "Speed to revenue",
  "Founder fit",
  "Market size",
  "Defensibility",
  "Operational complexity",
  "Margin potential",
  "Overall score",
] as const;

export type SnapTile = { label: string; score: number; note: string };

export type Approach = {
  icon: IconName;
  type: string; // "Service", "Software"...
  title: string;
  badge: string;
  badgeTone: "good" | "warn" | "info" | "neutral";
  desc: string;
  recommended?: boolean;
  howItWorks: string[];
  whyItWorks: string[];
  snapshot: SnapTile[]; // length 8, last = Overall score
  firstTest: string;
};

function snap(scores: number[], notes: string[]): SnapTile[] {
  return SNAP_LABELS.map((label, i) => ({ label, score: scores[i], note: notes[i] }));
}

export type Output = {
  summary: string; // "Opportunity summary" (was one-liner)
  page: {
    nav: string[];
    headline: string;
    subhead: string;
    cta: string;
    proofCount: string;
    proofAudience: string;
    proofNote: string;
  };
  outreach: { linkedin: string; dm: string; email: string; whatsapp: string };
  testPlan: { hypothesis: string; firstTest: string; metrics: string[]; decisionRule: string };
  deck: { title: string; body: string }[];
};

export type Opportunity = {
  id: string;
  num: number;
  title: string;
  fitBadge: string;
  level: string;
  levelTone: "good" | "warn" | "info";
  // map card
  customer: string;
  problem: string;
  whyUs: string;
  evidence: string[];
  risk: string;
  // right panel
  panel: {
    customer: string;
    problem: string;
    alternative: string;
    whyGroup: string;
    quotes: Quote[];
    uncertainty: string;
    bars: ScoreBar[];
    overall: number;
    overallLabel: string;
  };
  approaches: Approach[];
  output: Output;
};

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: "sprint",
    num: 1,
    title: "Flash Company Sprint",
    fitBadge: "Strongest fit",
    level: "High",
    levelTone: "good",
    customer: "2–5 person groups of founders, operators, or creators.",
    problem: "They have ideas and energy but lack a structured path to converge on one testable venture.",
    whyUs: "We combine guided structure, expert signals, and peer context to help small groups make real progress fast.",
    evidence: [
      "Repeated pain across all inputs",
      "Early alignment on need for structure",
      "Demand for a lightweight, guided flow",
    ],
    risk: "Groups may not pay for structure before they have a final idea.",
    panel: {
      customer: "2–5 person groups of founders, operators, or creators who want to build together.",
      problem: "They have ideas and energy but lack a structured path to converge on one testable venture.",
      alternative: "Group chats, Notion docs, ad hoc calls, and random brainstorming.",
      whyGroup: "Shared context, complementary skills, direct access to early-stage builders, and fast synthesis.",
      quotes: [
        { memberId: "maya", text: "We need a clear path from ideas to action." },
        { memberId: "alex", text: "Small teams lack structured decision-making." },
        { memberId: "priya", text: "They want guidance, not another tool." },
      ],
      uncertainty: "Whether groups will pay for structure before they have a final business idea.",
      bars: [
        { label: "Desirability", value: 5 },
        { label: "Founder fit", value: 5 },
        { label: "Speed to test", value: 4.5 },
        { label: "Access", value: 5 },
      ],
      overall: 8.7,
      overallLabel: "High potential",
    },
    approaches: [
      {
        icon: "people",
        type: "Service",
        title: "Service: Guided Sprint",
        badge: "Strongest path",
        badgeTone: "good",
        desc: "Run a 2-day facilitated sprint that takes a small group from scattered ideas to one testable venture.",
        recommended: true,
        howItWorks: ["Facilitated workshop with the group", "Diagnose the current state", "Co-create the opportunity map", "Leave with clear next steps"],
        whyItWorks: ["Fast to launch", "High willingness to pay", "Leverages human facilitation", "Builds strong relationships"],
        snapshot: snap([9, 9, 9, 7, 6, 4, 8, 7.6], ["Very easy", "1–2 weeks", "Strong", "Large", "Moderate", "Low", "High", "Strong"]),
        firstTest: "Offer 3 pilot sprints to small builder groups and measure willingness to pay, plan implementation, and referrals.",
      },
      {
        icon: "laptop",
        type: "Software",
        title: "Software: Sprint OS",
        badge: "High upside",
        badgeTone: "warn",
        desc: "A SaaS platform with the guided flow, tools, templates, and rituals built in.",
        howItWorks: ["Self-serve guided flow", "Templates & rituals", "Async team inputs", "AI synthesis of inputs"],
        whyItWorks: ["Scales without facilitators", "Recurring revenue", "Compounding data", "Low marginal cost"],
        snapshot: snap([6, 5, 7, 9, 7, 6, 9, 7.1], ["Moderate", "1–3 months", "Good", "Very large", "Building", "Medium", "Very high", "Strong"]),
        firstTest: "Ship a clickable guided flow to 10 groups and measure activation and week-two retention.",
      },
      {
        icon: "store",
        type: "Marketplace",
        title: "Marketplace: Sprint Facilitators",
        badge: "Medium effort",
        badgeTone: "info",
        desc: "Connect groups with vetted sprint facilitators and operators.",
        howItWorks: ["Vet facilitators", "Match them to groups", "Handle scheduling & payments", "Collect outcomes"],
        whyItWorks: ["Light to start", "Two-sided network", "Trusted supply", "Word-of-mouth growth"],
        snapshot: snap([5, 4, 5, 7, 6, 3, 6, 5.3], ["Slow", "Slower", "Mixed", "Large", "Moderate", "High", "Medium", "Mixed"]),
        firstTest: "Hand-match 5 groups to 3 facilitators and measure repeat bookings.",
      },
      {
        icon: "people",
        type: "Community",
        title: "Community: Builder Circle",
        badge: "Low effort",
        badgeTone: "good",
        desc: "A membership community with cohorts, events, and peer accountability.",
        howItWorks: ["Run cohorts", "Host events", "Peer accountability", "Share playbooks"],
        whyItWorks: ["Cheap to test", "Recurring membership", "Strong retention", "Built-in distribution"],
        snapshot: snap([7, 6, 7, 6, 7, 5, 7, 6.4], ["Easy", "Weeks", "Good", "Medium", "Building", "Medium", "High", "Solid"]),
        firstTest: "Open a paid pilot cohort to 20 builders and measure completion and renewal intent.",
      },
      {
        icon: "doc",
        type: "Content",
        title: "Content Engine",
        badge: "Quick test",
        badgeTone: "neutral",
        desc: "Newsletters, resources, and kits that attract and educate small builder groups.",
        howItWorks: ["Publish playbooks", "Give away a free sprint kit", "Build a list", "Convert to product"],
        whyItWorks: ["Fastest to test", "Builds an audience", "Low cost", "Feeds every other path"],
        snapshot: snap([9, 3, 6, 9, 3, 8, 7, 6.0], ["Very easy", "Slow revenue", "Good", "Very large", "Low", "Very low", "High", "Solid"]),
        firstTest: "Publish a sprint playbook + free kit and measure signups and replies.",
      },
    ],
    output: {
      summary:
        "Flash Company Sprint is a guided 2-day sprint for 2–5 person groups of founders, operators, and creators. It takes a group from scattered ideas and energy to one clear, testable venture — pairing structured facilitation with expert signals and peer context so they converge fast and leave with a plan they can act on.",
      page: {
        nav: ["Why it works", "How it runs", "What you get", "FAQs"],
        headline: "Turn a promising group chat into a testable business.",
        subhead:
          "A 2-day AI-guided sprint that helps small groups find their strongest shared opportunity, define the customer and problem, and launch a simple validation page.",
        cta: "Run a sprint",
        proofCount: "12 pilot teams",
        proofAudience: "founders, operators, creators",
        proofNote: "Early testers are seeing clarity and momentum.",
      },
      outreach: {
        linkedin:
          "Most group chats full of 'we should build something' never become anything.\n\nNot because the people are wrong — because there's no structure to turn energy into one testable venture.\n\nWe run a guided 2-day sprint that fixes exactly that. Piloting with a few small groups now. Comment 'sprint' if you want in.",
        dm:
          "Hey {name} — you and your group keep talking about building something, right? We run a guided 2-day sprint that gets a small team from scattered ideas to one testable venture. Want the 1-pager?",
        email:
          "Subject: turn the group chat into something testable\n\nHi {name},\n\nYou've got the people, the ideas, and the energy — what's missing is a structured way to converge on one thing worth testing.\n\nWe run a guided 2-day sprint that does exactly that, end to end. We're taking on a few pilot groups.\n\nWorth a quick call this week?\n\nMaya, Alex & Priya — Flash Company",
        whatsapp:
          "Hi {name}! We run a guided 2-day sprint that takes a small group from 'we should build something' to one testable venture + a validation page. Taking a few pilot groups — keen?",
      },
      testPlan: {
        hypothesis:
          "We believe small builder groups will pay for a guided sprint if it takes them from scattered ideas to one validated, testable venture in two days.",
        firstTest: "Offer 3 pilot sprints to small builder groups and measure willingness to pay, plan implementation, and referrals.",
        metrics: ["Pilot sprints booked", "Paid conversions", "Plans actually implemented", "Referrals generated"],
        decisionRule:
          "If 8 of the first 30 groups book a pilot sprint and 3 pay within two weeks, we continue. If fewer than 2 pay, we revisit the wedge.",
      },
      deck: [
        { title: "The problem", body: "Small groups have energy and ideas but no structured path to a testable venture." },
        { title: "The customer", body: "2–5 person groups of founders, operators, and creators ready to build." },
        { title: "The solution", body: "A guided 2-day sprint: scattered ideas in, one testable venture out." },
        { title: "Why us", body: "Shared context, complementary skills, and direct access to early builders." },
        { title: "How it runs", body: "Basics → shared inputs → opportunity map → approaches → output." },
        { title: "First test", body: "3 pilot sprints, measured on willingness to pay and implementation." },
        { title: "The ask", body: "Run 3 pilots in the next 30 days and convert 3 to paid." },
      ],
    },
  },
  {
    id: "pods",
    num: 2,
    title: "Builder Pods",
    fitBadge: "Promising",
    level: "Medium",
    levelTone: "warn",
    customer: "Engineering leaders and product teams building internal or new ventures.",
    problem: "Need trusted peers to test ideas and make decisions without long cycles.",
    whyUs: "We provide curated pods, shared context, and decision tools to accelerate alignment and validation.",
    evidence: [
      "Strong interest in peer collaboration",
      "Value in cross-functional diversity",
      "Willingness to try the pod model",
    ],
    risk: "Matching and sustaining active pods at early stages.",
    panel: {
      customer: "Engineering leaders and product teams building internal tools or new ventures.",
      problem: "They need trusted peers to pressure-test ideas and make decisions without slow, lonely cycles.",
      alternative: "Ad hoc Slack groups, accelerator cohorts, and one-off intros.",
      whyGroup: "Curated matching, shared context, and decision tools tuned for early teams.",
      quotes: [
        { memberId: "alex", text: "Small teams lack structured decision-making." },
        { memberId: "maya", text: "Peers make better calls together." },
        { memberId: "priya", text: "Community keeps people accountable." },
      ],
      uncertainty: "Whether we can match and sustain active pods at the earliest stages.",
      bars: [
        { label: "Desirability", value: 4 },
        { label: "Founder fit", value: 3.5 },
        { label: "Speed to test", value: 3.5 },
        { label: "Access", value: 4 },
      ],
      overall: 6.8,
      overallLabel: "Medium potential",
    },
    approaches: [
      {
        icon: "people",
        type: "Service",
        title: "Service: Facilitated Pods",
        badge: "Strongest path",
        badgeTone: "good",
        desc: "Hand-run small builder pods with a facilitator and decision rituals.",
        recommended: true,
        howItWorks: ["Curate 4–5 person pods", "Run weekly decision rituals", "Facilitate accountability", "Track outcomes"],
        whyItWorks: ["Fast to start", "High-touch trust", "Clear weekly value", "Strong word of mouth"],
        snapshot: snap([8, 7, 7, 6, 6, 4, 7, 6.7], ["Easy", "Weeks", "Good", "Medium", "Moderate", "Medium", "High", "Solid"]),
        firstTest: "Run 3 facilitated pods for 4 weeks and measure renewal and referrals.",
      },
      {
        icon: "laptop",
        type: "Software",
        title: "Software: Pod OS",
        badge: "High upside",
        badgeTone: "warn",
        desc: "A platform that forms pods, runs rituals, and captures decisions.",
        howItWorks: ["Self-serve pod formation", "Built-in decision rituals", "Async check-ins", "Decision log"],
        whyItWorks: ["Scales matching", "Recurring revenue", "Compounding data", "Low marginal cost"],
        snapshot: snap([5, 5, 6, 8, 7, 6, 9, 6.8], ["Moderate", "1–3 months", "Good", "Large", "Building", "Medium", "Very high", "Solid"]),
        firstTest: "Ship pod formation + ritual templates to 8 pods and measure weekly active use.",
      },
      {
        icon: "store",
        type: "Marketplace",
        title: "Marketplace: Pod Match",
        badge: "Medium effort",
        badgeTone: "info",
        desc: "Match builders into pods and with facilitators on demand.",
        howItWorks: ["Vet members & facilitators", "Match by stage & goal", "Handle logistics", "Collect feedback"],
        whyItWorks: ["Light to start", "Network effects", "Trusted supply", "Organic growth"],
        snapshot: snap([5, 4, 5, 7, 6, 3, 6, 5.3], ["Slow", "Slower", "Mixed", "Large", "Moderate", "High", "Medium", "Mixed"]),
        firstTest: "Hand-match 10 builders into 2 pods and measure 4-week retention.",
      },
      {
        icon: "people",
        type: "Community",
        title: "Community: Pod Collective",
        badge: "Low effort",
        badgeTone: "good",
        desc: "A membership community organised around recurring pods.",
        howItWorks: ["Run rolling cohorts", "Host events", "Pod accountability", "Shared resource library"],
        whyItWorks: ["Cheap to test", "Recurring membership", "High retention", "Built-in distribution"],
        snapshot: snap([7, 6, 6, 6, 7, 5, 7, 6.3], ["Easy", "Weeks", "Good", "Medium", "Building", "Medium", "High", "Solid"]),
        firstTest: "Open a paid pilot collective to 25 builders and measure pod activity and renewal.",
      },
      {
        icon: "doc",
        type: "Content",
        title: "Content Engine",
        badge: "Quick test",
        badgeTone: "neutral",
        desc: "Playbooks and templates on running effective builder pods.",
        howItWorks: ["Publish pod playbooks", "Give away ritual templates", "Build a list", "Convert to pods"],
        whyItWorks: ["Fastest to test", "Builds audience", "Low cost", "Feeds the other paths"],
        snapshot: snap([9, 3, 6, 8, 3, 8, 6, 5.8], ["Very easy", "Slow revenue", "Good", "Large", "Low", "Very low", "High", "Mixed"]),
        firstTest: "Publish a pod playbook + templates and measure signups and pod starts.",
      },
    ],
    output: {
      summary:
        "Builder Pods gives engineering leaders and product teams a curated pod of trusted peers, with shared context and decision rituals, so they pressure-test ideas and make calls fast — without slow, lonely cycles.",
      page: {
        nav: ["Why pods", "How it runs", "What you get", "FAQs"],
        headline: "Build with peers who actually move your decisions forward.",
        subhead:
          "A curated pod of builders, shared context, and weekly decision rituals — so your team tests ideas and makes calls without long, lonely cycles.",
        cta: "Join a pod",
        proofCount: "9 pilot pods",
        proofAudience: "eng leaders, product teams",
        proofNote: "Early pods report faster, more confident decisions.",
      },
      outreach: {
        linkedin:
          "Building alone is slow. Building with the wrong people is slower.\n\nWe're forming small builder pods — curated peers, shared context, weekly decision rituals — to help teams test ideas and decide faster. Comment 'pod' if you want in.",
        dm:
          "Hey {name} — would a small pod of trusted builders help you make decisions faster? We're forming a few curated pods now. Want the details?",
        email:
          "Subject: a pod of peers to move your decisions faster\n\nHi {name},\n\nMost builders don't lack ideas — they lack a trusted few to pressure-test them with. We're forming small, curated pods with weekly decision rituals.\n\nWant in on the next one?\n\nMaya, Alex & Priya — Flash Company",
        whatsapp:
          "Hi {name}! Forming small builder pods — curated peers + weekly decision rituals to help you move faster. Want a spot in the next pod?",
      },
      testPlan: {
        hypothesis:
          "We believe builders will pay to join a curated pod if it measurably speeds up their decisions and keeps them accountable over four weeks.",
        firstTest: "Run 3 facilitated pods for 4 weeks and measure renewal and referrals.",
        metrics: ["Pods filled", "4-week retention", "Paid renewals", "Referrals"],
        decisionRule:
          "If all 3 pilot pods stay active for 4 weeks and at least 2 renew paid, we continue. If pods stall, the matching model isn't ready.",
      },
      deck: [
        { title: "The problem", body: "Builders make slow, lonely decisions without trusted peers." },
        { title: "The customer", body: "Engineering leaders and product teams at the early stage." },
        { title: "The solution", body: "Curated pods with shared context and weekly decision rituals." },
        { title: "Why us", body: "Access to builders plus tools tuned for early-team decisions." },
        { title: "How it runs", body: "Match → ritual → accountability → outcomes." },
        { title: "First test", body: "3 facilitated pods over 4 weeks, measured on renewal." },
        { title: "The ask", body: "Fill and retain 3 pods, convert 2 to paid renewals." },
      ],
    },
  },
  {
    id: "copilot",
    num: 3,
    title: "Validation Co-pilot",
    fitBadge: "Exploratory",
    level: "Medium–Low",
    levelTone: "info",
    customer: "Founders and operators validating ideas before incorporating or fundraising.",
    problem: "Unclear which validation steps matter most and how to interpret signals.",
    whyUs: "We distill expert tactics and community feedback into a smart co-pilot.",
    evidence: [
      "Need for simple validation guidance",
      "Interest in AI-assisted synthesis",
      "Early appetite for automation",
    ],
    risk: "AI trust and accuracy for early venture contexts.",
    panel: {
      customer: "Founders and operators validating an idea before incorporating or fundraising.",
      problem: "They don't know which validation steps matter most, or how to read the signals they get back.",
      alternative: "Generic blog posts, scattered advice threads, and gut feel.",
      whyGroup: "We turn expert validation tactics and community feedback into clear, guided next steps.",
      quotes: [
        { memberId: "priya", text: "People want clearer ways to validate before committing." },
        { memberId: "alex", text: "Early appetite for AI-assisted synthesis is real." },
        { memberId: "maya", text: "They need to know which steps actually matter." },
      ],
      uncertainty: "Whether founders will trust AI guidance enough to act on it this early.",
      bars: [
        { label: "Desirability", value: 4 },
        { label: "Founder fit", value: 3 },
        { label: "Speed to test", value: 3.5 },
        { label: "Access", value: 3 },
      ],
      overall: 5.9,
      overallLabel: "Worth a probe",
    },
    approaches: [
      {
        icon: "people",
        type: "Service",
        title: "Service: Validation Concierge",
        badge: "Strongest path",
        badgeTone: "good",
        desc: "Guide founders through validation by hand, step by step.",
        recommended: true,
        howItWorks: ["Map the riskiest assumption", "Design the validation step", "Run it with them", "Interpret the signals"],
        whyItWorks: ["Fast to start", "Builds trust early", "Teaches what to automate", "High willingness to pay"],
        snapshot: snap([8, 6, 6, 6, 5, 4, 7, 6.0], ["Easy", "Weeks", "Good", "Medium", "Low", "Medium", "High", "Solid"]),
        firstTest: "Concierge 5 founders through one validation cycle and measure perceived value.",
      },
      {
        icon: "laptop",
        type: "Software",
        title: "Software: Co-pilot App",
        badge: "High upside",
        badgeTone: "warn",
        desc: "An AI co-pilot that recommends validation steps and reads the results.",
        howItWorks: ["Surface riskiest assumptions", "Recommend validation steps", "Capture results", "Interpret signals"],
        whyItWorks: ["Scales guidance", "Recurring revenue", "Compounding data", "Low marginal cost"],
        snapshot: snap([5, 5, 6, 8, 6, 6, 9, 6.4], ["Moderate", "1–3 months", "Good", "Large", "Building", "Medium", "Very high", "Solid"]),
        firstTest: "Ship a guided validation flow to 10 founders and measure completion and trust.",
      },
      {
        icon: "store",
        type: "Marketplace",
        title: "Marketplace: Validator Network",
        badge: "Medium effort",
        badgeTone: "info",
        desc: "Match founders with vetted validation experts.",
        howItWorks: ["Vet validators", "Match by idea stage", "Handle logistics", "Collect outcomes"],
        whyItWorks: ["Light to start", "Two-sided network", "Expert trust", "Organic growth"],
        snapshot: snap([4, 4, 4, 6, 6, 3, 6, 4.9], ["Slow", "Slower", "Mixed", "Medium", "Moderate", "High", "Medium", "Mixed"]),
        firstTest: "Hand-match 5 founders to 3 validators and measure repeat use.",
      },
      {
        icon: "people",
        type: "Community",
        title: "Community: Validators Guild",
        badge: "Low effort",
        badgeTone: "good",
        desc: "A community where founders validate together and share signals.",
        howItWorks: ["Run validation cohorts", "Share live experiments", "Peer feedback", "Pattern library"],
        whyItWorks: ["Cheap to test", "Recurring membership", "Peer trust", "Built-in distribution"],
        snapshot: snap([7, 5, 6, 6, 6, 5, 7, 5.9], ["Easy", "Weeks", "Good", "Medium", "Building", "Medium", "High", "Mixed"]),
        firstTest: "Open a paid validation cohort to 20 founders and measure participation.",
      },
      {
        icon: "doc",
        type: "Content",
        title: "Content Engine",
        badge: "Quick test",
        badgeTone: "neutral",
        desc: "Guides and templates that teach founders how to validate.",
        howItWorks: ["Publish validation guides", "Give away templates", "Build a list", "Convert to product"],
        whyItWorks: ["Fastest to test", "Builds audience", "Low cost", "Feeds other paths"],
        snapshot: snap([9, 3, 6, 8, 3, 8, 6, 5.7], ["Very easy", "Slow revenue", "Good", "Large", "Low", "Very low", "High", "Mixed"]),
        firstTest: "Publish a validation guide + templates and measure signups and replies.",
      },
    ],
    output: {
      summary:
        "Validation Co-pilot helps founders and operators validate an idea before they incorporate or fundraise — distilling expert tactics and community feedback into clear, guided steps and a read on what the signals actually mean.",
      page: {
        nav: ["Why it works", "How it runs", "What you get", "FAQs"],
        headline: "Validate your idea before you bet a year on it.",
        subhead:
          "A co-pilot that tells you which validation steps matter most, runs them with you, and helps you read the signals — before you incorporate or raise.",
        cta: "Start validating",
        proofCount: "10 pilot founders",
        proofAudience: "pre-incorporation founders",
        proofNote: "Early users report clearer next steps and fewer dead ends.",
      },
      outreach: {
        linkedin:
          "Most founders validate by vibes — then wonder why the signals lied.\n\nWe're building a co-pilot that tells you which validation steps actually matter and helps you read the results. Comment 'validate' for early access.",
        dm:
          "Hey {name} — validating an idea right now? We're piloting a co-pilot that picks the right validation steps and helps you read the signals. Want a look?",
        email:
          "Subject: validate before you bet a year on it\n\nHi {name},\n\nThe hardest part of early validation isn't running tests — it's knowing which ones matter and what the results mean.\n\nWe're piloting a co-pilot that does both. Want early access?\n\nMaya, Alex & Priya — Flash Company",
        whatsapp:
          "Hi {name}! Piloting a validation co-pilot — it picks the right steps and helps you read the signals before you incorporate/raise. Want early access?",
      },
      testPlan: {
        hypothesis:
          "We believe early founders will pay for guided validation if it gives them clearer next steps and a trustworthy read on their signals.",
        firstTest: "Concierge 5 founders through one validation cycle and measure perceived value.",
        metrics: ["Founders guided", "Steps completed", "Trust in the read", "Willingness to pay"],
        decisionRule:
          "If 4 of 5 concierge founders complete a cycle and rate the guidance highly, we continue. If trust is low, the AI read isn't ready.",
      },
      deck: [
        { title: "The problem", body: "Founders don't know which validation steps matter or how to read the signals." },
        { title: "The customer", body: "Founders and operators validating before incorporating or raising." },
        { title: "The solution", body: "A co-pilot that picks the right steps and interprets the results." },
        { title: "Why us", body: "Expert tactics plus community feedback distilled into guidance." },
        { title: "How it runs", body: "Find the risk → run the step → read the signal → decide." },
        { title: "First test", body: "Concierge 5 founders through one validation cycle." },
        { title: "The ask", body: "Guide 5 founders and earn high trust ratings." },
      ],
    },
  },
];

export const OUTPUT_MENU: { id: string; label: string; icon: IconName }[] = [
  { id: "summary", label: "Opportunity summary", icon: "doc" },
  { id: "page", label: "Landing page", icon: "laptop" },
  { id: "outreach", label: "Outreach copy", icon: "people" },
  { id: "testplan", label: "Test plan", icon: "check" },
  { id: "deck", label: "Pitch deck", icon: "chart" },
];
