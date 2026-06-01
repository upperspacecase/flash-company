// Canned content for the Flash Company sprint demo.
// One concrete group ("The Tuesday Group") walking the real process:
// People -> Patterns -> Opportunities -> Approaches -> Test.

export type Rating = "High" | "Med" | "Low";

export const DIMENSIONS = [
  "Ease to test",
  "Speed to revenue",
  "Founder fit",
  "Market size",
  "Lean ops",
  "Defensibility",
  "Distribution",
] as const;

export type Dimension = (typeof DIMENSIONS)[number];

export type Member = {
  id: string;
  name: string;
  initials: string;
  role: string;
  skills: string;
  network: string;
  style: string;
  time: string;
  chip: string; // static tailwind classes for per-person tinting
  dot: string;
};

export const MEMBERS: Member[] = [
  {
    id: "maya",
    name: "Maya R.",
    initials: "MR",
    role: "Ex-physio, ran a Pilates studio for 6 years",
    skills: "Physio, Pilates programming, retention & content",
    network: "18k Instagram in women's fitness, studio owners",
    style: "High-energy, front-of-house",
    time: "10 hrs/wk",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  {
    id: "devon",
    name: "Devon K.",
    initials: "DK",
    role: "Full-stack engineer at two startups",
    skills: "Full-stack, automation, data plumbing",
    network: "Indie-hacker Discords, ex-startup colleagues",
    style: "Heads-down builder",
    time: "15 hrs/wk",
    chip: "bg-sky-50 text-sky-700 border-sky-200",
    dot: "bg-sky-500",
  },
  {
    id: "priya",
    name: "Priya S.",
    initials: "PS",
    role: "Community-health admin",
    skills: "Ops, support, knows clinic workflows",
    network: "~30 warm independent clinic owners",
    style: "Organiser, relationship-keeper",
    time: "8 hrs/wk",
    chip: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
];

export const CONTEXT = {
  industries: ["Allied health", "Fitness & wellness", "Small-business software"],
  communities: [
    "Independent physio & Pilates clinics",
    "Boutique studio owners",
    "Indie-hacker forums",
  ],
  problems: [
    "Clinics drowning in admin",
    "High no-show rates",
    "Dormant clients who never re-book",
  ],
  assets: [
    "Maya's audience + retention playbook",
    "Priya's warm intros to ~30 clinics",
    "Devon ships software fast",
  ],
};

export const CONSTRAINTS = [
  { label: "Time", value: "Part-time, evenings & weekends" },
  { label: "Money", value: "~$5k pooled, no outside funding" },
  { label: "Risk", value: "Low-to-moderate, want revenue in ~60 days" },
  { label: "Type", value: "Lean service or software, not acquisition" },
];

export const SHARED_PROMPTS = [
  "What problems do you keep seeing?",
  "What do people ask you for help with?",
  "What communities do you have access to?",
  "What would you be weirdly well-positioned to build?",
  "What do you not want to build?",
];

// Per-member answers, indexed to SHARED_PROMPTS.
export const SHARED_INPUTS: Record<string, string[]> = {
  maya: [
    "Studios lose clients quietly — they just stop showing up and nobody follows up.",
    "How to keep clients coming back, and how to actually post consistently.",
    "Fitness creators and a chunk of independent studio owners.",
    "A retention system any small studio could run — I do it in my sleep.",
    "Another generic workout app.",
  ],
  devon: [
    "Small businesses paste data between five tools by hand all day.",
    "Automating the boring ops glue — reminders, exports, follow-ups.",
    "Indie hackers, plus engineers from my old startups.",
    "A tool that turns a messy client list into automated campaigns.",
    "Anything that needs a big sales team or heavy compliance.",
  ],
  priya: [
    "Clinic owners keep saying 'we mean to email old clients but never do.'",
    "Setting up systems and chasing the admin nobody wants to touch.",
    "~30 independent clinic owners who already trust me.",
    "The bridge between clinic owners and a team that can build for them.",
    "A marketplace — too slow, two-sided, no early revenue.",
  ],
};

// Raw input cards for the board's first column.
export const INPUT_CARDS = [
  { memberId: "maya", kind: "Problem noticed", text: "Studios lose clients silently; no follow-up system." },
  { memberId: "maya", kind: "Skill", text: "Reactivated 40% of dormant Pilates clients with her own scripts." },
  { memberId: "priya", kind: "Customer access", text: "Warm relationships with ~30 independent clinic owners." },
  { memberId: "priya", kind: "Problem noticed", text: "'We mean to email old clients but never do' — heard weekly." },
  { memberId: "devon", kind: "Skill", text: "Can automate list → campaign plumbing in days." },
  { memberId: "devon", kind: "Constraint", text: "Wants something testable without a sales team." },
];

export type Pattern = {
  kind: string;
  text: string;
  tone: "good" | "risk";
};

export const PATTERNS: Pattern[] = [
  { kind: "Repeated problem", text: "'Dormant clients' surfaced by Maya and Priya independently.", tone: "good" },
  { kind: "Strong customer access", text: "Priya has warm intros to ~30 independent clinics.", tone: "good" },
  { kind: "Unique overlap", text: "Clinical credibility (Maya, Priya) + software speed (Devon).", tone: "good" },
  { kind: "Unusual insight", text: "Clinics already own the client list — reactivation is untapped revenue, not new acquisition.", tone: "good" },
  { kind: "Promising wedge", text: "Done-for-you client reactivation for independent physio & Pilates clinics.", tone: "good" },
  { kind: "Risky assumption", text: "Owners will pay before they see booked appointments.", tone: "risk" },
];

export type Approach = {
  name: string;
  desc: string;
  ratings: Record<Dimension, Rating>;
  recommended?: boolean;
};

export type Opportunity = {
  id: string;
  title: string;
  tag: string;
  customer: string;
  problem: string;
  alternative: string;
  whyUs: string;
  evidence: string;
  risk: string;
  firstTest: string;
  approaches: Approach[];
  recommendedNote: string;
  output: {
    oneLiner: string;
    statement: string;
    hypothesis: string;
    page: { title: string; subtitle: string; cta: string };
    outreach: { linkedin: string; dm: string; email: string; whatsapp: string };
    decisionRule: string;
  };
};

function ratings(vals: Rating[]): Record<Dimension, Rating> {
  return Object.fromEntries(DIMENSIONS.map((d, i) => [d, vals[i]])) as Record<
    Dimension,
    Rating
  >;
}

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: "reactivation",
    title: "Reactivation engine for independent clinics",
    tag: "Promising wedge",
    customer: "Owners of independent physio & Pilates clinics (1–3 practitioners).",
    problem:
      "Hundreds of past clients go dormant. Owners have no time or system to win them back, so the revenue just sits in the database.",
    alternative:
      "Occasional manual SMS blasts, or nothing. A few use generic email tools they never maintain.",
    whyUs:
      "Priya's warm relationships + Maya's proven retention scripts + Devon's automation. Clinical trust and done-for-you speed in one team.",
    evidence:
      "Priya hears 'we keep meaning to email old clients' weekly. Maya reactivated 40% of her own dormant Pilates clients with a simple playbook.",
    risk: "Will owners pay up front, or only on results? Is reactivation a painkiller or a vitamin for them?",
    firstTest: "Landing page + 10 warm clinic DMs offering a done-for-you reactivation pilot.",
    approaches: [
      { name: "Service (concierge)", desc: "Run reactivation by hand for 3 clinics on a flat fee + rev-share.", ratings: ratings(["High", "High", "High", "Med", "Med", "Low", "High"]), recommended: true },
      { name: "Software (self-serve)", desc: "Ship a tool clinics run themselves.", ratings: ratings(["Med", "Low", "Med", "High", "High", "Med", "Med"]) },
      { name: "Marketplace", desc: "Match clinics with freelance reactivation specialists.", ratings: ratings(["Low", "Low", "Low", "Med", "Low", "Med", "Low"]) },
      { name: "Community / cohort", desc: "Teach owners to run it themselves in a paid cohort.", ratings: ratings(["Med", "Med", "Med", "Low", "Med", "Med", "Med"]) },
      { name: "Acquisition", desc: "Buy a small agency already serving clinics.", ratings: ratings(["Low", "Med", "Low", "Med", "Low", "High", "Low"]) },
      { name: "Content / lead-gen", desc: "Validate demand with posts and a waitlist first.", ratings: ratings(["High", "Low", "Med", "High", "High", "Low", "High"]) },
    ],
    recommendedNote:
      "Start as a concierge service. Run reactivation manually for 3 of Priya's warm clinics on a flat fee plus a share of recovered revenue. It is the fastest path to real money and proof, and it teaches you exactly what to automate later.",
    output: {
      oneLiner:
        "Flashback runs done-for-you client reactivation campaigns for independent physio and Pilates clinics — we win back your dormant clients on a pay-for-results basis.",
      statement:
        "Independent clinic owners have hundreds of lapsed clients and no system to recover them. They want the revenue back but have no time to chase it.",
      hypothesis:
        "We believe independent clinic owners have lapsed-client revenue they can't recover alone, and will pay for a done-for-you reactivation campaign if we show booked appointments from their existing list.",
      page: {
        title: "Win back the clients who quietly stopped coming.",
        subtitle:
          "We run a done-for-you reactivation campaign on your existing client list. You only pay for the appointments we book.",
        cta: "Book a 15-min reactivation audit",
      },
      outreach: {
        linkedin:
          "Most clinics don't have a new-client problem. They have a forgotten-client problem.\n\nThe people who stopped coming 6 months ago are the easiest revenue you'll ever recover — you just need a system to bring them back.\n\nWe're piloting done-for-you reactivation with 3 independent clinics. Pay only for booked appointments. DM me 'reactivate'.",
        dm:
          "Hey {name} — quick one. You mentioned a while back you keep meaning to email old clients and never get to it. We're piloting a done-for-you reactivation campaign for a few clinics — we run it, you only pay for appointments we book. Want me to send the 1-pager?",
        email:
          "Subject: the clients who quietly stopped coming\n\nHi {name},\n\nYou've probably got a few hundred past clients sitting in your system who'd happily come back — they just haven't been asked.\n\nWe run that campaign for you, end to end, and you only pay for the appointments we book. We're taking on 3 clinics for a pilot.\n\nWorth a 15-minute call this week?\n\nMaya, Priya & Devon — Flashback",
        whatsapp:
          "Hi {name}! We're running a done-for-you reactivation pilot for a few clinics — we win back your dormant clients and you only pay per booked appt. Free 15-min audit to see how many you could recover. Keen?",
      },
      decisionRule:
        "If 8 of 30 clinics book an audit and 3 agree to a paid pilot within 2 weeks, we continue. If fewer than 2 pay, we revisit the wedge.",
    },
  },
  {
    id: "noshow",
    title: "No-show rescue for busy clinics",
    tag: "Adjacent pain",
    customer: "The same independent clinic owners, fighting a packed-but-leaky schedule.",
    problem:
      "A 15–25% no-show rate burns revenue and wrecks the day's schedule. Owners react manually, late, and inconsistently.",
    alternative:
      "Manual SMS, or the generic reminders built into their booking software that nobody tunes.",
    whyUs:
      "Priya's access, Devon's automation, and Maya's instinct for messaging that actually gets clients through the door.",
    evidence: "Owners routinely name no-shows as their single most frustrating, costly problem.",
    risk: "Their booking software may already do reminders 'well enough' to feel like a feature, not a product.",
    firstTest: "Run a smart-reminder flow by hand for 2 clinics for a fortnight and measure the no-show drop.",
    approaches: [
      { name: "Service (concierge)", desc: "Manually manage reminders & confirmations.", ratings: ratings(["High", "Med", "Med", "Med", "Low", "Low", "Med"]) },
      { name: "Software (self-serve)", desc: "A lightweight add-on that tunes reminders automatically.", ratings: ratings(["Med", "Med", "Med", "High", "High", "Med", "Med"]), recommended: true },
      { name: "Marketplace", desc: "n/a — wrong shape for this problem.", ratings: ratings(["Low", "Low", "Low", "Low", "Low", "Low", "Low"]) },
      { name: "Community / cohort", desc: "Teach owners a no-show playbook.", ratings: ratings(["Med", "Low", "Med", "Low", "Med", "Low", "Med"]) },
      { name: "Acquisition", desc: "Buy an existing reminder tool.", ratings: ratings(["Low", "Med", "Low", "Med", "Low", "Med", "Low"]) },
      { name: "Content / lead-gen", desc: "Publish a no-show benchmark report to pull leads.", ratings: ratings(["High", "Low", "Med", "Med", "High", "Low", "Med"]) },
    ],
    recommendedNote:
      "Lead with a lightweight self-serve add-on. The pain is concrete and recurring, but it's a feature-shaped problem — only worth it if you can ship something their booking software clearly doesn't, fast.",
    output: {
      oneLiner:
        "Flashback's no-show rescue tunes reminders and confirmations automatically so independent clinics stop bleeding revenue to empty slots.",
      statement:
        "Independent clinics lose 15–25% of booked revenue to no-shows and handle it manually and inconsistently.",
      hypothesis:
        "We believe clinic owners will pay for an add-on that cuts no-shows if we can show a measurable drop within two weeks of switching it on.",
      page: {
        title: "Stop paying for empty appointment slots.",
        subtitle:
          "Smart reminders and confirmations that learn what gets your clients to show up. See your no-show rate drop in two weeks.",
        cta: "Start a 2-week no-show trial",
      },
      outreach: {
        linkedin:
          "A 20% no-show rate isn't a scheduling problem. It's a revenue leak you've stopped noticing.\n\nWe're trialling a reminder system that actually learns what gets your clients to show. Two weeks, measurable drop, or you walk. Comment 'show' if you want in.",
        dm:
          "Hi {name} — how bad are no-shows for you right now? We're trialling a smart-reminder add-on with a couple of clinics — measurable drop in 2 weeks or you walk away. Want the details?",
        email:
          "Subject: your no-show rate is a revenue leak\n\nHi {name},\n\nIf 1 in 5 booked clients doesn't show, that's a fifth of your day's revenue gone — and reminders-as-usual aren't fixing it.\n\nWe're running a 2-week trial of a smarter reminder flow with a few clinics. Measurable drop or you walk.\n\nUp for it?\n\nFlashback",
        whatsapp:
          "Hey {name}! Quick one — we're trialling a smart no-show reminder system. 2 weeks, measurable drop in no-shows or you walk away free. Want in?",
      },
      decisionRule:
        "If 2 trial clinics see a 30%+ drop in no-shows and both convert to paid, we continue. If the drop is marginal, it's a feature, not a business.",
    },
  },
  {
    id: "retention-content",
    title: "Retention content service for studio owners",
    tag: "Audience-led",
    customer: "Boutique Pilates & yoga studio owners with small audiences and no marketing time.",
    problem:
      "They're great at coaching, weak at marketing. Clients drift because nothing keeps them engaged between visits.",
    alternative:
      "Sporadic DIY posts, or an expensive agency that doesn't understand fitness retention.",
    whyUs:
      "Maya's proven retention-and-content playbook and an 18k audience to recruit from; Priya's network; Devon to systemise delivery.",
    evidence: "Maya is constantly asked 'how do you keep your clients coming back?' by other owners.",
    risk: "Content is a vitamin — hard to attribute to revenue, and the space is crowded.",
    firstTest: "Sell a paid 3-week retention cohort to Maya's warm audience and see who pays.",
    approaches: [
      { name: "Service (concierge)", desc: "Done-for-you retention content per studio.", ratings: ratings(["Med", "Med", "High", "Med", "Low", "Low", "High"]) },
      { name: "Software (self-serve)", desc: "A content engine studios run themselves.", ratings: ratings(["Low", "Low", "Med", "Med", "High", "Low", "Med"]) },
      { name: "Marketplace", desc: "Match studios with retention creators.", ratings: ratings(["Low", "Low", "Low", "Med", "Low", "Low", "Med"]) },
      { name: "Community / cohort", desc: "Teach Maya's retention system in a paid cohort.", ratings: ratings(["High", "High", "High", "Med", "Med", "Med", "High"]), recommended: true },
      { name: "Acquisition", desc: "Buy a small fitness-marketing newsletter.", ratings: ratings(["Low", "Med", "Med", "Med", "Low", "Med", "Med"]) },
      { name: "Content / lead-gen", desc: "Grow Maya's audience, then sell in.", ratings: ratings(["High", "Low", "High", "High", "High", "Low", "High"]) },
    ],
    recommendedNote:
      "Run it as a paid cohort first. Maya's audience is the cheapest distribution you have — sell her retention system to a small group, learn what actually moves their numbers, then decide whether to productise.",
    output: {
      oneLiner:
        "Flashback teaches boutique studio owners Maya's client-retention system in a hands-on paid cohort, so they keep the clients they already have.",
      statement:
        "Boutique studio owners lose clients to drift because they have no retention system and no time to build one.",
      hypothesis:
        "We believe studio owners will pay for a cohort that gives them a working retention system if Maya's audience signals real demand and the first cohort improves their numbers.",
      page: {
        title: "Keep the clients you already worked so hard to win.",
        subtitle:
          "A 3-week cohort teaching the exact retention system Maya used to keep 40% more of her studio's clients.",
        cta: "Join the next cohort",
      },
      outreach: {
        linkedin:
          "You don't have a client-acquisition problem. You have a client-retention problem.\n\nI kept 40% more of my studio's clients with one simple system. I'm teaching it to a small group of studio owners in a 3-week cohort. Comment 'retain' for the details.",
        dm:
          "Hey {name}! You asked a while back how I keep clients coming back — I'm running a small 3-week cohort teaching the exact system. Want me to send the outline?",
        email:
          "Subject: keep the clients you already have\n\nHi {name},\n\nMost studios pour everything into new clients and quietly lose the ones they've got. I kept 40% more of mine with one repeatable system.\n\nI'm teaching it to a small cohort over 3 weeks. Want the outline?\n\nMaya — Flashback",
        whatsapp:
          "Hi {name}! Running a small 3-week cohort on the retention system I used at my studio (kept ~40% more clients). Keen for the outline?",
      },
      decisionRule:
        "If 12 owners pay for the first cohort and most report a measurable retention lift, we continue. If we can't fill a cohort from a warm audience, demand isn't there.",
    },
  },
];

export const STAGES = [
  { id: "basics", label: "Basics", blurb: "The raw material — people, context, constraints." },
  { id: "shared", label: "Shared inputs", blurb: "Everyone contributes separately, before the group converges." },
  { id: "map", label: "Opportunity map", blurb: "Messy inputs become concrete opportunities." },
  { id: "approaches", label: "Approaches", blurb: "Same opportunity, different ways to build it." },
  { id: "output", label: "Output", blurb: "A testable business, ready to put in front of people." },
] as const;
