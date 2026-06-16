"use client";

import Link from "next/link";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import {
  APPROACH_OPTIONS,
  CHOSEN_ID,
  COHORT,
  INTAKE,
  INTAKE_TOTAL,
  INVITE,
  MARKET_REPORT,
  NETWORK,
  OPP_CRITERIA,
  PHASES,
  PROCESS,
  PRICE,
  REVENUE_MODELS,
  SCORECARD,
  SKILLS,
  SPRINT,
  TAGLINE,
  VALIDATION,
  VENTURES,
  VENTURE_DETAILS,
  YOU,
  makeVentureDraft,
  draftFromVenture,
  memberById,
  mockOpportunityData,
  mockSynthesisData,
  oppBand,
  oppTotal,
  revenueBuild,
  revenueDefaults,
  type ApproachOption,
  type DeckSlide,
  type IconName,
  type IntakeField,
  type IntakeQuestion,
  type IntakeSection,
  type Member,
  type NetworkNode,
  type OppEvaluation,
  type OpportunityData,
  type ScorecardKey,
  type SynthesisData,
  type Venture,
  type LandingCopy,
  type VentureDetail,
  type VentureDraft,
  type Votable,
} from "./data";

// Per-member colour for the radar/network, by position in the cohort. The demo
// cohort (maya, alex, priya) maps to the original emerald/sky/amber.
const PALETTE = ["#10b981", "#0ea5e9", "#f59e0b", "#a855f7"];
const colorFor = (cohort: Member[], id: string) => PALETTE[Math.max(0, cohort.findIndex((m) => m.id === id)) % PALETTE.length];

// Stripe.js loads only when a publishable key is configured (no key → demo and
// the keyless live flow never fetch Stripe).
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

// Inline payment handlers, present only in live mode with Stripe keys set.
export type LivePayment = {
  onCreateCheckout: () => Promise<{ clientSecret: string; sessionId: string }>;
  onConfirmPayment: (sessionId: string) => Promise<boolean>;
};

// Live wiring passed in by the real /s/[token] flow. Absent in the demo.
export type LiveCtx = {
  token: string;
  meId: string;
  accepted: boolean;
  initialAnswers: Record<string, unknown>;
  teamIntakeComplete: boolean;
  status: MemberStatus[];
  synthesis: SynthesisData | null;
  opportunity: OpportunityData | null;
  ventures: Venture[] | null;
  initialDraft: VentureDraft | null;
  windowEndsAt: string;
  isHost: boolean;
  paymentEnabled: boolean;
  payment: LivePayment;
  onAccept: () => Promise<void>;
  onSaveIntake: (answers: Record<string, unknown>, complete: boolean) => Promise<void>;
  onRunSynthesis: (force?: boolean) => Promise<SynthesisData>;
  onConfirmSynthesis: (data: SynthesisData) => Promise<void>;
  onRunOpportunity: () => Promise<OpportunityData>;
  onRunVentureStep: () => Promise<{ stage: string; done: boolean; ventures?: Venture[] }>;
  onSubmitRatings: (ratings: Record<string, number>) => void | Promise<void>;
  onSaveDraft: (draft: VentureDraft) => void | Promise<void>;
};

// A real, pipeline-generated sprint persisted under the demo team — feeds /demo.
export type DemoSeed = { synthesis: SynthesisData | null; opportunity: OpportunityData | null; ventures: Venture[] | null; draft: VentureDraft | null };

// Real members carry no styling; assign avatar ring/dot by position so they line
// up with PALETTE (used by the radar/network).
const RING_CLASSES = [
  { ring: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  { ring: "bg-sky-100 text-sky-700", dot: "bg-sky-500" },
  { ring: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  { ring: "bg-violet-100 text-violet-700", dot: "bg-violet-500" },
];
function liveCohort(status: { id: string; name: string | null; accepted: boolean }[], youId: string): Member[] {
  return status.map((s, i) => {
    const isYou = s.id === youId;
    const name = s.name || (isYou ? "You" : `Teammate ${i + 1}`);
    return {
      id: s.id,
      name,
      initials: name.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase() || (isYou ? "ME" : "T"),
      role: isYou ? "You" : "Teammate",
      brings: "",
      accepted: s.accepted,
      ...RING_CLASSES[i % RING_CLASSES.length],
    };
  });
}

/* ---------------------------------------------------------------- icons */

function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  const D: Record<IconName, string> = {
    people: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2|M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8|M22 21v-2a4 4 0 0 0-3-3.87|M16 3.13A4 4 0 0 1 16 11",
    group: "M17 21v-2a4 4 0 0 0-3-3.87|M7 21v-2a4 4 0 0 1 3-3.87|M12 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6|M5 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5|M19 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5",
    user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2|M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
    bolt: "M13 2 4.5 13.5H11l-1.5 8.5L20 9.5h-6.5L13 2Z",
    alert: "M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z|M12 9v4|M12 17h.01",
    sparkle: "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z",
    link: "M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1|M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1",
    mic: "M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z|M19 10a7 7 0 0 1-14 0|M12 19v3",
    image: "M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z|M8.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3|M21 15l-5-5L5 21",
    doc: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z|M14 2v6h6|M8 13h8|M8 17h6",
    laptop: "M3 5a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v11H3z|M2 20h20|M9 20l.5-2h5l.5 2",
    store: "M3 9l1.5-5h15L21 9|M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9|M3 9h18|M9 20v-6h6v6",
    building: "M3 21h18|M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16|M15 21V9h2a2 2 0 0 1 2 2v10|M8 7h2|M8 11h2",
    target: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18|M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10|M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2",
    check: "M9 11l3 3L22 4|M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
    star: "M12 2l3 6.5 7 .9-5 4.8 1.3 7L12 18l-6.6 3.2L6.7 14l-5-4.8 7-.9z",
    clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18|M12 7v5l3 2",
    calendar: "M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z|M16 2v4|M8 2v4|M3 10h18",
    scale: "M12 3v18|M7 7h10|M3 7l4 10H3zM3 7l4-3 4 3|M21 7l-4 10h4zM21 7l-4-3-4 3",
    chart: "M3 3v18h18|M7 15l3-3 3 2 4-5",
    thumb: "M7 11v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1z|M7 11l4-7a2 2 0 0 1 3 2l-1 5h5a2 2 0 0 1 2 2.3l-1 6A2 2 0 0 1 17 21H7",
    lock: "M5 11h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z|M8 11V7a4 4 0 0 1 8 0v4",
    play: "M8 5v14l11-7z",
    coins: "M2 8c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3z|M2 8v5c0 1.7 3.6 3 8 3s8-1.3 8-3V8",
    message: "M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z",
    minus: "M5 12h14|M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0",
    send: "M22 2 11 13|M22 2l-7 20-4-9-9-4z",
    pause: "M8 5v14|M16 5v14",
    refresh: "M21 12a9 9 0 1 1-3-6.7L21 7|M21 3v4h-4",
    copy: "M9 9h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1z|M5 15a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1",
    shield: "M12 2l8 3v6c0 5-3.5 8-8 11-4.5-3-8-6-8-11V5z",
    heart: "M12 21s-7-4.6-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6C19 16.4 12 21 12 21z",
    comment: "M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z",
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {D[name].split("|").map((seg, i) => <path key={i} d={seg} />)}
    </svg>
  );
}

/* -------------------------------------------------------- primitives */

function Avatar({ m, size = "h-8 w-8 text-xs" }: { m: Member; size?: string }) {
  return <span className={`flex ${size} items-center justify-center rounded-full font-bold ring-2 ring-white ${m.ring}`}>{m.initials}</span>;
}
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-slate-200 bg-white/5 p-4 ${className}`}>{children}</div>;
}
function Chip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{children}</span>;
}
function CheckRow({ label, done = true }: { label: string; done?: boolean }) {
  return (
    <li className="flex items-center gap-2 text-sm">
      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${done ? "bg-orange text-white" : "border border-slate-300 text-transparent"}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3"><path d="m5 12 5 5L20 7" /></svg>
      </span>
      <span className={done ? "text-slate-700" : "text-slate-400"}>{label}</span>
    </li>
  );
}
function Columns({ left, center, right }: { left: React.ReactNode; center: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <aside className="lg:sticky lg:top-[72px] lg:w-72 lg:shrink-0 lg:self-start">{left}</aside>
      <section className="min-w-0 flex-1">{center}</section>
      {right && <aside className="lg:w-80 lg:shrink-0">{right}</aside>}
    </div>
  );
}
function CenterHead({ title, sub, right }: { title: string; sub: string; right?: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div><h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1><p className="mt-1 text-slate-500">{sub}</p></div>
      {right}
    </div>
  );
}
function PrimaryBtn({ label, onClick, icon = "send" }: { label: string; onClick: () => void; icon?: IconName }) {
  return (
    <button onClick={onClick} className="inline-flex h-12 items-center gap-2 rounded-xl bg-orange px-6 text-sm font-bold text-white transition-colors hover:bg-orange-dark">
      {label}<Icon name={icon} className="h-4 w-4" />
    </button>
  );
}
function RailTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{children}</p>;
}
function Bars({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs"><span className="text-slate-500">{label}</span><span className="font-semibold text-orange-dark">{value}/5</span></div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-orange" style={{ width: `${(value / 5) * 100}%` }} /></div>
    </div>
  );
}
function Upsell({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-orange/30 bg-orange-tint/30 p-4">
      <p className="flex items-center gap-2 font-semibold text-foreground"><Icon name="lock" className="h-4 w-4 text-orange" /> {title}</p>
      <p className="mt-1 text-sm text-slate-600">{text}</p>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <a href="/demo" className="inline-flex h-11 items-center gap-2 rounded-xl bg-orange px-5 text-sm font-bold text-white transition-colors hover:bg-orange-dark"><Icon name="bolt" className="h-4 w-4" /> Unlock the Seed protocol</a>
        <a href="/#pricing" className="text-sm font-semibold text-orange-dark hover:underline">See pricing</a>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ the page */

type MemberStatus = { id: string; name: string | null; accepted: boolean; intakeComplete: boolean; ranked?: boolean; rated?: boolean };

export function DemoWorkspace({ plan, live, seed }: { plan: "free" | "full"; live?: LiveCtx; seed?: DemoSeed | null }) {
  const isFree = plan === "free";
  const youId = live ? live.meId : YOU;

  const [phase, setPhase] = useState(0);
  // Demo: assume the full flow already ran — every step unlocked and navigable so
  // you can click around and see it all. Live: gated step by step as before.
  const [accepted, setAccepted] = useState(live ? live.accepted : true);
  const [reached, setReached] = useState(live ? (live.accepted ? 1 : 0) : PHASES.length - 1);
  // Synthesis stays locked until every team member completes Intake (live only).
  const [teamReady, setTeamReady] = useState(live ? live.teamIntakeComplete : true);
  const [waiting, setWaiting] = useState(false); // "waiting for teammates" beat
  const [status, setStatus] = useState<MemberStatus[] | null>(live ? live.status : null);
  const [synthData, setSynthData] = useState<SynthesisData | null>(live ? live.synthesis : (seed?.synthesis ?? null));
  const [oppData, setOppData] = useState<OpportunityData | null>(live ? live.opportunity : (seed?.opportunity ?? null));
  const [ventData, setVentData] = useState<Venture[] | null>(live ? live.ventures : (seed?.ventures ?? null));
  const [ventError, setVentError] = useState(false);
  const [ventStage, setVentStage] = useState("");

  const cohort: Member[] = live ? liveCohort(status ?? live.status, youId) : COHORT;

  const [name, setName] = useState<string>(() => seed?.ventures?.[0]?.name ?? VENTURE_DETAILS.name);
  const [recorded, setRecorded] = useState<Record<string, boolean>>(
    Object.fromEntries(VENTURE_DETAILS.commitments.map((c) => [c.memberId, c.recorded]))
  );
  const [checkin, setCheckin] = useState("Day 7");
  const [venture, setVenture] = useState<VentureDraft>(() => (!live && seed?.draft) ? seed.draft : makeVentureDraft());
  // Publish state lives on the draft so it persists and the public /v page can read it.
  const published = !!venture.published;
  const publicUrl = live ? `flashco.org/v/${live.token}` : "flashco.org/v/demo";

  // Live: poll team status so teammates accepting / finishing on their own
  // devices flow in, and Synthesis unlocks once everyone's intake is in.
  useEffect(() => {
    if (!live) return;
    let active = true;
    const tick = async () => {
      try {
        const r = await fetch(`/s/${live.token}/status`, { cache: "no-store" });
        if (!r.ok) return;
        const j = (await r.json()) as { members: MemberStatus[]; allComplete: boolean };
        if (!active) return;
        setStatus(j.members);
        if (j.allComplete) setTeamReady(true);
      } catch { /* transient */ }
    };
    tick();
    const id = setInterval(tick, 4000);
    return () => { active = false; clearInterval(id); };
  }, [live]);

  // Live: once everyone's in, run (or fetch cached) synthesis.
  useEffect(() => {
    if (!live || !teamReady || synthData) return;
    let active = true;
    live.onRunSynthesis().then((d) => { if (active) setSynthData(d); }).catch(() => {});
    return () => { active = false; };
  }, [live, teamReady, synthData]);

  // Ventures unlock once EVERY accepted member has submitted their synthesis
  // ranking — only then is the team consensus complete enough to generate from.
  const rankedAccepted = (status ?? []).filter((s) => s.accepted);
  const rankingsReady = rankedAccepted.length >= 2 && rankedAccepted.every((s) => s.ranked);
  useEffect(() => {
    if (!live || reached < 3 || oppData || !rankingsReady) return;
    let active = true;
    live.onRunOpportunity().then((d) => { if (active) setOppData(d); }).catch(() => {});
    return () => { active = false; };
  }, [live, reached, oppData, rankingsReady]);

  // Live: once the opportunity is agreed (reached Ventures), build the venture in
  // steps (research -> core -> market & money -> lenses), one server call each,
  // surfacing the current stage. Loops until the venture is assembled.
  const buildVentureLoop = useCallback(async (isActive: () => boolean) => {
    if (!live) return;
    try {
      for (;;) {
        const r = await live.onRunVentureStep();
        if (!isActive()) return;
        if (r.done && r.ventures) { setVentData(r.ventures); return; }
        setVentStage(r.stage);
      }
    } catch { if (isActive()) setVentError(true); }
  }, [live]);

  // The build waits until every accepted member has rated their conviction — the
  // team's consensus winner is what gets built.
  const ratingsReady = rankedAccepted.length >= 2 && rankedAccepted.every((s) => s.rated);
  useEffect(() => {
    if (!live || reached < 4 || ventData || !ratingsReady) return;
    let active = true;
    buildVentureLoop(() => active);
    return () => { active = false; };
  }, [live, reached, ventData, ratingsReady, buildVentureLoop]);

  const retryVentures = () => {
    setVentError(false);
    buildVentureLoop(() => true);
  };

  // Live: seed the editable venture draft from the persisted draft, else from the
  // birthed venture; then persist the team's edits (debounced).
  const seededRef = useRef(false);
  const liveRef = useRef(live);
  liveRef.current = live;
  useEffect(() => {
    if (!live || seededRef.current) return;
    if (live.initialDraft) { setVenture(live.initialDraft); if (ventData?.[0]) setName(ventData[0].name); seededRef.current = true; }
    else if (ventData && ventData[0]) { setVenture(draftFromVenture(ventData[0], cohort)); setName(ventData[0].name); seededRef.current = true; }
  }, [live, ventData, cohort]);
  useEffect(() => {
    if (!liveRef.current || !seededRef.current) return;
    const t = setTimeout(() => { void liveRef.current?.onSaveDraft(venture); }, 1200);
    return () => clearTimeout(t);
  }, [venture]);

  // Gating. Invite (0) is always open. Later steps open once you've accepted AND
  // reached them; Synthesis (2) additionally waits for the whole team's intake;
  // Validation is fully click-through for everyone (the preview is built live from
  // the venture); only the publish / go-live action inside it is gated on free.
  const unlocked = (i: number) =>
    i === 0 || (accepted && i <= reached && (i !== 2 || teamReady));
  const advance = (i: number) => { setReached((r) => Math.max(r, i)); setPhase(i); };

  const accept = async () => {
    if (live) await live.onAccept();
    setAccepted(true);
    setReached((r) => Math.max(r, 1));
  };

  // Called when the user finishes their own intake.
  const submitIntake = async (answers: Record<string, unknown>) => {
    if (live) {
      await live.onSaveIntake(answers, true);
      // the status poll will flip teamReady once everyone is in
    } else {
      setWaiting(true);
      setTimeout(() => { setWaiting(false); setTeamReady(true); }, 2600);
    }
  };

  const synthesisData = useMemo(() => synthData ?? mockSynthesisData(), [synthData]);
  const opportunityData = useMemo(() => oppData ?? mockOpportunityData(), [oppData]);
  const windowExpired = useExpired(live?.windowEndsAt);

  // Host control: once the minimum team has finished but a teammate is lagging,
  // the host can run synthesis without them.
  const acceptedCount = (status ?? []).filter((s) => s.accepted).length;
  const completedCount = (status ?? []).filter((s) => s.intakeComplete).length;
  const canForceSynthesis = !!live?.isHost && !teamReady && completedCount >= 2 && completedCount < acceptedCount;
  const forceSynthesis = async () => {
    if (!live) return;
    try {
      const d = await live.onRunSynthesis(true);
      setSynthData(d);
      setTeamReady(true);
      advance(2);
    } catch { /* the synthesis step surfaces failure */ }
  };

  // The team confirmed/edited Synthesis — persist it (live) then move to Opportunity.
  const confirmSynthesis = async (confirmed: SynthesisData) => {
    if (live) await live.onConfirmSynthesis(confirmed);
    advance(3);
  };

  const inviteMembers: Member[] = cohort.map((m) => (m.id === youId ? { ...m, accepted } : m));
  const othersProgress = (id: string): number =>
    live
      ? (status?.find((s) => s.id === id)?.intakeComplete ? INTAKE_TOTAL : 0)
      : id === "alex" ? INTAKE_TOTAL : id === "priya" ? 19 : 0;

  const inviteUrl = live ? `https://flashco.org/s/${live.token}` : INVITE.url;
  const resumeUrl = live ? `https://flashco.org/s/${live.token}/r/${live.meId}` : undefined;

  const content = (i: number) => {
    switch (i) {
      case 0:
        return <InvitePhase plan={plan} accepted={accepted} onAccept={accept} onStart={() => advance(1)} members={inviteMembers} youId={youId} inviteUrl={inviteUrl} resumeUrl={resumeUrl} payment={live && live.paymentEnabled ? live.payment : undefined} expired={windowExpired} isHost={live ? live.isHost : true} />;
      case 1:
        return <InputPhase onNext={() => advance(2)} onSubmit={submitIntake} initialAnswers={live ? live.initialAnswers : undefined} cohort={cohort} youId={youId} othersProgress={othersProgress} />;
      case 2:
        return <SynthesisPhase onConfirm={confirmSynthesis} cohort={cohort} youId={youId} data={synthesisData} status={live ? status : null} />;
      case 3:
        if (live && !oppData)
          return <GeneratingState title="Finding your ventures" sub={rankingsReady ? "Researching the directions your team ranked highest and shaping them into ventures to choose from." : "Waiting for everyone to lock in their ranking — then Flash builds your venture options from the team's consensus."} progress={!rankingsReady ? rankedAccepted.map((s) => ({ name: s.name ?? "Teammate", done: !!s.ranked })) : undefined} />;
        return <OpportunityPhase onNext={() => advance(4)} data={opportunityData} onSubmitRatings={live ? live.onSubmitRatings : undefined} status={live ? status : null} cohort={cohort} youId={youId} />;
      case 4:
        if (live && !ventData && !ratingsReady)
          return <GeneratingState title="Choosing your venture" sub="Waiting for everyone to rate their conviction — then Flash builds the one the team is most excited to build." progress={rankedAccepted.map((s) => ({ name: s.name ?? "Teammate", done: !!s.rated }))} />;
        return <VenturesPhase plan={plan} live={!!live} ventures={ventData ?? undefined} error={live ? ventError : false} stage={ventStage} onRetry={retryVentures} name={name} onName={setName} venture={venture} onVenture={setVenture} recorded={recorded} onRecord={(id) => setRecorded((r) => ({ ...r, [id]: !r[id] }))} cohort={cohort} onNext={() => advance(5)} />;
      default:
        return <ValidationPhase name={name} venture={venture} onVenture={setVenture} checkin={checkin} onCheckin={setCheckin} published={published} onPublish={(p) => setVenture((vd) => ({ ...vd, published: p, landing: p ? (vd.landing ?? buildLanding(vd, ventData?.[0]?.detail)) : vd.landing }))} gated={isFree} detail={ventData?.[0]?.detail} publicUrl={publicUrl} />;
    }
  };

  const lockReason = (i: number): { reason: string; cta: "invite" | "seed" | null } => {
    const seedLock = isFree && i >= 5;
    if (!accepted) return { reason: "Accept your invite to get started — then the sprint opens up, step by step.", cta: "invite" };
    if (seedLock) return { reason: "Validation is part of the Seed protocol.", cta: "seed" };
    if (i === 2) {
      const inCount = (status ?? []).filter((s) => s.intakeComplete).length;
      const total = cohort.length;
      return {
        reason: live
          ? `Synthesis runs once everyone's input is in — ${inCount} of ${total} in. We'll unlock this automatically.`
          : waiting
            ? "Submitted. Waiting for your teammates to finish their input…"
            : "Synthesis runs once everyone's input is in.",
        cta: null,
      };
    }
    return { reason: `Opens once you've finished ${PHASES[i - 1].label}.`, cta: null };
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-black">
      <div className="pointer-events-none fixed inset-0 z-0 bg-grid" />
      <div className="relative z-10 flex flex-1 flex-col">
      <Header phase={phase} onJump={setPhase} unlocked={unlocked} />
      {windowExpired && (
        <div className="border-b border-amber-200 bg-amber-50 px-5 py-2 text-center text-xs font-semibold text-amber-700">
          Your {SPRINT.windowHours}-hour window has closed. New teammates can no longer join, but you can still review what your team has so far.
        </div>
      )}
      {canForceSynthesis && (
        <div className="flex flex-wrap items-center justify-center gap-3 border-b border-orange/30 bg-orange-tint/30 px-5 py-2.5 text-center text-xs">
          <span className="font-semibold text-orange-dark">{completedCount} of {acceptedCount} have finished their input.</span>
          <button onClick={forceSynthesis} className="inline-flex items-center gap-1.5 rounded-full bg-orange px-3 py-1 text-xs font-bold text-white transition-colors hover:bg-orange-dark">Start synthesis without the rest <Icon name="sparkle" className="h-3.5 w-3.5" /></button>
        </div>
      )}
      <main className="mx-auto w-full max-w-[1500px] flex-1 px-5 py-6">
        {unlocked(phase) ? (
          content(phase)
        ) : (
          <LockedShell i={phase} {...lockReason(phase)} onGoInvite={() => setPhase(0)}>
            {content(phase)}
          </LockedShell>
        )}
      </main>
      </div>
    </div>
  );
}

// Live 48-hour window: true once the deadline has passed. Mounts client-side so
// there's no SSR/now mismatch.
function useExpired(endsAt?: string): boolean {
  const [expired, setExpired] = useState(false);
  useEffect(() => {
    if (!endsAt) return;
    const check = () => setExpired(new Date(endsAt).getTime() <= Date.now());
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, [endsAt]);
  return expired;
}

function Countdown({ endsAt }: { endsAt: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);
  const ms = now === null ? null : new Date(endsAt).getTime() - now;
  const expired = ms !== null && ms <= 0;
  let label = `${SPRINT.windowHours}h window`;
  if (ms !== null && ms > 0) {
    const h = Math.floor(ms / 3_600_000);
    const m = Math.floor((ms % 3_600_000) / 60_000);
    label = h >= 24 ? `${Math.floor(h / 24)}d ${h % 24}h left` : h >= 1 ? `${h}h ${m}m left` : `${Math.max(1, m)}m left`;
  } else if (expired) {
    label = "Window closed";
  }
  return (
    <span className={`hidden items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold sm:flex ${expired ? "bg-amber-100 text-amber-700" : "bg-orange-tint text-orange-dark"}`}>
      <Icon name="clock" className="h-3.5 w-3.5" /> {label}
    </span>
  );
}

// Logo + the whole step flow on one line. Orange = focused; tick = a step
// you've passed; lock = not yet unlocked (live only); grey number = unlocked
// but not opened (the demo, where you can jump around freely).
function Header({ phase, onJump, unlocked }: { phase: number; onJump: (n: number) => void; unlocked: (i: number) => boolean }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-black/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1500px] items-center gap-4 px-5 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-orange"><path d="M13 2 4.5 13.5H11l-1.5 8.5L20 9.5h-6.5L13 2Z" /></svg>
          <span className="text-lg font-bold tracking-tight text-foreground">Flash Company</span>
        </Link>
        <ol className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {PHASES.map((p, i) => {
            const active = i === phase;
            const done = i < phase;
            const locked = !unlocked(i);
            return (
              <li key={p.id} className="flex shrink-0 items-center gap-1">
                <button onClick={() => onJump(i)} className={`flex shrink-0 items-center gap-2 rounded-xl border px-2.5 py-1.5 text-left transition-colors ${active ? "border-orange bg-orange-tint/40" : "border-transparent hover:bg-white/5"}`}>
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${active ? "bg-orange text-white" : "bg-slate-100 text-slate-400"}`}>
                    {active ? i + 1 : done ? <Icon name="check" className="h-3 w-3" /> : locked ? <Icon name="lock" className="h-3 w-3" /> : i + 1}
                  </span>
                  <span className={`hidden whitespace-nowrap text-sm font-semibold sm:block ${active ? "text-orange-dark" : "text-slate-500"}`}>{p.label}</span>
                </button>
                {i < PHASES.length - 1 && <span className="shrink-0 text-slate-600">›</span>}
              </li>
            );
          })}
        </ol>
      </div>
    </header>
  );
}

/* -------------------------------------------------------- 0. Invite */
// The Invite page is the landing page — where you arrive when you sign up.
// Top to bottom: hero, how it works, invite your team, accept (-> payment),
// then who's accepted. Accepting routes through a held payment; once you've
// accepted you can start your input and preview the later (locked) steps.

const HOW_STEPS: { icon: IconName; title: string; text: string }[] = [
  { icon: "group", title: "Bring your worlds together", text: "Invite up to two others. Each of you shares your skills, networks, insights and the problems you can't stop noticing by text or voice." },
  { icon: "sparkle", title: "Flash finds the overlap", text: "Our AI agent maps the connections no single person could see. The rare opportunities that only exist where your strengths, networks, and insight meet." },
  { icon: "target", title: "The venture only you can build", text: "Narrow to the one idea your team is uniquely placed to start, complete with the plan and the assets to share it openly with your network." },
];

function InvitePhase({ plan, accepted, onAccept, onStart, members = COHORT, youId = YOU, inviteUrl = INVITE.url, resumeUrl, payment, expired = false, isHost = false }: { plan: "free" | "full"; accepted: boolean; onAccept: () => void | Promise<void>; onStart: () => void; members?: Member[]; youId?: string; inviteUrl?: string; resumeUrl?: string; payment?: LivePayment; expired?: boolean; isHost?: boolean }) {
  const [payOpen, setPayOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const isFree = plan === "free";
  const handleAccept = () => (isFree ? onAccept() : setPayOpen(true));
  const acceptedCount = members.filter((m) => m.accepted).length;
  const copyLink = () => {
    const full = inviteUrl.startsWith("http") ? inviteUrl : `https://${inviteUrl}`;
    navigator.clipboard.writeText(full).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className="mx-auto max-w-3xl space-y-12 py-4">
      {/* 1 · Accept invite — host kick-off / teammate accept (hidden once you're in) */}
      {!accepted && (
        <section className="rounded-2xl border border-orange bg-white/5 p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground">{isHost ? "You started this Flash" : "Accept your invite"}</p>
              <p className="mt-1 text-sm text-slate-500">{isHost ? `Your ${PRICE.currency}${PRICE.perPerson} buy-in kicks off the ${SPRINT.windowHours}-hour sprint.` : (isFree ? "Free to start — invite up to three and run a single session." : `${PRICE.currency}${PRICE.perPerson} buy-in per person, charged when you accept.`)}</p>
            </div>
            {!isFree && <p className="shrink-0 text-right"><span className="text-3xl font-extrabold text-foreground">{PRICE.currency}{PRICE.perPerson}</span> <span className="text-xs text-slate-400">/ person</span></p>}
          </div>
          <div className="mt-5">
            {expired
              ? <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">This invite has expired — the {SPRINT.windowHours}-hour window has closed.</p>
              : <PrimaryBtn label={isHost ? (isFree ? "Start the sprint" : `Pay ${PRICE.currency}${PRICE.perPerson} & start`) : "Accept invite to get started"} onClick={handleAccept} icon={isFree ? "bolt" : "coins"} />}
          </div>
        </section>
      )}

      {/* 3 · Hero */}
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">Kick-off</p>
        <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl">Ever wonder what you and <span className="text-orange">two</span> <span className="text-orange">friends</span> could start?</h1>
        <p className="mt-5 text-lg leading-relaxed text-slate-600">
          Invite two people to a 48-hour structured ideation process that maps your combined skills, networks, and insights into an idea worth sharing.
        </p>
      </section>

      {/* 4 · How it works */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">How it works</h2>
        <p className="mt-1 text-sm text-slate-500">About 90 minutes of your time each, spread across a 48-hour window.</p>
        <div className="mt-4 grid gap-5 sm:grid-cols-3">
          {HOW_STEPS.map((s) => (
            <div key={s.title}>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-tint text-orange"><Icon name={s.icon} className="h-4 w-4" /></span>
              <p className="mt-3 text-sm font-bold text-foreground">{s.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4b · The process — purpose of each step and how it flows */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">The process</h2>
        <p className="mt-1 text-sm text-slate-500">Six steps over the 48 hours — each one feeds the next.</p>
        <ol className="mt-4 space-y-3">
          {PROCESS.map((s, i) => (
            <li key={s.label} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-tint text-xs font-bold text-orange-dark">{i + 1}</span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground">{s.label}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-slate-500">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* You're in — start your input (shown once accepted), just above Invite your team */}
      {accepted && (
        <section className="rounded-2xl border border-orange bg-white/5 p-6">
          <p className="flex items-center gap-2 text-lg font-bold text-foreground"><Icon name="check" className="h-5 w-5 text-orange" /> You&rsquo;re in.</p>
          <p className="mt-1.5 text-sm text-slate-600">Start your input now — synthesis runs once your whole team&rsquo;s input is in.</p>
          <div className="mt-5"><PrimaryBtn label="Start your input" onClick={onStart} icon="bolt" /></div>
          {resumeUrl && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-white/5 p-3">
              <p className="text-xs font-bold text-foreground">Your resume link</p>
              <p className="mt-0.5 text-xs text-slate-500">Bookmark this to pick up where you left off — on any device.</p>
              <code className="mt-2 block truncate rounded-md bg-slate-50 px-2 py-1.5 text-xs text-slate-600">{resumeUrl}</code>
            </div>
          )}
        </section>
      )}

      {/* Invite your team — share link + 48h accept window */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Invite your team</h2>
        <p className="mt-1 text-sm text-slate-500">Up to three people. Share a link — no app, no account.</p>
        <div className="mt-4 rounded-xl border border-slate-200 p-4">
          <p className="mb-2 text-sm font-bold text-foreground">Shareable link</p>
          <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white/5 text-orange"><Icon name="link" className="h-4 w-4" /></span>
            <code className="min-w-0 flex-1 truncate text-sm text-slate-600">{inviteUrl}</code>
            <button onClick={copyLink} className="inline-flex items-center gap-1.5 rounded-md bg-orange px-3 py-1.5 text-xs font-bold text-white"><Icon name={copied ? "check" : "copy"} className="h-3.5 w-3.5" /> {copied ? "Copied" : "Copy"}</button>
          </div>
          <p className="mt-2 text-xs text-slate-400">{INVITE.note}</p>
        </div>
        <div className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-700">
          <Icon name="clock" className="h-4 w-4" /> <InviteCountdown /> left for invitations to be accepted
        </div>
      </section>

      {/* 5 · Who's accepted */}
      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Who&rsquo;s accepted</h2>
          <span className="text-xs text-slate-400">{acceptedCount} of {members.length} in</span>
        </div>
        <ul className="mt-4 space-y-2.5">
          {members.map((m) => {
            const isYou = m.id === youId;
            const has = m.accepted;
            return (
              <li key={m.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                <Avatar m={m} />
                <div className="min-w-0 flex-1"><p className="font-semibold text-foreground">{m.name} {isYou && <span className="text-xs font-normal text-slate-400">(you)</span>}</p><p className="truncate text-xs text-slate-500">{m.role}{m.brings ? ` · ${m.brings}` : ""}</p></div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${has ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{has ? "Accepted" : "Pending"}</span>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-xs text-slate-400">{INVITE.forms}</p>
      </section>

      {payOpen && <PaymentModal onClose={() => setPayOpen(false)} onPaid={() => { setPayOpen(false); onAccept(); }} payment={payment} />}
    </div>
  );
}

// Accepting routes through payment. The buy-in is charged now — Stripe embedded
// Checkout when keys are set, a no-charge fallback otherwise.
function PaymentModal({ onClose, onPaid, payment }: { onClose: () => void; onPaid: () => void; payment?: LivePayment }) {
  const amount = `${PRICE.currency}${PRICE.perPerson}`;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-slate-100 p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Buy-in</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-foreground">Accept your invite</h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-slate-400 transition-colors hover:text-slate-600">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-5 w-5"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>

        <div className="mt-5 space-y-2 rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between text-sm"><span className="text-slate-500">The buy-in</span><span className="font-bold text-foreground">{amount}</span></div>
          <p className="flex items-start gap-2 border-t border-slate-200 pt-2 text-xs text-slate-500"><Icon name="shield" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange" /> Charged now to lock in your spot on the team.</p>
        </div>

        {payment ? (
          <div className="mt-4">
            <StripeCheckout payment={payment} onPaid={onPaid} />
            <button onClick={onClose} className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50">Cancel</button>
          </div>
        ) : (
          <>
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 p-3">
              <Icon name="coins" className="h-4 w-4 shrink-0 text-slate-400" />
              <span className="text-sm text-slate-400">Card details</span>
              <span className="ml-auto text-xs text-slate-300">•••• 4242</span>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <button onClick={onPaid} className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-orange text-sm font-bold text-white transition-colors hover:bg-orange-dark"><Icon name="check" className="h-4 w-4" /> Pay {amount} &amp; accept</button>
              <button onClick={onClose} className="h-12 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50">Cancel</button>
            </div>
            <p className="mt-3 text-center text-[11px] text-slate-400">Prototype — no real payment is taken.</p>
          </>
        )}
      </div>
    </div>
  );
}

// Inline real payment: Stripe embedded Checkout (charges the buy-in now). On
// completion we server-verify via onConfirmPayment before accepting.
function StripeCheckout({ payment, onPaid }: { payment: LivePayment; onPaid: () => void }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    payment.onCreateCheckout()
      .then((r) => { setClientSecret(r.clientSecret); setSessionId(r.sessionId); })
      .catch(() => setError("Couldn't start the payment — please try again."));
  }, [payment]);
  const complete = async () => {
    if (!sessionId) return;
    const ok = await payment.onConfirmPayment(sessionId);
    if (ok) onPaid();
    else setError("Payment wasn't completed.");
  };
  if (error) return <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</p>;
  if (!stripePromise || !clientSecret) return <p className="rounded-xl border border-slate-200 p-3 text-sm text-slate-500">Loading secure payment…</p>;
  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret, onComplete: complete }}>
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}

// A locked step. Per the product call: show the REAL content, greyed out and
// non-interactive (via `inert`), behind a small non-obscuring banner that says
// why it's locked and how to unlock — so people can click through and see what's
// there without being able to touch it. Used for the pre-accept lock, the
// synthesis "waiting for the team" gate, and the free-plan Seed lock.
function LockedShell({ i, reason, cta, onGoInvite, children }: { i: number; reason: string; cta: "invite" | "seed" | null; onGoInvite: () => void; children: React.ReactNode }) {
  const p = PHASES[i];
  return (
    <div className="mx-auto w-full max-w-[1500px]">
      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-orange/30 bg-orange-tint/20 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-tint text-orange"><Icon name="lock" className="h-4 w-4" /></span>
          <div>
            <p className="text-sm font-bold text-foreground">{p.label} is locked <span className="font-normal text-slate-400">· preview</span></p>
            <p className="mt-0.5 text-sm text-slate-600">{reason}</p>
          </div>
        </div>
        {cta === "invite" ? (
          <button onClick={onGoInvite} className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-orange px-4 text-sm font-bold text-white transition-colors hover:bg-orange-dark"><Icon name="bolt" className="h-4 w-4" /> Accept your invite</button>
        ) : cta === "seed" ? (
          <a href="/demo" className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-orange px-4 text-sm font-bold text-white transition-colors hover:bg-orange-dark"><Icon name="bolt" className="h-4 w-4" /> Unlock the Seed protocol</a>
        ) : null}
      </div>
      <div inert className="select-none opacity-60 grayscale">
        {children}
      </div>
    </div>
  );
}

/* --------------------------------------------------------- 1. Input */
// A pure data dump: six sections of mixed-format questions. Answers live in
// local state and aren't wired anywhere yet.

type MultiVal = { sel: string[]; other: string };
type RankedVal = { ranked: string[]; note: string };

const asStr = (v: unknown) => (typeof v === "string" ? v : "");
function asMulti(v: unknown): MultiVal {
  return v && typeof v === "object" && Array.isArray((v as MultiVal).sel) ? (v as MultiVal) : { sel: [], other: "" };
}
function asRanked(v: unknown): RankedVal {
  return v && typeof v === "object" && "ranked" in v ? (v as RankedVal) : { ranked: [], note: "" };
}
function isVoiceable(f: IntakeField): boolean {
  return (f.kind === "short" || f.kind === "long") && !!f.voice;
}
function isAnswered(v: unknown): boolean {
  if (v == null) return false;
  if (typeof v === "string") return v.trim().length > 0;
  if (typeof v === "number") return v > 0;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "object") return Object.values(v as Record<string, unknown>).some(isAnswered);
  return false;
}

// Flattened question flow with section markers, for the conversational intake.
const INTAKE_FLOW = INTAKE.flatMap((s, si) => s.questions.map((q, qi) => ({ q, si, title: s.title, blurb: s.blurb, first: qi === 0 })));

function InputPhase({ onNext, onSubmit, initialAnswers, cohort = COHORT, youId = YOU, othersProgress }: { onNext: () => void; onSubmit?: (answers: Record<string, unknown>) => void; initialAnswers?: Record<string, unknown>; cohort?: Member[]; youId?: string; othersProgress?: (id: string) => number }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>(initialAnswers ?? {});
  const [voiceMode, setVoiceMode] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const done = step >= INTAKE_FLOW.length;
  // Persist this member's intake (complete) the moment they finish — synthesis
  // unlocks once everyone's is in.
  useEffect(() => {
    if (done && !submitted) { setSubmitted(true); onSubmit?.(answers); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);
  const cur = done ? null : INTAKE_FLOW[step];
  const isVoice = (id: string) => !!voiceMode[id];
  const update = (id: string, value: unknown) => setAnswers((a) => ({ ...a, [id]: value }));
  const answeredIn = (s: IntakeSection) => s.questions.filter((q) => isAnswered(answers[q.id])).length;
  const curSi = cur ? cur.si : INTAKE.length - 1;
  const canSend = !!cur && (isAnswered(answers[cur.q.id]) || cur.q.field.kind === "slider");
  // The 1-6 question-section stepper (mobile only — desktop uses the side nav).
  const stepper = (
    <div className="mb-4 flex items-center lg:hidden">
      {INTAKE.map((s, i) => {
        const complete = answeredIn(s) === s.questions.length && i < curSi;
        const active = i === curSi;
        return (
          <Fragment key={s.id}>
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${active ? "bg-orange text-white" : complete ? "bg-orange/20 text-orange-dark" : "bg-slate-100 text-slate-400"}`}>{complete ? <Icon name="check" className="h-3 w-3" /> : i + 1}</span>
            {i < INTAKE.length - 1 && <span className={`h-px flex-1 ${i < curSi ? "bg-orange/40" : "bg-slate-200"}`} />}
          </Fragment>
        );
      })}
    </div>
  );

  // One question at a time (Typeform-style): the current question fills the card,
  // vertically centred with its input right below — no growing transcript, so the
  // layout doesn't shift as you answer. Progress lives in the rail and stepper.
  const chat = (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-4 flex shrink-0 items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange text-white"><FlashMark className="h-4 w-4" /></span>
          <div><p className="text-sm font-bold text-foreground">Flash</p><p className="text-xs text-slate-400">Tell me about yourself — type, talk, or tap.</p></div>
        </div>
        <span className="rounded-full bg-orange-tint px-3 py-1 text-xs font-semibold text-orange-dark">{Math.min(step + 1, INTAKE_TOTAL)}/{INTAKE_TOTAL}</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex min-h-full flex-col justify-center py-2">
          {done ? (
            <div className="mx-auto max-w-md text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-tint text-orange"><Icon name="check" className="h-6 w-6" /></span>
              <h2 className="mt-4 text-xl font-bold tracking-tight text-foreground">That&rsquo;s everything.</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">Your answers stay private until everyone&rsquo;s input is in and the team synthesis runs.</p>
              <div className="mt-5 flex justify-center"><PrimaryBtn label="Run synthesis" onClick={onNext} icon="sparkle" /></div>
            </div>
          ) : cur ? (
            <div>
              {cur.first
                ? <SectionIntro index={cur.si} title={cur.title} blurb={cur.blurb} />
                : <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Section {cur.si + 1} · {cur.title}</p>}
              <div className={cur.first ? "mt-6" : "mt-3"}>
                <h2 className="text-xl font-bold leading-snug tracking-tight text-foreground sm:text-2xl">{cur.q.q}</h2>
                {cur.q.help && <p className="mt-2 text-sm leading-relaxed text-slate-500">{cur.q.help}</p>}
                <div className="mt-5">
                  <Composer key={cur.q.id} q={cur.q} value={answers[cur.q.id]} onChange={(v) => update(cur.q.id, v)} voice={isVoice(cur.q.id)} onVoice={() => setVoiceMode((m) => ({ ...m, [cur.q.id]: !m[cur.q.id] }))} canSend={canSend} onSend={() => setStep((s) => s + 1)} onBack={step > 0 ? () => setStep((s) => Math.max(0, s - 1)) : undefined} />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );

  // One render for both breakpoints (single chat + dictation engine). Mobile:
  // the center column is a viewport-tall box with the stepper on top.
  return (
    <Columns
      left={<IntakeNav curSi={curSi} answeredIn={answeredIn} cohort={cohort} youId={youId} othersProgress={othersProgress} />}
      center={
        <div className="flex h-[calc(100svh-11rem)] flex-col rounded-2xl border border-orange bg-white/5 p-4 lg:h-[32rem] lg:border-slate-200 lg:p-6">
          {stepper}
          {chat}
        </div>
      }
    />
  );
}

function IntakeNav({ curSi, answeredIn, cohort = COHORT, youId = YOU, othersProgress }: { curSi: number; answeredIn: (s: IntakeSection) => number; cohort?: Member[]; youId?: string; othersProgress?: (id: string) => number }) {
  const youDone = INTAKE.reduce((n, s) => n + answeredIn(s), 0);
  return (
    <div className="hidden space-y-4 lg:block">
      <RailTitle>Your intake</RailTitle>
      <p className="px-1 text-xs text-slate-400">Six sections, conversational. Anonymous until synthesis.</p>
      <div className="space-y-1.5">
        {INTAKE.map((s, i) => {
          const a = answeredIn(s);
          const complete = a === s.questions.length && i < curSi;
          const active = i === curSi;
          return (
            <div key={s.id} className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${active ? "border-orange bg-orange-tint/30" : "border-transparent"}`}>
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${complete ? "bg-orange text-white" : active ? "bg-orange/20 text-orange-dark" : "bg-slate-100 text-slate-400"}`}>{complete ? <Icon name="check" className="h-3 w-3" /> : i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className={`block truncate text-sm font-semibold ${active ? "text-orange-dark" : "text-slate-600"}`}>{s.title}</span>
                <span className="block text-[11px] text-slate-400">{a}/{s.questions.length}</span>
              </span>
            </div>
          );
        })}
      </div>
      <TeamProgress cohort={cohort} youId={youId} total={INTAKE_TOTAL} done={(id) => (id === youId ? youDone : (othersProgress?.(id) ?? 0))} />
    </div>
  );
}

// Illustrative teammate pace for the demo's Team-progress bars (no live signal).
const DEMO_PACE = [1, 1, 0.75, 0.6];
const demoPace = (cohort: Member[], id: string) => DEMO_PACE[Math.max(0, cohort.findIndex((m) => m.id === id))] ?? 0.5;

// Team-progress bars (avatar + name + done/total). Shared across input,
// synthesis and ventures so each step shows where everyone's up to.
function TeamProgress({ cohort = COHORT, youId = YOU, total, done }: { cohort?: Member[]; youId?: string; total: number; done: (id: string) => number }) {
  return (
    <div className="space-y-2.5 rounded-xl border border-slate-200 p-3">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Team progress</p>
      {cohort.map((m) => {
        const d = Math.max(0, Math.min(total, done(m.id)));
        const pct = total > 0 ? Math.round((d / total) * 100) : 0;
        return (
          <div key={m.id} className="flex items-center gap-2.5">
            <Avatar m={m} size="h-7 w-7 text-[10px]" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">{m.name}{m.id === youId && <span className="font-normal text-slate-400"> (you)</span>}</span>
                <span className="tabular-nums text-slate-400">{d}/{total}</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-orange" style={{ width: `${pct}%` }} /></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SectionIntro({ index, title, blurb }: { index: number; title: string; blurb: string }) {
  return (
    <div className="pt-2">
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-slate-200" />
        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">Section {index + 1} · {title}</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>
      <p className="mt-2 text-center text-xs text-slate-400">{blurb}</p>
    </div>
  );
}

// The composer: renders the right input control for the current question.
function Composer({ q, value, onChange, voice, onVoice, canSend, onSend, onBack }: { q: IntakeQuestion; value: unknown; onChange: (v: unknown) => void; voice: boolean; onVoice: () => void; canSend: boolean; onSend: () => void; onBack?: () => void }) {
  const f = q.field;
  const label = canSend ? "Send" : q.optional ? "Skip" : "Send";
  return (
    <div>
      <div className="mb-3">
        {(f.kind === "short" || f.kind === "long") && <TextControl value={asStr(value)} onChange={onChange} max={f.max} placeholder={f.placeholder} multiline={f.kind === "long"} voiceable={false} voice={voice} onVoice={onVoice} onEnter={canSend ? onSend : undefined} />}
        {f.kind === "slider" && <SliderControl value={typeof value === "number" ? value : f.min} onChange={onChange} min={f.min} max={f.max} step={f.step} unit={f.unit} />}
        {f.kind === "location" && <LocationControl value={asStr(value)} onChange={onChange} placeholder={f.placeholder} />}
        {f.kind === "multiSelect" && <MultiSelectControl value={asMulti(value)} onChange={onChange} options={f.options} allowOther={f.allowOther} />}
        {f.kind === "ranked" && <RankedControl value={asRanked(value)} onChange={onChange} options={f.options} />}
      </div>
      <div className="flex items-center justify-between gap-2">
        {onBack ? (
          <button onClick={onBack} aria-label="Previous question" className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-50"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m15 18-6-6 6-6" /></svg> Back</button>
        ) : <span />}
        <button onClick={onSend} disabled={!canSend && !q.optional} className="inline-flex h-11 items-center gap-2 rounded-xl bg-orange px-5 text-sm font-bold text-white transition-colors hover:bg-orange-dark disabled:opacity-40">{label} <Icon name="send" className="h-4 w-4" /></button>
      </div>
    </div>
  );
}

// Minimal shape of the bits of the Web Speech API we use. Not in the TS DOM
// lib across all versions, so we type only what we touch and read it off window.
type SpeechSeg = ArrayLike<{ transcript: string }> & { isFinal: boolean };
type SpeechResultEvent = { resultIndex: number; results: ArrayLike<SpeechSeg> };
type SpeechRec = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: SpeechResultEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error?: string }) => void) | null;
  start: () => void;
  stop: () => void;
};
type SpeechRecCtor = new () => SpeechRec;

function speechCtor(): SpeechRecCtor | null {
  const w = window as unknown as { SpeechRecognition?: SpeechRecCtor; webkitSpeechRecognition?: SpeechRecCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

// True once we've confirmed the browser exposes the Web Speech API. Resolved
// after mount to avoid a hydration mismatch; unsupported browsers fall back to typing.
function useSpeechSupported() {
  const [supported, setSupported] = useState(false);
  useEffect(() => { setSupported(!!speechCtor()); }, []);
  return supported;
}

// Touch / mobile devices: the OS keyboard's built-in dictation (the mic on the
// keyboard) is far more reliable than the in-page Web Speech API there — so we
// point people to it instead of running our own flaky recognition. Resolved
// after mount to avoid a hydration mismatch.
function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => { setCoarse(typeof window !== "undefined" && !!window.matchMedia?.("(pointer: coarse)")?.matches); }, []);
  return coarse;
}

// Live dictation via the browser Web Speech API. Interim + final transcript is
// streamed into `onText`, so a voice answer becomes a normal text answer on the
// same downstream path as typing. `supported` is resolved after mount to avoid a
// hydration mismatch; unsupported browsers (e.g. Firefox) fall back to typing.
function useDictation(onText: (text: string) => void) {
  const supported = useSpeechSupported();
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<SpeechRec | null>(null);
  const baseRef = useRef("");
  const finalRef = useRef("");
  const wantRef = useRef(false);
  const onTextRef = useRef(onText);
  onTextRef.current = onText;
  const beginRef = useRef<(base: string) => void>(() => {});
  const restartsRef = useRef(0);
  const lastStartRef = useRef(0);

  useEffect(() => () => { wantRef.current = false; recRef.current?.stop(); }, []);

  // One recognition session. The Web Speech API ends on silence; while the user
  // still wants to dictate we restart it transparently — folding this session's
  // final text into the base — so it listens continuously through short pauses.
  beginRef.current = (base: string) => {
    const Ctor = speechCtor();
    if (!Ctor) return;
    // Back off if recognition keeps ending the instant it starts (an unstable
    // service) instead of spinning in a tight restart loop.
    const now = Date.now();
    restartsRef.current = now - lastStartRef.current < 1200 ? restartsRef.current + 1 : 0;
    lastStartRef.current = now;
    if (restartsRef.current > 5) { wantRef.current = false; setError("unstable"); setListening(false); return; }

    const rec = new Ctor();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = (typeof navigator !== "undefined" && navigator.language) || "en-US";
    baseRef.current = base.trim() ? base.trimEnd() + " " : "";
    finalRef.current = "";
    rec.onresult = (e) => {
      restartsRef.current = 0; // real input arrived — we're stable
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const seg = e.results[i];
        if (seg.isFinal) finalRef.current += seg[0].transcript;
        else interim += seg[0].transcript;
      }
      onTextRef.current(baseRef.current + finalRef.current + interim);
    };
    rec.onend = () => {
      if (recRef.current !== rec) return; // superseded by a newer session
      if (wantRef.current) beginRef.current(baseRef.current + finalRef.current);
      else setListening(false);
    };
    rec.onerror = (e) => {
      const err = e.error ?? "error";
      if (err === "aborted") return; // from our own stop() — not user-facing
      setError(err);
      // Unrecoverable → end the session; transient (e.g. no-speech) → onend retries.
      if (err === "not-allowed" || err === "service-not-allowed" || err === "audio-capture" || err === "network") {
        wantRef.current = false;
        setListening(false);
      }
    };
    recRef.current = rec;
    setError(null);
    rec.start();
    setListening(true);
  };

  // start(base): begin dictating, appending to `base` (e.g. text you've typed/edited).
  const start = useCallback((base: string) => { wantRef.current = true; beginRef.current(base); }, []);
  // stop(): the user explicitly pauses — no auto-restart until they resume.
  const stop = useCallback(() => { wantRef.current = false; recRef.current?.stop(); setListening(false); }, []);

  return { supported, listening, error, start, stop };
}

function TextControl({ value, onChange, max, placeholder, multiline, voiceable, voice, onVoice, onEnter }: { value: string; onChange: (v: string) => void; max?: number; placeholder?: string; multiline?: boolean; voiceable?: boolean; voice?: boolean; onVoice: () => void; onEnter?: () => void }) {
  const { supported, listening, error, start, stop } = useDictation((t) => onChange(max != null ? t.slice(0, max) : t));
  const coarse = useCoarsePointer();
  // In-page dictation only where the Web Speech API is reliable (desktop Chrome/
  // Edge). On touch devices we point to the keyboard mic instead (see Composer).
  const canVoice = !!voiceable && supported && !coarse;
  const [elapsed, setElapsed] = useState(0);
  const previewRef = useRef<HTMLTextAreaElement>(null);

  // Enter/leave voice mode → start/stop dictation. The current text is captured
  // as the base so dictation appends to anything already typed.
  useEffect(() => {
    if (voice && canVoice) start(value);
    else { stop(); setElapsed(0); }
    // value is captured intentionally only when voice flips on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voice, canVoice, start, stop]);

  // Elapsed timer while recording, with a 2:00 cap.
  useEffect(() => {
    if (!(voice && canVoice && listening)) return;
    if (elapsed >= 120) { stop(); return; }
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [voice, canVoice, listening, elapsed, stop]);

  // While dictating, keep the transcript scrolled to the latest words; when paused
  // we leave the scroll alone so the cursor stays put for editing.
  useEffect(() => { if (listening && previewRef.current) previewRef.current.scrollTop = previewRef.current.scrollHeight; }, [value, listening]);

  if (canVoice && voice) {
    const mm = Math.floor(elapsed / 60);
    const ss = String(elapsed % 60).padStart(2, "0");
    const blocked = error === "not-allowed" || error === "service-not-allowed" || error === "audio-capture";
    const failed = error === "network" || error === "unstable";
    return (
      <div className="rounded-xl border border-orange bg-orange-tint/20 p-3">
        <div className="flex items-center gap-2">
          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange text-white ${listening ? "animate-pulse" : ""}`}><Icon name="mic" className="h-4 w-4" /></span>
          <p className="min-w-0 flex-1 truncate text-xs text-slate-500">
            {blocked
              ? "Microphone blocked — allow it in your browser, or type below."
              : failed
                ? "Voice isn't working here — just type your answer."
                : listening
                  ? `Recording · ${mm}:${ss} / 2:00`
                  : value
                    ? "Paused — edit below, or resume talking."
                    : "Starting… allow microphone access."}
          </p>
          {!blocked && !failed && <button onClick={() => { if (listening) stop(); else { setElapsed(0); start(value); } }} className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-orange-dark transition-colors hover:bg-orange-tint">{listening ? "Pause" : "Resume"}</button>}
          <button onClick={onVoice} className="shrink-0 text-xs font-semibold text-orange-dark hover:underline">Type instead</button>
        </div>
        <textarea
          ref={previewRef}
          value={value}
          onChange={(e) => onChange(max != null ? e.target.value.slice(0, max) : e.target.value)}
          readOnly={listening}
          maxLength={max}
          rows={2}
          placeholder={blocked ? "Type your answer…" : listening ? "Listening… start speaking." : "Type to edit, or resume talking."}
          className="mt-2 max-h-[40vh] min-h-[3rem] w-full resize-none overflow-y-auto rounded-lg border border-orange/40 bg-white/5 p-2.5 text-sm text-foreground [field-sizing:content] focus:border-orange focus:outline-none"
        />
        {max != null && <p className="mt-1 text-right text-[11px] text-slate-400">{value.length}/{max}</p>}
      </div>
    );
  }
  return (
    <div>
      <div>
        {multiline
          ? <textarea autoFocus value={value} onChange={(e) => onChange(e.target.value)} maxLength={max} rows={3} placeholder={placeholder} className="w-full resize-y rounded-xl border border-slate-200 p-3 text-sm text-foreground focus:border-orange focus:outline-none" />
          : <input autoFocus value={value} onChange={(e) => onChange(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onEnter?.(); } }} maxLength={max} placeholder={placeholder} className="w-full rounded-xl border border-slate-200 p-3 text-sm text-foreground focus:border-orange focus:outline-none" />}
      </div>
      {max && <p className="mt-1 text-right text-[11px] text-slate-400">{value.length}/{max}</p>}
    </div>
  );
}

function SliderControl({ value, onChange, min, max, step, unit }: { value: number; onChange: (v: number) => void; min: number; max: number; step: number; unit?: string }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline gap-1.5"><span className="text-2xl font-bold tabular-nums text-foreground">{value}{value === max && "+"}</span>{unit && <span className="text-sm text-slate-500">{unit}</span>}</div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-orange" />
      <div className="mt-1 flex justify-between text-[11px] text-slate-400"><span>{min}</span><span>{max}+</span></div>
    </div>
  );
}

function LocationControl({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-200 p-3 focus-within:border-orange">
      <Icon name="target" className="h-4 w-4 shrink-0 text-slate-400" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="min-w-0 flex-1 text-sm text-foreground focus:outline-none" />
      {value && <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">timezone auto</span>}
    </div>
  );
}

function MultiSelectControl({ value, onChange, options, allowOther }: { value: MultiVal; onChange: (v: MultiVal) => void; options: string[]; allowOther?: boolean }) {
  const toggle = (o: string) => onChange({ ...value, sel: value.sel.includes(o) ? value.sel.filter((x) => x !== o) : [...value.sel, o] });
  const items = allowOther ? [...options, "Other"] : options;
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {items.map((o) => { const on = value.sel.includes(o); return <button key={o} onClick={() => toggle(o)} className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${on ? "border-orange bg-orange text-white" : "border-slate-200 text-slate-600 hover:border-orange/50"}`}>{o}</button>; })}
      </div>
      {allowOther && value.sel.includes("Other") && <input value={value.other} onChange={(e) => onChange({ ...value, other: e.target.value })} placeholder="Tell us more" className="mt-2 w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-orange focus:outline-none" />}
    </div>
  );
}

function RankedControl({ value, onChange, options }: { value: RankedVal; onChange: (v: RankedVal) => void; options: string[] }) {
  const toggle = (o: string) => onChange({ ...value, ranked: value.ranked.includes(o) ? value.ranked.filter((x) => x !== o) : [...value.ranked, o] });
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => { const idx = value.ranked.indexOf(o); const on = idx >= 0; return (
          <button key={o} onClick={() => toggle(o)} className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${on ? "border-orange bg-orange text-white" : "border-slate-200 text-slate-600 hover:border-orange/50"}`}>
            {on && <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/5 text-[10px] text-orange-dark">{idx + 1}</span>}{o}
          </button>
        ); })}
      </div>
      <input value={value.note} onChange={(e) => onChange({ ...value, note: e.target.value })} placeholder="Anything to add" className="mt-2 w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-orange focus:outline-none" />
    </div>
  );
}

/* ----------------------------------------------------- 2. Synthesis */

function SynthesisPhase({ onConfirm, cohort = COHORT, youId = YOU, data, status }: { onConfirm: (data: SynthesisData) => void; cohort?: Member[]; youId?: string; data?: SynthesisData; status?: MemberStatus[] | null }) {
  const d = data ?? mockSynthesisData();
  const [energy, setEnergy] = useState<Record<string, number[]>>(() => Object.fromEntries(cohort.map((m) => [m.id, [...(d.skillEnergy[m.id] ?? SKILLS.map(() => 3))]])));
  const [shown, setShown] = useState<Record<string, boolean>>(() => ({ team: true, ...Object.fromEntries(cohort.map((m) => [m.id, true])) }));
  const [roles, setRoles] = useState(d.roles.map((r) => ({ ...r })));
  const [industries, setIndustries] = useState<NetworkNode[]>(d.network.filter((n) => n.kind === "industry").map((n) => ({ ...n })));
  const [locations, setLocations] = useState<NetworkNode[]>(d.network.filter((n) => n.kind === "location").map((n) => ({ ...n })));
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState<Record<string, boolean>>({ skills: true });
  // Focus starts unranked — each person awards their own 1st/2nd/3rd place.
  const [problems, setProblems] = useState<Votable[]>(d.problems.map((p) => ({ ...p })));
  const [obsessions, setObsessions] = useState<Votable[]>(d.obsessions.map((p) => ({ ...p })));
  const [markets, setMarkets] = useState<Votable[]>(d.markets.map((p) => ({ ...p })));

  const toggleOpen = (k: string) => setOpen((o) => ({ ...o, [k]: !o[k] }));
  // Worked one section at a time: confirming a section collapses it and opens the
  // next (each stays openable to review/change). The Team group flows straight
  // into the Focus rankings, so the whole screen is a single guided sequence.
  const SECTIONS = ["skills", "network", "locations", "problems", "obsessions", "markets"];
  const confirmSection = (k: string) => {
    setConfirmed((c) => ({ ...c, [k]: true }));
    const next = SECTIONS[SECTIONS.indexOf(k) + 1];
    setOpen((o) => ({ ...o, [k]: false, ...(next ? { [next]: true } : {}) }));
  };

  // Left-rail progress: Team (3 sub-steps) then Focus (3 rankings).
  const teamSteps = [confirmed.skills, confirmed.network, confirmed.locations];
  const focusSteps = [confirmed.problems, confirmed.obsessions, confirmed.markets];
  const teamDone = teamSteps.filter(Boolean).length;
  const focusDone = focusSteps.filter(Boolean).length;
  const allConfirmed = teamDone === teamSteps.length && focusDone === focusSteps.length;

  // Each person's progress through the synthesis sections — real for you, live
  // status (or an illustrative demo pace) for teammates.
  const SYNTH_TOTAL = SECTIONS.length;
  const youSynthDone = SECTIONS.filter((k) => confirmed[k]).length;
  const synthDone = (id: string) => {
    if (id === youId) return youSynthDone;
    const st = status?.find((s) => s.id === id);
    if (st) return st.ranked ? SYNTH_TOTAL : st.intakeComplete ? Math.round(SYNTH_TOTAL * 0.55) : 0;
    return Math.round(demoPace(cohort, id) * SYNTH_TOTAL);
  };

  const handleConfirm = () => onConfirm({
    convergence: d.convergence,
    skillEnergy: energy,
    network: [...industries, ...locations],
    roles,
    problems,
    obsessions,
    markets,
  });

  return (
    <Columns
      left={
        <div className="space-y-4">
          <RailTitle>Steps</RailTitle>
          {[
            { t: "Review input", d: "All three intakes read.", done: true, count: null as string | null },
            { t: "Team", d: "Confirm skills, network, locations.", done: teamDone === teamSteps.length, count: `${teamDone}/${teamSteps.length}` },
            { t: "Focus", d: "Rank the problems, insights & markets.", done: focusDone === focusSteps.length, count: `${focusDone}/${focusSteps.length}` },
          ].map((s) => (
            <Card key={s.t}>
              <div className="flex items-center gap-3">
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${s.done ? "bg-orange text-white" : "bg-slate-100 text-slate-400"}`}>{s.done ? <Icon name="check" className="h-3 w-3" /> : ""}</span>
                <div className="min-w-0 flex-1"><p className="text-sm font-bold text-foreground">{s.t}</p><p className="text-xs text-slate-500">{s.d}</p></div>
                {s.count && <span className={`shrink-0 text-xs font-semibold ${s.done ? "text-orange-dark" : "text-slate-400"}`}>{s.count}</span>}
              </div>
            </Card>
          ))}
          <TeamProgress cohort={cohort} youId={youId} total={SYNTH_TOTAL} done={synthDone} />
        </div>
      }
      center={
        <div className="space-y-5">
          <Card className="p-5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Synthesis</h1>
            <p className="mt-1 text-slate-500">The agent read all three intakes. Confirm who you are, then narrow to a focus.</p>
          </Card>

          <Part label="Team" hint="Confirm your profile — add, edit, confirm. Nothing's removed here.">
            <div className="space-y-3">
              <ConfirmItem title="Skills" hint="Tap a dot to set how strong each skill is." open={open.skills} onToggle={() => toggleOpen("skills")} confirmed={confirmed.skills} onConfirm={() => confirmSection("skills")}>
                <SkillBloom cohort={cohort} youId={youId} energy={energy} shown={shown} onToggle={(k) => setShown((s) => ({ ...s, [k]: !s[k] }))} onEnergy={(i, val) => setEnergy((e) => ({ ...e, [youId]: (e[youId] ?? SKILLS.map(() => 0)).map((x, idx) => (idx === i ? val : x)) }))} />
              </ConfirmItem>
              <ConfirmItem title="Network" hint="Industries you can talk to." open={open.network} onToggle={() => toggleOpen("network")} confirmed={confirmed.network} onConfirm={() => confirmSection("network")}>
                <NetworkList cohort={cohort} nodes={industries} onNodes={setIndustries} kind="industry" icon="building" addLabel="industry" />
              </ConfirmItem>
              <ConfirmItem title="Locations" hint="Where you can reach and meet." open={open.locations} onToggle={() => toggleOpen("locations")} confirmed={confirmed.locations} onConfirm={() => confirmSection("locations")}>
                <NetworkList cohort={cohort} nodes={locations} onNodes={setLocations} kind="location" icon="target" addLabel="location" />
              </ConfirmItem>
            </div>
          </Part>

          <Part label="Focus" hint="Rank what matters most — your order, and your teammates', sets the team's focus.">
            <div className="space-y-3">
              <ConfirmItem title="Lived problems" hint="Tap to award 1st, 2nd, 3rd place." open={open.problems} onToggle={() => toggleOpen("problems")} confirmed={confirmed.problems} onConfirm={() => confirmSection("problems")}>
                <RankList items={problems} onItems={setProblems} addLabel="problem" />
              </ConfirmItem>
              <ConfirmItem title="Insights" hint="Tap to award 1st, 2nd, 3rd place." open={open.obsessions} onToggle={() => toggleOpen("obsessions")} confirmed={confirmed.obsessions} onConfirm={() => confirmSection("obsessions")}>
                <RankList items={obsessions} onItems={setObsessions} addLabel="insight" />
              </ConfirmItem>
              <ConfirmItem title="Potential target markets" hint="Tap to award 1st, 2nd, 3rd place." open={open.markets} onToggle={() => toggleOpen("markets")} confirmed={confirmed.markets} onConfirm={() => confirmSection("markets")}>
                <RankList items={markets} onItems={setMarkets} addLabel="market" />
              </ConfirmItem>
            </div>
          </Part>

          <div className="flex flex-col items-end gap-2">
            {!allConfirmed && <p className="text-xs text-slate-400">Confirm each section above to continue.</p>}
            {allConfirmed
              ? <PrimaryBtn label="Confirm Synthesis" onClick={handleConfirm} icon="sparkle" />
              : <span className="inline-flex h-12 items-center gap-2 rounded-xl bg-orange/40 px-6 text-sm font-bold text-white">Confirm Synthesis</span>}
          </div>
        </div>
      }
    />
  );
}

// A confirmable, collapsible Team item: add / edit / confirm. No delete or veto.
function ConfirmItem({ title, hint, open, onToggle, confirmed, onConfirm, children }: { title: string; hint?: string; open: boolean; onToggle: () => void; confirmed?: boolean; onConfirm?: () => void; children: React.ReactNode }) {
  // The open, not-yet-confirmed section is "the action to take" — orange outline.
  const active = open && !confirmed;
  return (
    <div className={`overflow-hidden rounded-xl border bg-white/5 transition-colors ${active ? "border-orange ring-1 ring-orange/30" : "border-slate-200"}`}>
      <button onClick={onToggle} className="flex w-full items-center gap-2.5 p-3 text-left">
        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${confirmed ? "bg-orange text-white" : "bg-slate-100 text-slate-400"}`}>{confirmed ? <Icon name="check" className="h-3 w-3" /> : <Icon name="user" className="h-3 w-3" />}</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold text-foreground">{title}</span>
          {hint && <span className="block truncate text-xs text-slate-400">{hint}</span>}
        </span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={`h-4 w-4 shrink-0 text-slate-300 transition-transform ${open ? "rotate-180" : ""}`}><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {open && (
        <div className="border-t border-slate-100 p-4">
          {children}
          {onConfirm && (
            <div className="mt-4 flex justify-end">
              <button onClick={onConfirm} className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-6 py-3 text-sm font-bold transition-colors ${confirmed ? "bg-orange/20 text-orange-dark" : "bg-orange text-white hover:opacity-90"}`}><Icon name={confirmed ? "check" : "thumb"} className="h-4 w-4" />{confirmed ? "Confirmed" : "Confirm"}</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Editable network nodes (industries or locations). Add / edit only — no delete.
function NetworkList({ cohort = COHORT, nodes, onNodes, kind, icon, addLabel }: { cohort?: Member[]; nodes: NetworkNode[]; onNodes: (n: NetworkNode[]) => void; kind: NetworkNode["kind"]; icon: IconName; addLabel: string }) {
  const setNode = (idx: number, patch: Partial<NetworkNode>) => onNodes(nodes.map((n, i) => (i === idx ? { ...n, ...patch } : n)));
  return (
    <div className="space-y-2">
      {nodes.map((node, idx) => (
        <div key={idx} className="rounded-xl border border-slate-200 p-3">
          <div className="flex items-start gap-2">
            <Icon name={icon} className="mt-1.5 h-4 w-4 shrink-0 text-orange" />
            <EditableArea value={node.name} onChange={(v) => setNode(idx, { name: v })} rows={1} placeholder={`Add ${addLabel}…`} className="min-w-0 flex-1 text-sm font-semibold text-foreground [field-sizing:content]" />
            {node.members.length > 0 && <div className="mt-1 flex shrink-0 -space-x-1.5">{node.members.map((id) => { const m = cohort.find((x) => x.id === id); return m ? <Avatar key={id} m={m} size="h-6 w-6 text-[9px]" /> : null; })}</div>}
          </div>
          <EditableArea value={node.opportunity} onChange={(v) => setNode(idx, { opportunity: v })} rows={2} placeholder="What's the opportunity here?" className="mt-1.5 text-sm text-slate-600 [field-sizing:content]" />
        </div>
      ))}
      <button onClick={() => onNodes([...nodes, { name: "", kind, members: [], opportunity: "" }])} className="text-sm font-semibold text-orange-dark hover:underline">+ Add {addLabel}</button>
    </div>
  );
}

// Self-contained 48-hour accept-window countdown (prototype display).
function InviteCountdown() {
  const [s, setS] = useState(48 * 3600);
  useEffect(() => {
    const id = setInterval(() => setS((x) => (x > 0 ? x - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const p = (n: number) => String(n).padStart(2, "0");
  return <span className="tabular-nums">{p(Math.floor(s / 3600))}:{p(Math.floor((s % 3600) / 60))}:{p(s % 60)}</span>;
}

const TEAM_COLOR = "#6f8f5f";

function SkillBloom({ cohort = COHORT, youId = YOU, energy, shown, onToggle, onEnergy }: { cohort?: Member[]; youId?: string; energy: Record<string, number[]>; shown: Record<string, boolean>; onToggle: (k: string) => void; onEnergy: (i: number, val: number) => void }) {
  const cx = 130, cy = 130, R0 = 64, Lmax = 60, max = 5, DENS = 9;
  const skills = SKILLS.length;
  const smooth = (t: number) => t * t * (3 - 2 * t);
  const polar = (r: number, a: number): [number, number] => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  // Everyone shares ONE circle: the 8 skills sit at fixed positions around it, so
  // a given skill is the same angle for all. Team (best of everyone per skill) +
  // each shown member, overlaid — equal values read as the same wave in each colour.
  const bands = [
    ...(shown.team ? [{ id: "team", color: TEAM_COLOR, vals: SKILLS.map((_, i) => Math.max(0, ...cohort.map((m) => energy[m.id]?.[i] ?? 0))) }] : []),
    ...cohort.filter((m) => shown[m.id]).map((m) => ({ id: m.id, color: colorFor(cohort, m.id), vals: energy[m.id] ?? SKILLS.map(() => 0) })),
  ];
  const N = Math.max(1, bands.length);
  const samples = skills * DENS;          // dense samples around the full circle
  const slot = (Math.PI * 2) / samples;   // angular width of one sample
  const angleAt = (s: number) => -Math.PI / 2 + (s / samples) * Math.PI * 2;
  // A person's interpolated value at sample s (skills wrap around the ring).
  const valueAt = (vals: number[], s: number) => {
    const t = s / DENS, i = Math.floor(t) % skills, f = t - Math.floor(t);
    return vals[i] + (vals[(i + 1) % skills] - vals[i]) * smooth(f);
  };
  const toggles = [{ id: "team", name: "Team", color: TEAM_COLOR }, ...cohort.map((m) => ({ id: m.id, name: m.name, color: colorFor(cohort, m.id) }))];
  const editEnergy = energy[youId] ?? SKILLS.map(() => 3);
  return (
    <div className="grid items-start gap-4 lg:grid-cols-2">
      <svg viewBox="0 0 260 260" className="mx-auto w-full max-w-[340px] lg:max-w-none">
        <defs>
          {bands.map((b) => (
            <radialGradient key={b.id} id={`bloom-${b.id}`} gradientUnits="userSpaceOnUse" cx={cx} cy={cy} r={R0 + Lmax}>
              <stop offset={R0 / (R0 + Lmax)} stopColor={b.color} stopOpacity="0.28" />
              <stop offset="1" stopColor={b.color} stopOpacity="1" />
            </radialGradient>
          ))}
        </defs>
        <circle cx={cx} cy={cy} r={R0} fill="none" stroke="#e2e8f0" strokeWidth="1" />
        {Array.from({ length: samples }).flatMap((_, s) =>
          bands.map((b, k) => {
            const a = angleAt(s) + ((k + 0.5) / N - 0.5) * slot; // interleave the people within each sample slot
            const v = valueAt(b.vals, s);
            const [x1, y1] = polar(R0, a), [x2, y2] = polar(R0 + Math.max(2, (v / max) * Lmax), a);
            return <line key={`${b.id}-${s}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={`url(#bloom-${b.id})`} strokeWidth="1.2" strokeLinecap="round" />;
          }),
        )}
        {SKILLS.map((label, i) => {
          const a = -Math.PI / 2 + (i / skills) * Math.PI * 2;
          const [lx, ly] = polar(R0 - 10, a);
          let deg = (a * 180) / Math.PI + 90;
          if (a > 0 && a < Math.PI) deg += 180; // keep bottom-half labels upright
          return <text key={i} x={lx} y={ly} fontSize="7" fontWeight="500" fill="#9aa2b1" textAnchor="middle" dominantBaseline="middle" transform={`rotate(${deg} ${lx} ${ly})`}>{label}</text>;
        })}
      </svg>
      <div>
        <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">Show</p>
        <div className="flex flex-wrap gap-1.5">
          {toggles.map((o) => {
            const on = shown[o.id];
            return (
              <button key={o.id} onClick={() => onToggle(o.id)} className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors ${on ? "text-white" : "border-slate-200 text-slate-600 hover:border-slate-300"}`} style={on ? { backgroundColor: o.color, borderColor: o.color } : undefined}>
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: on ? "rgba(255,255,255,0.9)" : o.color }} />{o.name}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[11px] text-slate-400">Each band is a person&rsquo;s skill bloom — longer spoke = stronger in that skill. Team is the best of everyone. You can only edit your own.</p>

        <div className="mt-4 rounded-xl border border-orange/30 bg-orange-tint/15 p-3">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-orange-dark">
            <Icon name="bolt" className="h-3.5 w-3.5" /> Adjust your skills
            <span className="ml-auto rounded-full bg-orange-tint px-2 py-0.5 text-[10px] font-semibold normal-case tracking-normal text-orange-dark">Editable</span>
          </p>
          <p className="mt-1 text-[11px] text-slate-500">Tap the dots to set how strong each of your skills is, 0–5.</p>
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5">
            {SKILLS.map((label, i) => <DotScore key={label} tone="grey" label={label} value={editEnergy[i] ?? 0} onChange={(val) => onEnergy(i, val)} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function RolesTasks({ cohort = COHORT, youId = YOU, roles, onRoles, confirmed, onConfirm }: { cohort?: Member[]; youId?: string; roles: SynthesisData["roles"]; onRoles: (r: SynthesisData["roles"]) => void; confirmed: Record<string, boolean>; onConfirm: (id: string) => void }) {
  const setRole = (id: string, patch: Partial<SynthesisData["roles"][number]>) => onRoles(roles.map((r) => (r.memberId === id ? { ...r, ...patch } : r)));
  return (
    <div className="space-y-2">
      {roles.map((r) => {
        const m = cohort.find((x) => x.id === r.memberId);
        if (!m) return null;
        const ok = confirmed[r.memberId];
        const isYou = r.memberId === youId;
        return (
          <div key={r.memberId} className="rounded-xl border border-slate-200 p-3">
            <div className="flex items-start gap-2">
              <Avatar m={m} size="h-8 w-8 text-[10px]" />
              <EditableArea value={r.role} onChange={(v) => setRole(r.memberId, { role: v })} rows={1} className="min-w-0 flex-1 text-sm font-semibold text-foreground [field-sizing:content]" />
            </div>
            <EditableArea value={r.tasks} onChange={(v) => setRole(r.memberId, { tasks: v })} rows={2} className="mt-1.5 text-xs text-slate-600 [field-sizing:content]" />
            {isYou && (
              <div className="mt-2 flex justify-end">
                <button onClick={() => onConfirm(r.memberId)} className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-6 py-3 text-sm font-bold transition-colors ${ok ? "bg-orange/20 text-orange-dark" : "bg-orange text-white hover:opacity-90"}`}><Icon name={ok ? "check" : "thumb"} className="h-4 w-4" />{ok ? "Confirmed" : "Confirm"}</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Rank the items — most important at the top. The order IS this member's
// ranking; it's saved with the synthesis and aggregated across the team into the
// consensus that drives venture generation. Tap to award 1st/2nd/3rd place;
// the array stays ordered (awarded first) so downstream reads the ranking from
// the order. Tap an awarded item again to clear it.
const RANK_PLACES = 3;
function RankList({ items, onItems, addLabel }: { items: Votable[]; onItems: (v: Votable[]) => void; addLabel: string }) {
  const setText = (id: string, text: string) => onItems(items.map((i) => (i.id === id ? { ...i, text } : i)));
  const awardedCount = items.filter((x) => x.rank != null).length;
  const award = (id: string) => {
    const awarded = items.filter((x) => x.rank != null).sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
    const target = items.find((x) => x.id === id);
    if (!target) return;
    let next;
    if (target.rank != null) next = awarded.filter((x) => x.id !== id);
    else if (awarded.length >= RANK_PLACES) return;
    else next = [...awarded, target];
    const rankOf = new Map(next.map((x, idx) => [x.id, idx + 1]));
    const rest = items.filter((x) => !rankOf.has(x.id));
    onItems([
      ...next.map((x) => ({ ...x, rank: rankOf.get(x.id) })),
      ...rest.map((x) => ({ ...x, rank: undefined })),
    ]);
  };
  return (
    <div>
      <p className="-mt-1 mb-2 text-xs text-slate-400">Tap to award 1st, 2nd and 3rd place — tap a place again to clear it. Your top three (and your teammates&rsquo;) decide the focus.</p>
      <ol className="space-y-2">
        {items.map((item) => {
          const ranked = item.rank != null;
          const full = awardedCount >= RANK_PLACES;
          return (
            <li key={item.id} className={`flex items-center gap-2.5 rounded-xl border p-2.5 transition-colors ${ranked ? "border-orange/50 bg-orange-tint/10" : "border-slate-200"}`}>
              <button
                type="button"
                onClick={() => award(item.id)}
                disabled={!ranked && full}
                aria-label={ranked ? `Clear place ${item.rank}` : "Award next place"}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${ranked ? "bg-orange text-white hover:opacity-90" : full ? "border border-slate-200 text-slate-300" : "border border-dashed border-slate-300 text-slate-400 hover:border-orange hover:text-orange"}`}
              >
                {ranked ? item.rank : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M12 5v14M5 12h14" /></svg>}
              </button>
              <input value={item.text} onChange={(e) => setText(item.id, e.target.value)} placeholder={`A ${addLabel}…`} className="min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-1.5 py-1 text-sm text-foreground hover:border-slate-200 focus:border-orange focus:bg-white/5 focus:outline-none" />
            </li>
          );
        })}
      </ol>
    </div>
  );
}


/* ------------------------------------------- 2b. Opportunity (spaces → research → birth) */

function OpportunityPhase({ onNext, data, onSubmitRatings, status, cohort = COHORT, youId = YOU }: { onNext: () => void; data?: OpportunityData; onSubmitRatings?: (ratings: Record<string, number>) => void; status?: MemberStatus[] | null; cohort?: Member[]; youId?: string }) {
  const od = data ?? mockOpportunityData();
  // Order anchors to the agent's ranking by total score; the loud CTA is the top.
  const ranked = [...od.spaces].sort((a, b) => oppTotal(b.evaluation) - oppTotal(a.evaluation));
  const topId = ranked[0]?.id;
  // Editable evaluations (hybrid nudge) + your excitement (the one decision).
  const [evals, setEvals] = useState<Record<string, OppEvaluation>>(() => Object.fromEntries(od.spaces.map((s) => [s.id, { ...s.evaluation }])));
  const [conviction, setConviction] = useState<Record<string, number>>({});
  const [adjusting, setAdjusting] = useState<Record<string, boolean>>({});
  const [openOverview, setOpenOverview] = useState<Record<string, boolean>>({});
  const setC = (id: string, n: number) => setConviction((c) => ({ ...c, [id]: n }));
  const setScore = (id: string, key: keyof OppEvaluation, val: number) => setEvals((e) => ({ ...e, [id]: { ...e[id], [key]: { ...e[id][key], score: val } } }));
  const allRated = od.spaces.length > 0 && od.spaces.every((s) => (conviction[s.id] ?? 0) > 0);
  const pick = [...od.spaces].sort((a, b) => (conviction[b.id] ?? 0) - (conviction[a.id] ?? 0))[0];
  const pickTitle = pick && (conviction[pick.id] ?? 0) > 0 ? pick.title : "—";
  const submit = () => { onSubmitRatings?.(conviction); onNext(); };
  // Each person's excitement-rating progress over the opportunities.
  const OPP_TOTAL = od.spaces.length;
  const oppDone = (id: string) => {
    if (id === youId) return od.spaces.filter((s) => (conviction[s.id] ?? 0) > 0).length;
    const st = status?.find((s) => s.id === id);
    if (st) return st.rated ? OPP_TOTAL : 0;
    return Math.round(demoPace(cohort, id) * OPP_TOTAL);
  };
  const bandClass = (b: string) => (b === "Strong" ? "bg-orange-tint text-orange-dark" : b === "Promising" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500");
  return (
    <Columns
      left={
        <div className="space-y-4">
          <RailTitle>Stages</RailTitle>
          {[
            { t: "Scored opportunities", d: "Distinct, scored and ranked from your consensus.", n: "1" },
            { t: "Rate excitement", d: "How excited you'd be to build each — 1 to 10.", n: "2" },
          ].map((s) => (
            <Card key={s.t}><div className="flex items-center gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-tint text-xs font-bold text-orange-dark">{s.n}</span><div><p className="text-sm font-bold text-foreground">{s.t}</p><p className="text-xs text-slate-500">{s.d}</p></div></div></Card>
          ))}
          <Card className="bg-orange-tint/20"><p className="text-sm text-slate-600"><span className="font-semibold text-foreground">Decided by the team.</span> The score ranks them; each of you rates how excited you&rsquo;d be to build — the team&rsquo;s excitement narrows to one.</p></Card>
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white/5 p-5">
            <RailTitle>Your top pick</RailTitle>
            <div className="rounded-xl border border-orange/30 bg-orange-tint/20 p-3"><p className="text-sm font-semibold text-foreground">{pickTitle}</p>{pick && pickTitle !== "—" && <p className="mt-1 text-xs text-slate-500">{pick.customer}</p>}</div>
            <p className="text-xs text-slate-400">The venture the team is most excited to build is the one Flash builds.</p>
          </div>
          <TeamProgress cohort={cohort} youId={youId} total={OPP_TOTAL} done={oppDone} />
        </div>
      }
      center={
        <div className="space-y-5">
          <Card className="p-5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Opportunities</h1>
            <p className="mt-1 text-slate-500">Distinct opportunities you could build, scored and ranked. The one input you give is how excited you&rsquo;d be to build each — the team&rsquo;s excitement narrows to one.</p>
          </Card>

          <div className="space-y-3">
            {ranked.map((s, i) => {
              const ev = evals[s.id] ?? s.evaluation;
              const total = oppTotal(ev);
              const band = oppBand(total);
              const isTop = s.id === topId;
              const adj = !!adjusting[s.id];
              const ov = !!openOverview[s.id];
              return (
                <div key={s.id} className={`rounded-2xl border p-4 transition-colors ${isTop ? "border-orange ring-1 ring-orange/30" : "border-slate-200"}`}>
                  <div className="flex items-start gap-3">
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${isTop ? "bg-orange text-white" : "bg-slate-100 text-slate-500"}`}>{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-lg font-bold tracking-tight text-foreground">{s.title}</p>
                        {isTop && <span className="shrink-0 rounded-full bg-orange-tint px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-dark">Top ranked</span>}
                      </div>
                      <p className="mt-0.5 text-sm text-slate-600">{s.hook}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-2xl font-extrabold tabular-nums leading-none text-foreground">{total.toFixed(1)}<span className="text-sm font-bold text-slate-400">/10</span></p>
                      <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${bandClass(band)}`}>{band}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Evaluation</p>
                      <button onClick={() => setAdjusting((a) => ({ ...a, [s.id]: !a[s.id] }))} className="text-xs font-semibold text-orange-dark hover:underline">{adj ? "Done" : "Adjust scores"}</button>
                    </div>
                    <div className="mt-2 space-y-2.5">
                      {OPP_CRITERIA.map((c) => {
                        const sc = ev[c.key];
                        return (
                          <div key={c.key}>
                            <div className="flex items-center justify-between gap-2 text-xs">
                              <span className="font-semibold text-slate-500">{c.label} <span className="font-normal text-slate-400">{Math.round(c.weight * 100)}%</span></span>
                              {adj
                                ? <ScoreStepper score={sc.score} onChange={(v) => setScore(s.id, c.key, v)} />
                                : <span className="font-bold tabular-nums text-foreground">{sc.score}/10</span>}
                            </div>
                            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-orange" style={{ width: `${sc.score * 10}%` }} /></div>
                            <p className="mt-0.5 text-[11px] text-slate-400">{sc.note}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button onClick={() => setOpenOverview((o) => ({ ...o, [s.id]: !o[s.id] }))} className="mt-3 flex w-full items-center gap-1.5 border-t border-slate-100 pt-3 text-xs font-semibold text-slate-500 hover:text-orange">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={`h-3.5 w-3.5 transition-transform ${ov ? "rotate-180" : ""}`}><path d="m6 9 6 6 6-6" /></svg>
                    Overview — problem, solution &amp; market
                  </button>
                  {ov && (
                    <dl className="mt-2 space-y-2 text-xs">
                      <div><dt className="font-semibold uppercase tracking-wide text-slate-400">Problem</dt><dd className="mt-0.5 text-slate-600">{s.problem}</dd></div>
                      <div><dt className="font-semibold uppercase tracking-wide text-slate-400">Solution</dt><dd className="mt-0.5 text-slate-600">{s.solution}</dd></div>
                      <div><dt className="font-semibold uppercase tracking-wide text-slate-400">Market</dt><dd className="mt-0.5 text-slate-600">{s.market}</dd></div>
                    </dl>
                  )}

                  <div className="mt-3 border-t border-slate-100 pt-3"><ConvictionScale value={conviction[s.id] ?? 0} onChange={(n) => setC(s.id, n)} /></div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col items-start gap-3 rounded-2xl border border-orange/40 bg-orange-tint/20 p-5 sm:flex-row sm:items-center">
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">Submit your excitement</p>
              <p className="mt-0.5 text-xs text-slate-500">Rate how excited you&rsquo;d be to build each. The team&rsquo;s combined excitement narrows to one venture{pickTitle !== "—" ? ` — your top pick is ${pickTitle}` : ""}.</p>
            </div>
            {allRated
              ? <PrimaryBtn label="Submit my ratings" onClick={submit} icon="sparkle" />
              : <span className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-orange/40 px-5 text-sm font-bold text-white">Rate every opportunity to continue</span>}
          </div>
        </div>
      }
    />
  );
}

// 0-10 score nudge (the hybrid adjust on each evaluation criterion).
function ScoreStepper({ score, onChange }: { score: number; onChange: (v: number) => void }) {
  const btn = "flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:border-orange hover:text-orange";
  return (
    <span className="inline-flex items-center gap-1.5">
      <button type="button" aria-label="Lower" onClick={() => onChange(Math.max(0, score - 1))} className={btn}>&minus;</button>
      <span className="w-10 text-center text-xs font-bold tabular-nums text-foreground">{score}/10</span>
      <button type="button" aria-label="Raise" onClick={() => onChange(Math.min(10, score + 1))} className={btn}>+</button>
    </span>
  );
}

// Conviction 1-10, no neutral middle: 1-5 leans "meh" (amber), 6-10 leans "yes"
// (orange) — you're on one side or the other.
function ConvictionScale({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">How excited to build this?</span>
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button key={n} type="button" onClick={() => onChange(n)} aria-label={`Conviction ${n} of 10`}
            className={`h-7 w-6 rounded-sm text-[10px] font-bold transition-colors ${value >= n ? (n >= 6 ? "bg-orange text-white" : "bg-amber-300 text-amber-900") : "bg-slate-100 text-slate-300 hover:bg-slate-200"}`}>
            {n}
          </button>
        ))}
      </div>
      <span className="text-xs font-bold text-foreground">{value ? `${value}/10` : "rate"}</span>
    </div>
  );
}

/* ------------------------------------------------------ 3. Ventures */

// Shown while a live LLM step (synthesis / opportunity / ventures) is generating.
function GeneratingState({ title, sub, progress }: { title: string; sub: string; progress?: { name: string; done: boolean }[] }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center py-20 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-tint text-orange"><Icon name="sparkle" className="h-6 w-6 animate-pulse" /></span>
      <h2 className="mt-5 text-xl font-bold tracking-tight text-foreground">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{sub}</p>
      <span className="mt-5 h-1 w-32 overflow-hidden rounded-full bg-slate-100"><span className="block h-full w-1/2 animate-pulse rounded-full bg-orange" /></span>
      {progress && progress.length > 0 && (
        <div className="mt-6 w-full max-w-xs space-y-2 text-left">
          {progress.map((p, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-xs">
              <span className="font-semibold text-foreground">{p.name}</span>
              <span className={p.done ? "font-semibold text-orange-dark" : "text-slate-400"}>{p.done ? "Done" : "Waiting…"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// A failed live LLM step, with a retry.
function ErrorState({ title, sub, onRetry }: { title: string; sub: string; onRetry?: () => void }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center py-20 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600"><Icon name="alert" className="h-6 w-6" /></span>
      <h2 className="mt-5 text-xl font-bold tracking-tight text-foreground">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{sub}</p>
      {onRetry && <div className="mt-5"><PrimaryBtn label="Try again" onClick={onRetry} icon="refresh" /></div>}
    </div>
  );
}

function VenturesPhase({ plan, live = false, ventures, error = false, onRetry, stage = "", name, onName, venture, onVenture, recorded, onRecord, onNext, cohort = [] }: { plan: "free" | "full"; live?: boolean; ventures?: Venture[]; error?: boolean; onRetry?: () => void; stage?: string; name: string; onName: (n: string) => void; venture: VentureDraft; onVenture: React.Dispatch<React.SetStateAction<VentureDraft>>; recorded: Record<string, boolean>; onRecord: (id: string) => void; onNext: () => void; cohort?: Member[] }) {
  // Live: building the venture in steps (or a failure with a retry).
  if (live && (!ventures || ventures.length === 0)) {
    const stageSub: Record<string, string> = {
      research: "Step 1 of 4 — researching the market, competitors, and pricing.",
      core: "Step 2 of 4 — shaping the venture: customer, problem, advantage, approach.",
      plan: "Step 3 of 4 — modelling the market read, financials, and revenue.",
      lenses: "Step 4 of 4 — viewing it through the Magic Lenses.",
    };
    return error
      ? <ErrorState title="Couldn't build your venture" sub="The agent hit a snag building the venture. Give it another go — it picks up where it left off." onRetry={onRetry} />
      : <GeneratingState title="Building your venture" sub={stageSub[stage] ?? "Handing off to the research agents — this runs in a few short steps and can take a few minutes. You can leave and come back."} />;
  }
  const list = ventures && ventures.length ? ventures : VENTURES;
  // One venture is birthed from the chosen opportunity — show it (no slate).
  const v = list.find((x) => x.recommended) ?? list.find((x) => x.id === CHOSEN_ID) ?? list[0];
  if (!v) return null;
  const isChosen = !!v.recommended || v.id === CHOSEN_ID;
  // The venture page is open to see and edit for everyone — only Validation is gated.
  const editable = isChosen;
  const chosenName = live ? (list.find((x) => x.recommended)?.name ?? "the top venture") : VENTURE_DETAILS.name;
  return (
    <div className="space-y-5">
      <div>
        <RailTitle>Your venture</RailTitle>
        <p className="mt-1 text-xs text-slate-400">Born from the opportunity your team chose — see it, edit it, carry it into validation.</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <section className="min-w-0 flex-1">
          <Card className="p-6">
            <CenterHead title={editable ? name : v.name} sub="One-sentence thesis, scored — what, for whom, why now." right={editable ? (
              <span className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-500"><Icon name="bolt" className="h-3.5 w-3.5 text-orange" /> rename<input value={name} onChange={(e) => onName(e.target.value)} className="ml-1 w-24 border-b border-slate-300 bg-transparent text-foreground focus:border-orange focus:outline-none" /></span>
            ) : undefined} />

            <div className="rounded-xl border border-orange/30 bg-orange-tint/20 p-4">
              {editable
                ? <EditableArea value={venture.thesis} onChange={(val) => onVenture((p) => ({ ...p, thesis: val }))} className="text-foreground" />
                : <p className="text-foreground">{v.thesis}</p>}
            </div>

            {editable ? (
              <RichVentureDetail venture={venture} onVenture={onVenture} recorded={recorded} onRecord={onRecord} onNext={onNext} detail={v.detail} cohort={cohort} />
            ) : (
              <>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Field label="Problem score" value={`${v.problemScore}/10`} />
                  <Field label="Solution" value={v.solution} />
                  <Field label="Market" value={v.market} />
                  <Field label="Differentiation" value={v.differentiation} />
                  <Field label="Purpose" value={v.purpose} />
                  <Field label="Earning potential" value={v.earn} />
                </div>
                <div className="mt-3 rounded-xl border border-slate-200 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Only we can do this</p>
                  <p className="mt-1 text-sm text-foreground">{v.unique}</p>
                </div>
                {isChosen && v.lenses && v.lenses.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Approach · Magic Lenses</p>
                    <LensCards lenses={v.lenses} />
                  </div>
                )}
                {isChosen ? (
                  <div className="mt-6"><Upsell title="Full venture details are part of Seed" text="Origin story, team & equity, financials, the 7-day sprint, risk register, and the commitment ritual — plus the validation engine." /></div>
                ) : (
                  <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Select <span className="font-semibold text-foreground">{chosenName}</span> (the recommended venture) to see full details.</div>
                )}
              </>
            )}
          </Card>
        </section>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-slate-200 p-3"><p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-0.5 text-sm text-foreground">{value}</p></div>;
}

// Magic Lenses — the venture's Approach, viewing it through each strategic angle.
function LensCards({ lenses }: { lenses: NonNullable<Venture["lenses"]> }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {lenses.map((l) => (
        <div key={l.id} className="rounded-xl border border-slate-200 p-3">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-orange-dark"><Icon name={l.icon} className="h-3.5 w-3.5" />{l.name}</p>
          <p className="text-[11px] italic text-slate-400">{l.question}</p>
          <p className="mt-1 text-sm text-slate-700">{l.reframe}</p>
        </div>
      ))}
    </div>
  );
}

function FullVentureDetails({ onNext, detail }: { venture: VentureDraft; onVenture: React.Dispatch<React.SetStateAction<VentureDraft>>; recorded: Record<string, boolean>; onRecord: (id: string) => void; onNext: () => void; detail?: VentureDetail; cohort?: Member[] }) {
  const d = VENTURE_DETAILS;
  // Prefer the live, research-grounded content when the venture was generated.
  const financials = detail && detail.financials.rows.length ? detail.financials : d.financials;
  const risks = detail && detail.risks.length ? detail.risks : d.risks;
  return (
    <div className="space-y-6 border-t border-slate-100 pt-6">
      <Section title="Financials">
        <p className="mb-2 text-xs text-slate-400">{financials.note}</p>
        <dl className="space-y-2">{financials.rows.map((r) => <div key={r.label} className="flex gap-3 rounded-lg border border-slate-200 p-3 text-sm"><dt className="w-28 shrink-0 font-semibold text-slate-400">{r.label}</dt><dd className="text-foreground">{r.value}</dd></div>)}</dl>
      </Section>

      <Section title="Risk register">
        <div className="space-y-2">{risks.map((r) => (
          <div key={r.risk} className="rounded-lg border border-slate-200 p-3">
            <p className="flex items-start gap-2 text-sm font-semibold text-foreground"><Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />{r.risk}</p>
            <p className="mt-1 pl-6 text-sm text-slate-600"><span className="font-semibold text-orange-dark">Mitigation:</span> {r.mitigation}</p>
          </div>
        ))}</div>
      </Section>

      <div className="flex justify-end"><PrimaryBtn label="Lock it & validate" onClick={onNext} icon="target" /></div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <div><p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">{title}</p>{children}</div>;
}

/* --------------------------------------------------- 4. Validation */

const CHANNELS = [{ key: "linkedin", label: "LinkedIn" }, { key: "dm", label: "DM" }, { key: "email", label: "Email" }, { key: "whatsapp", label: "WhatsApp" }] as const;

function ValidationPhase({ name, venture, onVenture, checkin, onCheckin, published, onPublish, gated = false, detail, publicUrl }: { name: string; venture: VentureDraft; onVenture: React.Dispatch<React.SetStateAction<VentureDraft>>; checkin: string; onCheckin: (d: string) => void; published: boolean; onPublish: (p: boolean) => void; gated?: boolean; detail?: VentureDetail; publicUrl?: string }) {
  const [channel, setChannel] = useState<(typeof CHANNELS)[number]["key"]>("linkedin");
  const v = VALIDATION;
  const deck = buildDeck(venture, name, detail);
  // Landing: editable + persisted (venture.landing), seeded from the venture.
  const landing = venture.landing ?? buildLanding(venture, detail);
  const outreach = buildOutreach(venture, name);
  const liveUrl = publicUrl ?? "flashco.app";
  const landingEditable = !gated;
  const setLanding = (patch: Partial<LandingCopy>) => onVenture((p) => ({ ...p, landing: { ...(p.landing ?? landing), ...patch } }));
  return (
    <Columns
      left={
        <div className="space-y-4">
          <RailTitle>Check-ins</RailTitle>
          <p className="px-1 text-xs text-slate-400">The agent goes quiet between these. The work is yours.</p>
          {v.checkins.map((c) => {
            const sel = c.day === checkin;
            return (
              <button key={c.day} onClick={() => onCheckin(c.day)} className={`block w-full rounded-xl border p-3 text-left transition-colors ${sel ? "border-orange bg-orange-tint/20 ring-1 ring-orange" : "border-slate-200 hover:border-orange/50"}`}>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{c.day}</span>
                  <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${c.status === "active" ? "bg-orange text-white" : "bg-slate-100 text-slate-400"}`}>{c.status === "active" ? "Open now" : "Locked"}</span>
                </div>
                {sel && <p className="mt-2 text-sm text-slate-600">{c.text}</p>}
              </button>
            );
          })}
        </div>
      }
      center={
        <Card className="p-6">
          <CenterHead title={`Validate ${name}`} sub="Answer the six questions with real people before you build." />
          <Section title="Founding hypothesis">
            <p className="-mt-1 mb-3 text-xs text-slate-400">Each clause is a thing to prove — tick its scorecard check when the evidence lands.</p>
            <HypothesisScorecard v={venture} onToggle={(k) => onVenture((p) => ({ ...p, scorecard: { ...p.scorecard, [k]: !p.scorecard[k] } }))} />
          </Section>

          <div className="mt-6"><ValidationScorecard published={published} /></div>

          <div className="mt-6"><Section title="Landing page">
            <p className="-mt-1 mb-3 text-xs text-slate-400">The proven 5-part formula — value, how, visual, social proof, next step.</p>
            <PublishBar published={published} onPublish={onPublish} url={liveUrl} gated={gated} />
            <LandingHero name={name} landing={landing} editable={landingEditable} onChange={setLanding} url={liveUrl} />
          </Section></div>

          <div className="mt-6"><Section title="Pitch deck">
            <p className="-mt-1 mb-3 text-xs text-slate-400">{deck.length} slides, YC seed-deck order — generated live from your venture outline, cap table, and revenue model.</p>
            <DeckViewer slides={deck} name={name} />
          </Section></div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Section title="Outreach copy">
              <div className="mb-3 flex flex-wrap gap-2">{CHANNELS.map((c) => <button key={c.key} onClick={() => setChannel(c.key)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${channel === c.key ? "bg-orange text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>{c.label}</button>)}</div>
              <p className="whitespace-pre-line rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">{outreach[channel]}</p>
            </Section>
            <Section title="Feedback synthesis">
            <p className="mb-2 text-xs text-slate-400">{v.feedbackNote}</p>
            <p className="mb-2 text-sm text-slate-600">{v.sendTarget}</p>
            <ul className="space-y-1.5">{v.feedbackEdits.map((e) => <li key={e} className="flex items-start gap-2 rounded-lg bg-slate-50 p-2.5 text-sm text-slate-700"><Icon name="refresh" className="mt-0.5 h-4 w-4 shrink-0 text-orange" />{e}</li>)}</ul>
          </Section></div>
        </Card>
      }
    />
  );
}

/* ------------------------------------------ validation assets: landing + deck */

function FlashMark({ className = "h-5 w-5 text-orange" }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true"><path d="M13 2 4.5 13.5H11l-1.5 8.5L20 9.5h-6.5L13 2Z" /></svg>;
}

function LandingHero({ name, landing, editable = false, onChange, url = "flashco.app" }: { name: string; landing: LandingCopy; editable?: boolean; onChange?: (patch: Partial<LandingCopy>) => void; url?: string }) {
  const set = onChange ?? (() => {});
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/5 shadow-sm">
      <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        <span className="ml-3 truncate rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-slate-400">{url}</span>
      </div>
      <div className="p-6 sm:p-8">
        <div className="mb-7 flex items-center gap-2">
          <FlashMark className="h-5 w-5 text-orange" />
          <span className="font-bold tracking-tight text-foreground">{name}</span>
        </div>
        <div className="grid items-center gap-8 lg:grid-cols-2">
          {/* value, how, next step, social proof */}
          <div>
            {editable
              ? <EditableArea value={landing.headline} onChange={(t) => set({ headline: t })} className="text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl" placeholder="Headline — the value" />
              : <h3 className="text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl">{landing.headline}</h3>}
            {editable
              ? <EditableArea value={landing.subhead} onChange={(t) => set({ subhead: t })} className="mt-4 text-lg leading-relaxed text-slate-600" placeholder="Subhead — how it works" />
              : <p className="mt-4 text-lg leading-relaxed text-slate-600">{landing.subhead}</p>}

            <div className="mt-6">
              {editable
                ? <span className="inline-flex h-12 items-center rounded-xl bg-orange px-4 text-sm font-bold text-white"><input value={landing.cta} onChange={(e) => set({ cta: e.target.value })} placeholder="Call to action" className="w-44 bg-transparent text-white placeholder:text-white/60 focus:outline-none" /></span>
                : <span className="inline-flex h-12 items-center rounded-xl bg-orange px-6 text-sm font-bold text-white">{landing.cta}</span>}
            </div>

            <div className="mt-7 flex items-center gap-3 border-t border-slate-100 pt-5">
              <div className="flex -space-x-2">
                {["bg-emerald-200", "bg-sky-200", "bg-amber-200", "bg-rose-200"].map((c, i) => (
                  <span key={i} className={`h-8 w-8 rounded-full ring-2 ring-white ${c}`} />
                ))}
              </div>
              <div className="min-w-0 flex-1">
                {editable ? (
                  <>
                    <EditableArea value={landing.proof.stat} onChange={(t) => set({ proof: { ...landing.proof, stat: t } })} className="text-sm font-semibold text-foreground" rows={1} placeholder="Social proof — the stat" />
                    <EditableArea value={landing.proof.detail} onChange={(t) => set({ proof: { ...landing.proof, detail: t } })} className="text-xs text-slate-500" rows={1} placeholder="…the detail" />
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-foreground">{landing.proof.stat}</p>
                    <p className="text-xs text-slate-500">{landing.proof.detail}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* visual */}
          <div>
            <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-orange-tint to-slate-100 ring-1 ring-slate-200">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-orange shadow-sm"><Icon name="play" className="h-7 w-7" /></span>
            </div>
            {editable
              ? <EditableArea value={landing.visualCaption} onChange={(t) => set({ visualCaption: t })} className="mt-2 text-center text-sm text-slate-500" rows={1} placeholder="Caption" />
              : <p className="mt-2 text-center text-sm text-slate-500">{landing.visualCaption}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function DeckViewer({ slides, name }: { slides: DeckSlide[]; name: string }) {
  const [i, setI] = useState(0);
  const total = slides.length;
  const go = (n: number) => setI((n + total) % total);
  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white/5 shadow-sm">
          <SlideStage slide={slides[i]} index={i} total={total} name={name} />
        </div>
        <button onClick={() => go(i - 1)} aria-label="Previous slide" className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-600 shadow-sm backdrop-blur transition-colors hover:bg-white hover:text-orange-dark">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <button onClick={() => go(i + 1)} aria-label="Next slide" className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-600 shadow-sm backdrop-blur transition-colors hover:bg-white hover:text-orange-dark">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m9 18 6-6-6-6" /></svg>
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {slides.map((s, n) => {
          const active = n === i;
          return (
            <button key={s.label} onClick={() => setI(n)} className={`flex shrink-0 flex-col rounded-lg border px-3 py-2 text-left transition-colors ${active ? "border-orange bg-orange-tint/30 ring-1 ring-orange" : "border-slate-200 hover:border-orange/40"}`}>
              <span className="text-[10px] font-bold tabular-nums text-slate-400">{String(n + 1).padStart(2, "0")}</span>
              <span className={`whitespace-nowrap text-xs font-semibold ${active ? "text-orange-dark" : "text-slate-600"}`}>{s.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SlideStage({ slide, index, total, name }: { slide: DeckSlide; index: number; total: number; name: string }) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex h-full flex-col p-6 sm:p-8">
      <div className="flex shrink-0 items-center justify-between">
        <div className="flex items-center gap-2">
          <FlashMark className="h-4 w-4 text-orange" />
          <span className="text-sm font-bold tracking-tight text-foreground">{name}</span>
        </div>
        <span className="text-xs font-semibold tabular-nums text-slate-400">{pad(index + 1)} / {pad(total)}</span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-center py-3">
        {slide.kind === "title" ? (
          <div className="text-center">
            <h3 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{slide.headline}</h3>
            {slide.points?.[0] && <p className="mx-auto mt-3 max-w-md text-lg text-slate-600">{slide.points[0]}</p>}
          </div>
        ) : (
          <>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-dark">{slide.label}</p>
            <h3 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-[28px]">{slide.headline}</h3>

            {slide.kind === "team" ? (
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {(slide.team ?? []).map((r) => {
                  const m = memberById(r.memberId);
                  return (
                    <div key={r.memberId} className="rounded-xl border border-slate-200 p-3">
                      <div className="flex items-center gap-2">
                        <Avatar m={m} size="h-8 w-8 text-[10px]" />
                        <span className="rounded-md bg-orange-tint px-1.5 py-0.5 text-xs font-bold text-orange-dark">{r.equity === "" ? "—" : `${r.equity}%`}</span>
                      </div>
                      <p className="mt-2 text-sm font-bold text-foreground">{m.name}</p>
                      <p className="text-xs text-slate-500">{r.role}</p>
                    </div>
                  );
                })}
              </div>
            ) : slide.kind === "traction" ? (
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {slide.points?.map((p) => (
                  <div key={p} className="rounded-xl border border-orange/30 bg-orange-tint/20 p-3 text-sm font-semibold text-foreground">{p}</div>
                ))}
              </div>
            ) : (
              <ul className="mt-4 space-y-2">
                {slide.points?.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-[15px] text-slate-700">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                    {p}
                  </li>
                ))}
              </ul>
            )}

            {slide.kind === "market" && slide.footnote && (
              <div className="mt-4 inline-flex items-center gap-2 self-start rounded-xl bg-accent px-4 py-2 text-sm font-bold text-white">
                <Icon name="chart" className="h-4 w-4" /> {slide.footnote}
              </div>
            )}
          </>
        )}
      </div>

      {slide.kind === "title" && slide.footnote && (
        <p className="shrink-0 text-center text-xs font-medium text-slate-400">{slide.footnote}</p>
      )}
    </div>
  );
}

/* ----------------------------------------- editable venture detail (Click) */

function EditableArea({ value, onChange, className = "", rows = 2, placeholder }: { value: string; onChange: (v: string) => void; className?: string; rows?: number; placeholder?: string }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className={`-mx-1.5 w-full resize-y rounded-md border border-transparent bg-transparent px-1.5 py-1 leading-snug hover:border-slate-200 focus:border-orange focus:bg-white/5 focus:outline-none ${className}`}
    />
  );
}

// A labelled worksheet box (Click "The Basics / Advantage / Competition" fields).
function LabeledBox({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <div className="rounded-xl border border-slate-200 p-3"><EditableArea value={value} onChange={onChange} rows={3} placeholder={placeholder} className="text-sm text-foreground" /></div>
    </div>
  );
}

// 0–5 score. Editable when onChange is passed; read-only otherwise.
function DotScore({ value, onChange, label, tone = "orange" }: { value: number; onChange?: (v: number) => void; label?: string; tone?: "orange" | "grey" }) {
  const fill = tone === "grey" ? "bg-slate-400" : "bg-orange";
  const valueText = tone === "grey" ? "text-slate-400" : "text-orange-dark";
  return (
    <div>
      {label && <div className="mb-1 flex items-center justify-between text-xs"><span className="text-slate-500">{label}</span><span className={`font-semibold tabular-nums ${valueText}`}>{value}/5</span></div>}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" disabled={!onChange} onClick={() => onChange?.(n === 1 && value === 1 ? 0 : n)} aria-label={`${label ?? "score"}: ${n} of 5`} className={`h-2.5 flex-1 rounded-full transition-colors ${n <= value ? fill : "bg-slate-200"} ${onChange ? "cursor-pointer hover:opacity-80" : ""}`} />
        ))}
      </div>
    </div>
  );
}

function RichVentureDetail({ venture, onVenture, recorded, onRecord, onNext, detail, cohort = [] }: { venture: VentureDraft; onVenture: React.Dispatch<React.SetStateAction<VentureDraft>>; recorded: Record<string, boolean>; onRecord: (id: string) => void; onNext: () => void; detail?: VentureDetail; cohort?: Member[] }) {
  const set = <K extends keyof VentureDraft,>(key: K, val: VentureDraft[K]) => onVenture((p) => ({ ...p, [key]: val }));
  const setBasics = (patch: Partial<VentureDraft["basics"]>) => onVenture((p) => ({ ...p, basics: { ...p.basics, ...patch } }));
  const setAdvantage = (patch: Partial<VentureDraft["advantage"]>) => onVenture((p) => ({ ...p, advantage: { ...p.advantage, ...patch } }));
  const setCompetition = (patch: Partial<VentureDraft["competition"]>) => onVenture((p) => ({ ...p, competition: { ...p.competition, ...patch } }));
  const setProblem = (patch: Partial<VentureDraft["problem"]>) => onVenture((p) => ({ ...p, problem: { ...p.problem, ...patch } }));
  const setDiff = (patch: Partial<VentureDraft["differentiation"]>) => onVenture((p) => ({ ...p, differentiation: { ...p.differentiation, ...patch } }));
  return (
    <div className="mt-5 space-y-5">
      <Section title="North star">
        <div className="rounded-xl border border-orange/30 bg-orange-tint/20 p-4">
          <p className="text-xs italic text-slate-400">The clear why behind it all.</p>
          <EditableArea value={venture.purpose} onChange={(val) => set("purpose", val)} className="mt-1 text-foreground" />
        </div>
      </Section>

      <Part label="Basics" hint="Get the foundation right.">
        <Section title="Customer & problem">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="sm:col-span-1"><LabeledBox label="Customer" value={venture.basics.customer} onChange={(v) => setBasics({ customer: v })} placeholder="Who exactly?" /></div>
            <div className="sm:col-span-2"><LabeledBox label="Problem" value={venture.basics.problem} onChange={(v) => setBasics({ problem: v })} placeholder="What's broken for them?" /></div>
          </div>
        </Section>
        <ProblemBreakdown problem={venture.problem} set={setProblem} />
        <Section title="Advantage">
          <div className="grid gap-3 sm:grid-cols-3">
            <LabeledBox label="Capability" value={venture.advantage.capability} onChange={(v) => setAdvantage({ capability: v })} placeholder="What can only you do?" />
            <LabeledBox label="Insight" value={venture.advantage.insight} onChange={(v) => setAdvantage({ insight: v })} placeholder="What do you know that others don't?" />
            <LabeledBox label="Motivation" value={venture.advantage.motivation} onChange={(v) => setAdvantage({ motivation: v })} placeholder="Why you, why this?" />
          </div>
          <div className="mt-3"><LabeledBox label="Only we can do this" value={venture.unique} onChange={(val) => set("unique", val)} placeholder="The combination only your team has" /></div>
        </Section>
        <Section title="Competition">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="sm:col-span-1"><LabeledBox label="800-pound gorilla" value={venture.competition.gorilla} onChange={(v) => setCompetition({ gorilla: v })} placeholder="The incumbent" /></div>
            <div className="sm:col-span-2"><LabeledBox label="Top alternatives" value={venture.competition.alternatives} onChange={(v) => setCompetition({ alternatives: v })} placeholder="Substitutes, workarounds, non-consumption" /></div>
          </div>
        </Section>
        <Section title="Market">{detail && detail.market.length ? <MarketFindings findings={detail.market} /> : <MarketReport />}</Section>
      </Part>

      <Part label="Differentiation" hint="Differentiation makes products click.">
        <DifferentiationBlock diff={venture.differentiation} set={setDiff} />
        <Section title="Principles"><PrinciplesEditor principles={venture.principles} onChange={(p) => set("principles", p)} /></Section>
      </Part>

      <RevenueBreakdown revenue={venture.revenue} onChange={(r) => set("revenue", r)} />

      <FullVentureDetails venture={venture} onVenture={onVenture} recorded={recorded} onRecord={onRecord} onNext={onNext} detail={detail} cohort={cohort} />
    </div>
  );
}

// A Click top-level part (Basics / Differentiation / Approach) — a defined,
// bordered section with a book-style header.
function Part({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50/40 p-5">
      <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-slate-200 pb-3">
        <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-orange-dark">{label}</h2>
        <p className="text-xs text-slate-400">{hint}</p>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

// Live, research-grounded market read (replaces the demo's static MarketReport
// when the venture was generated).
function MarketFindings({ findings }: { findings: VentureDetail["market"] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {findings.map((f) => (
        <div key={f.label} className="rounded-xl border border-slate-200 p-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-orange-dark">{f.label}</p>
          <p className="mt-1 text-sm text-slate-700">{f.finding}</p>
        </div>
      ))}
    </div>
  );
}

function MarketReport() {
  const [run, setRun] = useState(false);
  const r = MARKET_REPORT;
  if (!run) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-orange/50 bg-orange-tint/10 p-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">Run an in-depth market report</p>
          <p className="text-xs text-slate-500">Pulls the team&rsquo;s inputs and public data into sizing, trends, segments, and competition.</p>
        </div>
        <button onClick={() => setRun(true)} className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-orange px-4 text-sm font-bold text-white transition-colors hover:bg-orange-dark"><Icon name="chart" className="h-4 w-4" /> Run market report</button>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-foreground">{r.summary}</p>
        <button onClick={() => setRun(false)} className="shrink-0 text-xs font-semibold text-slate-400 hover:text-slate-600">Regenerate</button>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {r.stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-orange/30 bg-orange-tint/20 p-3">
            <p className="text-[11px] font-bold uppercase tracking-wide text-orange-dark">{s.label}</p>
            <p className="text-lg font-bold tabular-nums text-foreground">{s.value}</p>
            <p className="text-[11px] text-slate-500">{s.note}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div><p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">Tailwinds</p><ul className="space-y-1.5">{r.trends.map((t) => <li key={t} className="flex items-start gap-2 text-sm text-slate-700"><Icon name="chart" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange" />{t}</li>)}</ul></div>
        <div><p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">Segments</p><ul className="space-y-1.5">{r.segments.map((t) => <li key={t} className="flex items-start gap-2 text-sm text-slate-700"><Icon name="group" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange" />{t}</li>)}</ul></div>
      </div>
      <div className="mt-4"><p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">Competitive landscape</p><p className="text-sm text-slate-700">{r.competition}</p></div>
      <p className="mt-3 text-[11px] text-slate-400">Sources: {r.sources.join(" · ")}. Illustrative — generated from the team&rsquo;s inputs and public data.</p>
    </div>
  );
}

function PrinciplesEditor({ principles, onChange }: { principles: string[]; onChange: (p: string[]) => void }) {
  const setAt = (i: number, val: string) => onChange(principles.map((x, idx) => (idx === i ? val : x)));
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="-mt-1 mb-3 text-xs text-slate-400">Turn your differentiation into operating rules — e.g. Google&rsquo;s &ldquo;Faster is better than slower.&rdquo;</p>
      <div className="space-y-2">
        {principles.map((p, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
            <input value={p} onChange={(e) => setAt(i, e.target.value)} placeholder="A rule your team will live by" className="flex-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-foreground focus:border-orange focus:outline-none" />
            <button onClick={() => onChange(principles.filter((_, idx) => idx !== i))} aria-label="Remove principle" className="mt-1.5 shrink-0 text-slate-300 hover:text-slate-500"><Icon name="minus" className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
      <button onClick={() => onChange([...principles, ""])} className="mt-3 text-sm font-semibold text-orange-dark hover:underline">+ Add a principle</button>
    </div>
  );
}

function ApproachOptions({ chosen, onPick, options = APPROACH_OPTIONS }: { chosen: string; onPick: (id: string) => void; options?: ApproachOption[] }) {
  return (
    <div>
      <p className="-mt-1 mb-3 text-xs text-slate-400">At least three. Each is a one-pager — pick the one to carry into validation.</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {options.map((o) => {
          const active = o.id === chosen;
          return (
            <button key={o.id} onClick={() => onPick(o.id)} className={`flex flex-col rounded-xl border p-3 text-left transition-colors ${active ? "border-orange bg-orange-tint/20 ring-1 ring-orange" : "border-slate-200 hover:border-orange/50"}`}>
              <div className="flex items-center gap-2">
                <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${active ? "bg-orange text-white" : "border border-slate-300"}`}>{active && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5"><path d="m5 12 5 5L20 7" /></svg>}</span>
                <p className="text-sm font-bold text-foreground">{o.title}</p>
              </div>
              <p className="mt-1.5 text-xs text-slate-600">{o.why}</p>
              <div className="mt-3 flex h-14 items-center justify-center rounded-lg border border-dashed border-slate-200 text-[11px] uppercase tracking-wide text-slate-300">sketch</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProblemBreakdown({ problem, set }: { problem: VentureDraft["problem"]; set: (patch: Partial<VentureDraft["problem"]>) => void }) {
  const overall = Math.round(((problem.painful + problem.frequent + problem.whyNow) / 15) * 10);
  return (
    <Section title="Problem score">
      <div className="rounded-xl border border-slate-200 p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-slate-500">How real is this problem?</p>
          <span className="rounded-lg bg-orange px-2.5 py-1 text-sm font-bold tabular-nums text-white">{overall}/10</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <DotScore label="How painful?" value={problem.painful} onChange={(n) => set({ painful: n })} />
          <DotScore label="How frequent?" value={problem.frequent} onChange={(n) => set({ frequent: n })} />
          <DotScore label="Why now?" value={problem.whyNow} onChange={(n) => set({ whyNow: n })} />
        </div>
        <div className="mt-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">What do they pay to solve it now?</p>
          <EditableArea value={problem.payNow} onChange={(val) => set({ payNow: val })} className="mt-1 text-sm text-foreground" />
        </div>
      </div>
    </Section>
  );
}

function DifferentiationBlock({ diff, set }: { diff: VentureDraft["differentiation"]; set: (patch: Partial<VentureDraft["differentiation"]>) => void }) {
  return (
    <Section title="Differentiation">
      <div className="rounded-xl border border-slate-200 p-4">
        <p className="text-xs italic text-slate-400">Differentiation makes products click.</p>
        <EditableArea value={diff.statement} onChange={(val) => set({ statement: val })} className="mt-1 font-medium text-foreground" />
        <div className="mt-3 max-w-xs"><DotScore label="Clarity" value={diff.clarity} onChange={(n) => set({ clarity: n })} /></div>
      </div>
    </Section>
  );
}

function money(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}m`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}k`;
  return `$${Math.round(n)}`;
}

function revenueFormula(id: string, d: Record<string, number>): string {
  switch (id) {
    case "cohort": return `${d.cohorts ?? 0} cohorts × ${d.seats ?? 0} seats × $${(d.price ?? 0).toLocaleString()}`;
    case "placement": return `${d.placements ?? 0} placements × $${(d.fee ?? 0).toLocaleString()}`;
    case "subscription": return `${d.members ?? 0} members × $${d.price ?? 0}/mo × 12`;
    case "marketplace": return `${money(d.gmv ?? 0)} value × ${d.take ?? 0}%`;
    default: return "";
  }
}

function RevenueBreakdown({ revenue, onChange }: { revenue: VentureDraft["revenue"]; onChange: (r: VentureDraft["revenue"]) => void }) {
  const model = REVENUE_MODELS.find((m) => m.id === revenue.id) ?? REVENUE_MODELS[0];
  const build = revenueBuild(revenue.id, revenue.drivers, revenue.growth);
  const max = Math.max(...build, 1);
  const setDriver = (key: string, val: number) => onChange({ ...revenue, drivers: { ...revenue.drivers, [key]: val } });
  return (
    <Section title="Earning potential">
      <div className="rounded-xl border border-slate-200 p-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Revenue model — model out the options</p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {REVENUE_MODELS.map((m) => {
            const active = m.id === revenue.id;
            const y3 = revenueBuild(m.id, Object.fromEntries(m.drivers.map((d) => [d.key, d.value])), m.growth)[2];
            return (
              <button key={m.id} onClick={() => onChange(revenueDefaults(m))} className={`rounded-xl border p-3 text-left transition-colors ${active ? "border-orange bg-orange-tint/20 ring-1 ring-orange" : "border-slate-200 hover:border-orange/50"}`}>
                <p className="text-sm font-bold text-foreground">{m.label}</p>
                <p className="mt-0.5 text-[11px] uppercase tracking-wide text-slate-400">Y3 {m.unit}</p>
                <p className="text-lg font-bold tabular-nums text-orange-dark">{money(y3)}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/40 p-4">
          <p className="text-sm font-semibold text-foreground">{model.label}</p>
          <p className="mt-0.5 text-sm text-slate-600">{model.pitch}</p>

          <div className="mt-4 grid gap-5 lg:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Assumptions</p>
              <div className="space-y-2">
                {model.drivers.map((d) => (
                  <div key={d.key} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white/5 p-2.5">
                    <span className="text-sm text-slate-600">{d.label}</span>
                    <span className="flex items-center gap-0.5">
                      {d.prefix && <span className="text-sm text-slate-400">{d.prefix}</span>}
                      <input inputMode="numeric" value={revenue.drivers[d.key] ?? 0} onChange={(e) => setDriver(d.key, Number(e.target.value.replace(/[^0-9]/g, "")) || 0)} className="w-24 rounded-md border border-slate-200 px-2 py-1 text-right text-sm tabular-nums focus:border-orange focus:outline-none" />
                      {d.suffix && <span className="text-sm text-slate-400">{d.suffix}</span>}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white/5 p-2.5">
                  <span className="text-sm text-slate-600">Annual growth</span>
                  <span className="flex items-center gap-0.5">
                    <input inputMode="numeric" value={revenue.growth} onChange={(e) => onChange({ ...revenue, growth: Number(e.target.value.replace(/[^0-9]/g, "")) || 0 })} className="w-24 rounded-md border border-slate-200 px-2 py-1 text-right text-sm tabular-nums focus:border-orange focus:outline-none" />
                    <span className="text-sm text-slate-400">%</span>
                  </span>
                </div>
              </div>
              <p className="mt-2 text-[11px] text-slate-400">{revenueFormula(revenue.id, revenue.drivers)} = <span className="font-semibold text-slate-500">{money(build[0])}</span> in year 1</p>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">3-year build</p>
              <div className="flex h-32 items-end gap-3">
                {build.map((rev, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1">
                    <span className="text-xs font-bold tabular-nums text-foreground">{money(rev)}</span>
                    <div className="w-full rounded-t-md bg-orange" style={{ height: `${Math.max(6, (rev / max) * 100)}%` }} />
                    <span className="text-[11px] font-semibold text-slate-400">Y{i + 1}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-lg bg-accent px-3 py-2 text-center">
                <p className="text-[11px] uppercase tracking-wide text-white/60">Year 3 {model.unit}</p>
                <p className="text-xl font-bold tabular-nums text-white">{money(build[2])}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-orange/30 bg-orange-tint/20 p-3"><p className="text-xs font-bold text-orange-dark">What fits</p><p className="mt-0.5 text-sm text-slate-700">{model.fits}</p></div>
            <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3"><p className="text-xs font-bold text-amber-700">What doesn&rsquo;t</p><p className="mt-0.5 text-sm text-slate-700">{model.doesnt}</p></div>
          </div>
          <p className="mt-3 text-[11px] text-slate-400">Illustrative founder model — assumptions, not results. Edit the drivers to pressure-test the story.</p>
        </div>
      </div>
    </Section>
  );
}

function CapTable({ capTable, setRow, setPool }: { capTable: VentureDraft["capTable"]; setRow: (i: number, patch: Partial<VentureDraft["capTable"]["rows"][number]>) => void; setPool: (n: number) => void }) {
  const allocated = capTable.rows.reduce((s, r) => s + (Number(r.equity) || 0), 0);
  const unalloc = 100 - capTable.pool - allocated;
  return (
    <Section title="Cap table">
      <p className="-mt-1 mb-2 text-xs text-slate-400">Equity starts blank — agree the splits together. Founders + option pool + unallocated = 100%.</p>
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[34rem] text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
              <th className="p-3">Holder</th>
              <th className="p-3">Responsibility</th>
              <th className="w-24 p-3">Equity</th>
              <th className="w-40 p-3">Vesting</th>
            </tr>
          </thead>
          <tbody>
            {capTable.rows.map((r, i) => { const m = memberById(r.memberId); return (
              <tr key={r.memberId} className="border-t border-slate-100 align-middle">
                <td className="p-3"><div className="flex items-center gap-2"><Avatar m={m} size="h-7 w-7 text-[10px]" /><div className="min-w-0"><p className="font-semibold text-foreground">{m.name}</p><p className="truncate text-xs text-slate-500">{r.role}</p></div></div></td>
                <td className="p-3 text-slate-600">{r.responsibility}</td>
                <td className="p-3"><div className="flex items-center gap-1"><input inputMode="numeric" value={r.equity} placeholder="—" onChange={(e) => setRow(i, { equity: e.target.value.replace(/[^0-9]/g, "").slice(0, 3) })} className="w-12 rounded-md border border-slate-200 px-2 py-1 text-right tabular-nums focus:border-orange focus:outline-none" /><span className="text-slate-400">%</span></div></td>
                <td className="p-3"><input value={r.vesting} onChange={(e) => setRow(i, { vesting: e.target.value })} className="-mx-1.5 w-full rounded-md border border-transparent bg-transparent px-1.5 py-1 text-slate-600 hover:border-slate-200 focus:border-orange focus:bg-white/5 focus:outline-none" /></td>
              </tr>
            ); })}
            <tr className="border-t border-slate-100 bg-slate-50/40">
              <td className="p-3"><p className="font-semibold text-foreground">Option pool</p><p className="text-xs text-slate-500">Reserved</p></td>
              <td className="p-3 text-slate-500">Future hires</td>
              <td className="p-3"><div className="flex items-center gap-1"><input inputMode="numeric" value={capTable.pool} onChange={(e) => setPool(Number(e.target.value.replace(/[^0-9]/g, "").slice(0, 3)) || 0)} className="w-12 rounded-md border border-slate-200 px-2 py-1 text-right tabular-nums focus:border-orange focus:outline-none" /><span className="text-slate-400">%</span></div></td>
              <td className="p-3 text-slate-400">—</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="border-t border-slate-200">
              <td className="p-3 font-bold text-foreground" colSpan={2}>Unallocated</td>
              <td className={`p-3 font-bold tabular-nums ${unalloc < 0 ? "text-amber-600" : "text-foreground"}`}>{unalloc}%</td>
              <td className="p-3" />
            </tr>
          </tfoot>
        </table>
      </div>
    </Section>
  );
}

/* ----------------------------------------- validation: publish + scorecard */

function PublishBar({ published, onPublish, url, gated = false }: { published: boolean; onPublish: (p: boolean) => void; url: string; gated?: boolean }) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
      {published ? (
        <>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange/15 px-2.5 py-1 text-xs font-bold text-orange-dark"><span className="h-2 w-2 rounded-full bg-orange" /> Live</span>
          <code className="text-sm text-slate-600">{url}</code>
          <button className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"><Icon name="copy" className="h-3.5 w-3.5" /> Copy link</button>
          <span className="ml-auto hidden items-center gap-1.5 text-xs text-slate-400 sm:flex"><Icon name="shield" className="h-3.5 w-3.5" /> Hosted by Flash Company · collecting signups</span>
          <button onClick={() => onPublish(false)} className="text-xs font-semibold text-slate-400 hover:text-slate-600">Unpublish</button>
        </>
      ) : gated ? (
        <>
          <span className="text-sm text-slate-600">Preview the hosted page and dashboard — publishing for real is part of Seed.</span>
          <span className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-lg border border-orange/40 bg-orange-tint/30 px-4 text-sm font-bold text-orange-dark"><Icon name="lock" className="h-4 w-4" /> Publishing is part of Seed</span>
        </>
      ) : (
        <>
          <span className="text-sm text-slate-600">Launch a hosted page and start collecting signups.</span>
          <button onClick={() => onPublish(true)} className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-lg bg-orange px-4 text-sm font-bold text-white transition-colors hover:bg-orange-dark"><Icon name="bolt" className="h-4 w-4" /> Publish</button>
        </>
      )}
    </div>
  );
}

function ValidationScorecard({ published }: { published: boolean }) {
  return (
    <Section title="Live signals">
      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {VALIDATION.liveMetrics.map((mt) => (
          <div key={mt.label} className="rounded-xl border border-slate-200 p-3">
            <p className="text-xs text-slate-500">{mt.label}</p>
            <p className="mt-0.5 text-xl font-bold tabular-nums text-foreground">{published ? mt.value : "—"}</p>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {VALIDATION.scorecard.map((s) => {
          const value = published ? s.value : 0;
          const pct = Math.min(100, Math.round((value / s.target) * 100));
          const hit = value >= s.target;
          return (
            <div key={s.test} className="rounded-xl border border-slate-200 p-3">
              <div className="flex items-center gap-2">
                <Icon name="target" className="h-4 w-4 shrink-0 text-orange" />
                <p className="text-sm font-semibold text-foreground">{s.test}</p>
                <span className="ml-auto text-sm font-bold tabular-nums text-orange-dark">{value}/{s.target} <span className="text-xs font-normal text-slate-400">{s.metric}</span></span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${hit ? "bg-orange" : "bg-orange/60"}`} style={{ width: `${pct}%` }} /></div>
            </div>
          );
        })}
      </div>
      {!published && <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400"><Icon name="bolt" className="h-3.5 w-3.5" /> Publish the landing page below to start collecting live signals.</p>}
    </Section>
  );
}

/* ---------------------------- validation assets, generated from the venture */

// The deck and landing are built live from the editable venture draft, so
// edits in Ventures (and the cap table / revenue model) feed straight through.
function approachOf(v: VentureDraft) {
  return APPROACH_OPTIONS.find((o) => o.id === v.approachId) ?? APPROACH_OPTIONS[0];
}

// Everything below flows live from the venture (+ its generated research detail),
// so the landing, deck, and outreach reflect THIS venture, not a template.
function buildDeck(v: VentureDraft, name: string, detail?: VentureDetail): DeckSlide[] {
  const model = REVENUE_MODELS.find((m) => m.id === v.revenue.id) ?? REVENUE_MODELS[0];
  const build = revenueBuild(v.revenue.id, v.revenue.drivers, v.revenue.growth);
  const nameOf = (id: string) => memberById(id)?.name ?? "Founder";
  const founders = v.capTable.rows.map((r) => nameOf(r.memberId)).join(" · ");
  const team = v.capTable.rows.map((r) => ({ memberId: r.memberId, role: r.role, equity: r.equity }));
  const approach = approachOf(v);
  const market = detail && detail.market.length ? detail.market : null;
  const fin = detail && detail.financials.rows.length ? detail.financials : null;
  return [
    { kind: "title", label: "Title", headline: name, points: [v.thesis], footnote: `${founders} — founding team` },
    { label: "Problem", headline: v.basics.problem || "The problem", points: [`Who: ${v.basics.customer}`, `Today they pay: ${v.problem.payNow}`] },
    { label: "Why now", headline: "Why now", points: market ? market.slice(0, 3).map((m) => m.finding) : ["The signals that make this urgent right now."] },
    { kind: "market", label: "Market", headline: market ? market[0].finding : MARKET_REPORT.summary, points: market ? market.map((m) => `${m.label}: ${m.finding}`) : MARKET_REPORT.stats.map((s) => `${s.label}: ${s.value}`), footnote: fin ? fin.note : `${money(build[2])} Y3 ${model.unit} (illustrative)` },
    { label: "Approach", headline: approach.title, points: [approach.why, ...v.principles.slice(0, 2)] },
    { label: "Business model", headline: `${model.label}: ${model.pitch}`, points: [`Year 1: ${money(build[0])}`, `Year 3: ${money(build[2])} ${model.unit}`, `Growing ${v.revenue.growth}% a year`] },
    { label: "Why us", headline: v.differentiation.statement, points: [v.unique, v.advantage.capability].filter(Boolean) },
    { kind: "team", label: "Team", headline: "The founding team", team },
    { kind: "ask", label: "The ask", headline: "Run the pilot, hit the day-30 gate.", points: fin ? fin.rows.slice(0, 3).map((r) => `${r.label}: ${r.value}`) : ["First pilot cohort.", "Warm intros pre-lined.", "Day-30 go/no-go."] },
  ];
}

function buildLanding(v: VentureDraft, detail?: VentureDetail): LandingCopy {
  const approach = approachOf(v);
  return {
    headline: v.differentiation.statement || v.thesis,
    subhead: approach.why,
    visualCaption: `How ${approach.title} works`,
    proof: detail && detail.market.length ? { stat: detail.market[0].label, detail: detail.market[0].finding } : VALIDATION.landing.proof,
    cta: "Join the waitlist",
  };
}

function buildOutreach(v: VentureDraft, name: string): typeof VALIDATION.outreach {
  const approach = approachOf(v);
  const lead = v.capTable.rows[0] ? (memberById(v.capTable.rows[0].memberId)?.name ?? "the team") : "the team";
  const problem = v.basics.problem;
  return {
    linkedin: `${problem}\n\nWe're building ${name} — ${approach.why}\n\nIf that resonates, comment and I'll send details.`,
    dm: `Hey {name} — we're building ${name} for exactly this: ${problem} Want an early look?`,
    email: `Subject: an early look at ${name}\n\nHi {name},\n\n${problem}\n\n${name} is our answer — ${approach.why}\n\nWe're opening a small pilot. Want in?\n\n${lead} — ${name}`,
    whatsapp: `Hi {name}! We're piloting ${name} — ${approach.why} A few early spots open. Keen?`,
  };
}

/* ----------------------------------------- validation: Click hypothesis + scorecard */

// The Click "Founding Hypothesis" + Scorecard — each clause on a line with its
// scorecard check beside it. Composed live from the venture.
function HypothesisScorecard({ v, onToggle }: { v: VentureDraft; onToggle: (k: ScorecardKey) => void }) {
  const comp = [v.competition.gorilla, v.competition.alternatives].filter(Boolean).join(" / ");
  const rows: { label: string; value: string; fallback: string; key: ScorecardKey; question: string }[] = [
    { label: "If we help", value: v.basics.customer, fallback: "customer", key: "rightCustomer", question: "Right customer?" },
    { label: "solve", value: v.basics.problem, fallback: "problem", key: "rightProblem", question: "Right problem?" },
    { label: "with", value: approachOf(v).title, fallback: "approach", key: "rightApproach", question: "Right approach?" },
    { label: "they will choose it over", value: comp, fallback: "competitors", key: "willSwitch", question: "Will they switch?" },
    { label: "because our solution is", value: v.differentiation.statement, fallback: "differentiation", key: "rightDifferentiation", question: "Right differentiation?" },
  ];
  const done = SCORECARD.filter((s) => v.scorecard[s.key]).length;
  const check = (key: ScorecardKey, question: string) => {
    const on = v.scorecard[key];
    return (
      <button onClick={() => onToggle(key)} className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-sm font-semibold transition-colors ${on ? "border-orange bg-orange-tint/30 text-foreground" : "border-slate-200 text-slate-600 hover:border-orange/50"}`}>
        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${on ? "bg-orange text-white" : "border border-slate-300"}`}>{on && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3"><path d="m5 12 5 5L20 7" /></svg>}</span>
        {question}
      </button>
    );
  };
  return (
    <div className="rounded-xl border border-slate-200 p-4 sm:p-5">
      <div className="mb-3 hidden items-center justify-between text-[11px] font-bold uppercase tracking-wide text-slate-400 lg:flex">
        <span className="flex-1">Founding hypothesis</span>
        <span className="flex w-[13rem] items-center justify-between">Scorecard <span className="rounded bg-orange px-1.5 py-0.5 text-white tabular-nums">{done}/{SCORECARD.length}</span></span>
      </div>
      <div className="space-y-2.5">
        {rows.map((r) => (
          <div key={r.label} className="grid gap-x-4 gap-y-1.5 sm:grid-cols-[11rem_1fr] sm:items-center lg:grid-cols-[11rem_1fr_13rem]">
            <span className="text-sm font-semibold text-foreground sm:text-right">{r.label}</span>
            <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">{r.value || <span className="italic text-slate-400">{r.fallback}</span>}</span>
            <div className="sm:col-span-2 lg:col-span-1">{check(r.key, r.question)}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 border-t border-slate-100 pt-3 lg:grid lg:grid-cols-[11rem_1fr_13rem] lg:items-center lg:gap-x-4">
        <span className="hidden text-right text-sm font-semibold text-foreground lg:block">overall</span>
        <span className="hidden text-xs italic text-slate-400 lg:block">does the whole thing land?</span>
        {check("doesItClick", "Does it click?")}
      </div>
    </div>
  );
}
