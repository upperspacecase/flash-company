# Flash Company — Product Requirements Document

> Source: Ty × River working session, June 01. This PRD captures only what was
> discussed in that session — no features have been added.

**Naming status:** Not finalized. Front-runner is **Flash Company** (Ty's
preference — echoes "Fast Company" and "flash mob," and links to Gemini Flash,
which could be the backend agent if submitted for XPRIZE). Alternatives raised:
**Co-op Mode**, **Crossover**. Domain leaning toward **FlashDash.co** (~€10,
available). To be slept on / decided.

## 1. Concept

A time-boxed, asynchronous, agent-driven process that helps a small group form a
venture together. A group of up to 5 people each feed input individually into one
shared agent over a fixed window (target ~72 hours / 3 days, though could be 2–5
days). The time constraint is treated as a positive feature, not a limitation —
it forces action and creates a "flossing function."

Key principles established:

- **Individual input, not group chat.** Each person contributes separately;
  everything feeds into one shared spot. Group chats were explicitly rejected as
  "a plague in their own right."
- **Chat-based interface** (WhatsApp-style was floated) where the agent iterates
  by asking questions, with a backend dashboard as the editable output.
- **Data dump → insight, not a prescriptive wizard.** Ty flagged that his
  existing wizard-walkthrough demo is too prescriptive and not the optimal
  version. The AI unlock is letting people dump information and then pulling
  patterns, insights, and sourced opportunities out of it — while still giving
  outputs a concrete structure / template with best practices.
- **Invitation-driven trust.** Compelling because someone you trust sends it to
  you ("you're in, I'm in, let's bring in a third/fourth"). Low bar on time and
  input commitment.

## 2. The Flow (Phases)

**Phase 1 — Convergence.** Kick-off invites each person to submit questions,
data, perspectives, observations, resources, and social networks. Inputs can be
text, voice memo, photo, link, or document upload. Output: a convergence map that
starts connecting the pieces.

**Phase 2 — Formation.** The agent reads the convergence map and proposes venture
ideas, team roles, an equity framework, and a validation plan — surfacing 3–5
ranked venture hypotheses. Participants then vote / approve / challenge / pivot,
with the ability to "park" or "put in the tumble dryer" any part. Output (by day
2): a committed team with a refined venture outlook.

**Phase 3 — Output (Day 3).** Walk away with something ready to share: pitch
deck, landing page copy, 30-day roadmap, and outreach copy. (River's view:
outreach copy matters more than the pitch deck, at least for the first ideation
pass — it lets the group share with an initial circle of 5–10 people outside the
invited group for early validation.)

**Phase 4 — Follow-through (outside the 72-hour window).** Structured around the
21- or 30-day mark, with intermittent agent check-ins at day 7, 14, 21, 30. After
the intensive 3-day window the agent effectively shuts down, returning only at
those checkpoints — removing constant agent reliance and pushing the group to do
the work themselves.

## 3. Target Markets

**Primary**

- **Friend groups with complementary skills.** Cited stat (from a 2024 survey,
  flagged as unverified in discussion): ~70% of people aged 28–45 have considered
  starting a business with friends/family, but only ~12% took concrete action.
  Current behavior: WhatsApp groups with idle "should we start?"
- **Family members with complementary resources.** Skills + capital, often
  intergenerational. Friction points: management, scheduling, and fairness (noted
  as upskilling, not "basic").
- **Professional networks** (colleagues, alumni, industry peers). "I know 20
  people who could build something amazing but don't know how to connect them /
  what to build." Current behavior: LinkedIn "let's catch up" coffees and
  conference side-conversations with little follow-up.

**Secondary (explicitly NOT a focus)**

- Romantic partners starting a business together
- Neighbors / local community groups

## 4. Features (MVP)

- **Cohort formation.** Invite 3–5 people into the space. Import contacts from
  phone, WhatsApp, LinkedIn, Instagram. AI analyzes the network and suggests
  cohorts based on skill complementarity, relationship strength, and availability
  patterns.
  - Resolved scope (per Ty's pushback): this is **not a matching service**. It
    works from who is already in the space ("you'd make a strong team for this
    venture / these hypotheses"), and can then suggest people from your own
    contacts you could likely test the idea with.
- **Async input collection.** Each person submits asynchronously each day across
  the 3 days — questions, data, observations, resources — prompted by the agent.
  Designed as a low time commitment that can scale up if people are into it.
- **Convergence synthesis.** The agent identifies overlaps, tension points, gaps,
  and hidden complementarities (skills/resources that fit together unexpectedly),
  connects these with current market signals, and outputs potential venture
  hypotheses.
- **Structured deliberation.** People discuss, vote, and give feedback on the
  agent's output.
- **Role & equity framework.** Who does what; who gets how much. Role is treated
  as the important early-stage element, with equity possibly embedded in role.
- **Validation protocol (validation engine).** Helps the group validate the
  chosen idea via tests appropriate to the venture. The agent generates outreach
  text and landing page text to share; resulting feedback is fed back into the
  engine. (Mirrors the manual loop River already runs: send question → get voice
  note → transcribe → into agent.)
- **Venture birth certificate** (placeholder name, acknowledged as weak). The
  venture outline: thesis, team charter, roles, responsibilities, decision-making
  framework, 30-day sprints, pitch deck, landing page, validation report, next
  steps, and a commitment ritual — each person records a 30-second video ("I'm in
  for 30 days, my first task is X, due date is Y"). Commitment device seen as
  valuable.
- **30-day agent follow-up.** After the 3-day intensive, the agent is only
  accessible at day 7, 14, 21, 30. Creates positive constraints and is efficient
  on token usage.

## 5. Advanced Features (Post-MVP)

- **Multi-cohort orchestration / white-label.** Sell the system to organizations
  to run through their alumni network, HR / corporate innovation network, etc.
- **Industry-specific agent tuning.** When a location and industry are already
  known, the agent goes deep rather than broad.
- **Capital integration.** Integrate with funding sources — subsidy grants,
  angels, VCs.

## 6. Pricing (as discussed)

- **Free:** basic convergence map, public gallery only, 3 people max, one session
  / one day.
- **Full protocol:** up to 5 people, full 72-hour protocol, full venture output,
  30-day follow-up — ~$250 total (i.e. ~€50–100 per person across 4–5 people,
  framed as a buy-in / "into the kitty"). (Transcript shows "$250k / $400k" — read
  as $250 / $400 given the per-person math.)
- **~€1,000 / quarter:** unlimited sessions, custom (details TBD).
- **Studio model — ~$3,000 / month:** white-labeling to alumni networks etc.,
  with analytics dashboards in the backend.

**Premium idea:** paid access to the agent outside the follow-up windows.

## 7. Business Model / Partnership Notes

- **Buy-in dynamic:** everyone contributes something, so all participants have
  skin in the game.
- **Social-good / "abundance fund" angle:** the collective process could
  contribute to a fund that helps seed ventures that emerge from the system.
- **Deal flow:** potential to sit in deal flow and help funds find ventures.
- **Offboarding partnerships (Ty):** large companies running layoffs have
  programs to help people find new work — potential to partner with those
  agencies.

## 8. Design & Build Principles

- Move away from the prescriptive wizard; lean into **data-dump-to-insight** with
  structured, templated outputs.
- Lean-startup framing worth borrowing (business model canvas, presenting
  information as simply as possible).
- Don't overcomplicate the output or the next steps — those feel especially
  important.
- Build a **clickable prototype**, not a standalone landing page (both find it
  easier to build something clickable).
- This is deliberately **meta**: building the tool will refine Ty and River's own
  venture process.
