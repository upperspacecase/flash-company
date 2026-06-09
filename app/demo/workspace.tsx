"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import {
  APPROACH_OPTIONS,
  CHOSEN_ID,
  COHORT,
  CONVERGENCE_SIGNALS,
  INTAKE,
  INTAKE_TOTAL,
  INVITE,
  LENSES,
  LIVED_PROBLEMS,
  MARKET_REPORT,
  NETWORK,
  OBSESSIONS,
  OPPORTUNITY_SPACES,
  PHASES,
  PRICE,
  RESEARCH_LENSES,
  REVENUE_MODELS,
  SCORECARD,
  SKILLS,
  SKILL_ENERGY,
  SPRINT,
  SYNTH_ROLES,
  TAGLINE,
  TARGET_MARKETS,
  VALIDATION,
  VENTURES,
  VENTURE_DETAILS,
  YOU,
  makeVentureDraft,
  memberById,
  revenueBuild,
  revenueDefaults,
  type DeckSlide,
  type IconName,
  type IntakeField,
  type IntakeQuestion,
  type IntakeSection,
  type Member,
  type NetworkNode,
  type ScorecardKey,
  type VentureDraft,
  type Votable,
} from "./data";

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
      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${done ? "bg-sage text-white" : "border border-slate-300 text-transparent"}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3"><path d="m5 12 5 5L20 7" /></svg>
      </span>
      <span className={done ? "text-slate-700" : "text-slate-400"}>{label}</span>
    </li>
  );
}
function Columns({ left, center, right }: { left: React.ReactNode; center: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <aside className="lg:w-72 lg:shrink-0">{left}</aside>
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
    <button onClick={onClick} className="inline-flex h-12 items-center gap-2 rounded-xl bg-sage px-6 text-sm font-bold text-white transition-colors hover:bg-sage-dark">
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
      <div className="mb-1 flex items-center justify-between text-xs"><span className="text-slate-500">{label}</span><span className="font-semibold text-sage-dark">{value}/5</span></div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-sage" style={{ width: `${(value / 5) * 100}%` }} /></div>
    </div>
  );
}
function Upsell({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-sage/30 bg-sage-tint/30 p-4">
      <p className="flex items-center gap-2 font-semibold text-foreground"><Icon name="lock" className="h-4 w-4 text-sage" /> {title}</p>
      <p className="mt-1 text-sm text-slate-600">{text}</p>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <a href="/demo" className="inline-flex h-11 items-center gap-2 rounded-xl bg-sage px-5 text-sm font-bold text-white transition-colors hover:bg-sage-dark"><Icon name="bolt" className="h-4 w-4" /> Unlock the Seed protocol</a>
        <a href="/#pricing" className="text-sm font-semibold text-sage-dark hover:underline">See pricing</a>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ the page */

export function DemoWorkspace({ plan }: { plan: "free" | "full" }) {
  const isFree = plan === "free";
  const [phase, setPhase] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [reached, setReached] = useState(0);
  const [ventureId, setVentureId] = useState(CHOSEN_ID);
  const [name, setName] = useState(VENTURE_DETAILS.name);
  const [recorded, setRecorded] = useState<Record<string, boolean>>(
    Object.fromEntries(VENTURE_DETAILS.commitments.map((c) => [c.memberId, c.recorded]))
  );
  const [checkin, setCheckin] = useState("Day 7");
  const [venture, setVenture] = useState<VentureDraft>(makeVentureDraft);
  const [published, setPublished] = useState(false);

  // Gating. Invite (0) is always open. Everything after it opens only once the
  // user has accepted (paid) AND finished the prior step — `reached` is the
  // high-water mark each phase's forward button advances. Accepting unlocks
  // Input; finishing Input unlocks Synthesis; and so on. Validation stays locked
  // on the free plan. Locked phases are still clickable — they show a greyed
  // preview so people sense the full process.
  const unlocked = (i: number) => i === 0 || (accepted && i <= reached && !(isFree && i >= 5));
  const advance = (i: number) => { setReached((r) => Math.max(r, i)); setPhase(i); };
  const accept = () => { setAccepted(true); setReached((r) => Math.max(r, 1)); };

  return (
    <div className="relative flex min-h-screen flex-col bg-black">
      <div className="pointer-events-none fixed inset-0 z-0 bg-grid" />
      <div className="relative z-10 flex flex-1 flex-col">
      <Header plan={plan} />
      <Timeline phase={phase} onJump={setPhase} unlocked={unlocked} reached={reached} />
      <main className="mx-auto w-full max-w-[1500px] flex-1 px-5 py-6">
        {!unlocked(phase) ? (
          <LockedPreview i={phase} accepted={accepted} isFree={isFree} onGoInvite={() => setPhase(0)} />
        ) : (
          <>
            {phase === 0 && <InvitePhase plan={plan} accepted={accepted} onAccept={accept} onStart={() => advance(1)} />}
            {phase === 1 && <InputPhase onNext={() => advance(2)} />}
            {phase === 2 && <SynthesisPhase onNext={() => advance(3)} />}
            {phase === 3 && <OpportunityPhase onNext={() => advance(4)} />}
            {phase === 4 && <VenturesPhase plan={plan} ventureId={ventureId} onSelect={setVentureId} name={name} onName={setName} venture={venture} onVenture={setVenture} recorded={recorded} onRecord={(id) => setRecorded((r) => ({ ...r, [id]: !r[id] }))} onNext={() => advance(5)} />}
            {!isFree && phase === 5 && <ValidationPhase name={name} venture={venture} onVenture={setVenture} checkin={checkin} onCheckin={setCheckin} published={published} onPublish={setPublished} />}
          </>
        )}
      </main>
      </div>
    </div>
  );
}

function Header({ plan }: { plan: "free" | "full" }) {
  const isFree = plan === "free";
  return (
    <header className="border-b border-slate-200 bg-white/5">
      <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-sage"><path d="M13 2 4.5 13.5H11l-1.5 8.5L20 9.5h-6.5L13 2Z" /></svg>
          <span className="text-lg font-bold tracking-tight text-foreground">Flash Company</span>
          <span className="hidden text-sm font-medium italic text-sage md:inline">{TAGLINE}</span>
        </Link>
        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden items-center gap-2 rounded-full bg-sage-tint px-3 py-1.5 text-xs font-semibold text-sage-dark sm:flex">
            <Icon name="clock" className="h-3.5 w-3.5" /> {isFree ? `Free · ${SPRINT.freeHours}h` : `${SPRINT.windowHours}h sprint`}
          </span>
          <div className="hidden items-center -space-x-2 sm:flex">{COHORT.map((m) => <Avatar key={m.id} m={m} />)}</div>
          <button className="inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Icon name="link" className="h-4 w-4" /> Invite</button>
        </div>
      </div>
    </header>
  );
}

function Timeline({ phase, onJump, unlocked, reached }: { phase: number; onJump: (n: number) => void; unlocked: (i: number) => boolean; reached: number }) {
  return (
    <nav className="border-b border-slate-200 bg-white/5">
      <ol className="mx-auto flex w-full max-w-[1500px] gap-2 overflow-x-auto px-5 py-3">
        {PHASES.map((p, i) => {
          const locked = !unlocked(i);
          const active = i === phase;
          const done = !locked && i < reached;
          return (
            <li key={p.id} className="flex flex-1 items-center gap-2">
              <button onClick={() => onJump(i)} className={`flex flex-1 items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors ${active ? "border-sage bg-sage-tint/40" : locked ? "border-transparent opacity-50 hover:opacity-80" : "border-transparent hover:bg-slate-50"}`}>
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${active ? "bg-sage text-white" : done ? "bg-sage/20 text-sage-dark" : "bg-slate-100 text-slate-400"}`}>
                  {locked ? <Icon name="lock" className="h-3 w-3" /> : i + 1}
                </span>
                <span className="min-w-0">
                  <span className={`block whitespace-nowrap text-sm font-semibold ${active ? "text-sage-dark" : "text-slate-600"}`}>{p.label}</span>
                </span>
              </button>
              {i < PHASES.length - 1 && <span className="hidden text-slate-300 lg:block">›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* -------------------------------------------------------- 0. Invite */
// The Invite page is the landing page — where you arrive when you sign up.
// Top to bottom: hero, how it works, invite your team, accept (-> payment),
// then who's accepted. Accepting routes through a held payment; once you've
// accepted you can start your input and preview the later (locked) steps.

const HOW_STEPS: { icon: IconName; title: string; text: string }[] = [
  { icon: "link", title: "Accept & invite", text: `${PRICE.currency}${PRICE.perPerson} each, up to three people. Just a link — no app, no account.` },
  { icon: "message", title: "Add your input", text: "Answer privately, by text or voice — about an hour to ninety minutes total, across two or three short sprints." },
  { icon: "sparkle", title: "Get your ventures", text: "Once everyone's input is in, the agent synthesises the three of you into ventures worth building — and the outline to test them." },
];

function InvitePhase({ plan, accepted, onAccept, onStart }: { plan: "free" | "full"; accepted: boolean; onAccept: () => void; onStart: () => void }) {
  const [payOpen, setPayOpen] = useState(false);
  const isFree = plan === "free";
  const handleAccept = () => (isFree ? onAccept() : setPayOpen(true));
  const acceptedCount = COHORT.filter((m) => (m.id === YOU ? accepted : m.accepted)).length;
  return (
    <div className="mx-auto max-w-3xl space-y-12 py-4">
      {/* 1 · Hero */}
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-sage">Kick-off</p>
        <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl">What could you and up to two others build together?</h1>
        <p className="mt-5 text-lg leading-relaxed text-slate-600">
          A {SPRINT.windowHours}-hour window. About an hour to ninety minutes of input from each of you, split across two or three short sprints. At the end, Flash hands you ventures the three of you are uniquely placed to build.
        </p>
      </section>

      {/* 2 · How it works */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">How it works</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-3">
          {HOW_STEPS.map((s) => (
            <div key={s.title}>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage-tint text-sage"><Icon name={s.icon} className="h-4 w-4" /></span>
              <p className="mt-3 text-sm font-bold text-foreground">{s.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3 · Invite your team */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Invite your team</h2>
        <p className="mt-1 text-sm text-slate-500">Up to three people. Share a link — no app, no account.</p>
        <div className="mt-4 rounded-xl border border-slate-200 p-4">
          <p className="mb-2 text-sm font-bold text-foreground">Shareable link</p>
          <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white/5 text-sage"><Icon name="link" className="h-4 w-4" /></span>
            <code className="min-w-0 flex-1 truncate text-sm text-slate-600">{INVITE.url}</code>
            <button className="inline-flex items-center gap-1.5 rounded-md bg-sage px-3 py-1.5 text-xs font-bold text-white"><Icon name="copy" className="h-3.5 w-3.5" /> Copy</button>
          </div>
          <p className="mt-2 text-xs text-slate-400">{INVITE.note}</p>
        </div>
      </section>

      {/* 4 · Accept -> payment */}
      <section>
        {accepted ? (
          <div className="rounded-2xl border border-sage/40 bg-sage-tint/20 p-6">
            <p className="flex items-center gap-2 text-lg font-bold text-foreground"><Icon name="check" className="h-5 w-5 text-sage" /> You&rsquo;re in.</p>
            <p className="mt-1.5 text-sm text-slate-600">Your {PRICE.currency}{PRICE.perPerson} is held until the team&rsquo;s complete — fully refunded if everyone doesn&rsquo;t accept within {SPRINT.windowHours} hours. Start your input now; synthesis runs once all three of you are in.</p>
            <div className="mt-5"><PrimaryBtn label="Start your input" onClick={onStart} icon="bolt" /></div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white/5 p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground">Accept your invite</p>
                <p className="mt-1 text-sm text-slate-500">{isFree ? "Free to start — invite up to three and run a single session." : `${PRICE.currency}${PRICE.perPerson} per person, held until the whole team accepts. If everyone doesn't accept within ${SPRINT.windowHours} hours, it's refunded in full.`}</p>
              </div>
              {!isFree && <p className="shrink-0 text-right"><span className="text-3xl font-extrabold text-foreground">{PRICE.currency}{PRICE.perPerson}</span> <span className="text-xs text-slate-400">/ person</span></p>}
            </div>
            <div className="mt-5"><PrimaryBtn label="Accept invite to get started" onClick={handleAccept} icon={isFree ? "bolt" : "coins"} /></div>
          </div>
        )}
      </section>

      {/* 5 · Who's accepted */}
      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Who&rsquo;s accepted</h2>
          <span className="text-xs text-slate-400">{acceptedCount} of {COHORT.length} in</span>
        </div>
        <ul className="mt-4 space-y-2.5">
          {COHORT.map((m) => {
            const isYou = m.id === YOU;
            const has = isYou ? accepted : m.accepted;
            return (
              <li key={m.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                <Avatar m={m} />
                <div className="min-w-0 flex-1"><p className="font-semibold text-foreground">{m.name} {isYou && <span className="text-xs font-normal text-slate-400">(you)</span>}</p><p className="truncate text-xs text-slate-500">{m.role} · {m.brings}</p></div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${has ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{has ? "Accepted" : "Pending"}</span>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-xs text-slate-400">{INVITE.forms}</p>
      </section>

      {payOpen && <PaymentModal onClose={() => setPayOpen(false)} onPaid={() => { setPayOpen(false); onAccept(); }} />}
    </div>
  );
}

// Accepting the invite routes through payment. The buy-in is charged now and
// held until the whole team accepts (auto-refunded otherwise). Mock only.
function PaymentModal({ onClose, onPaid }: { onClose: () => void; onPaid: () => void }) {
  const amount = `${PRICE.currency}${PRICE.perPerson}`;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-slate-100 p-6 shadow-xl">
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
          <div className="flex items-center justify-between text-sm"><span className="text-slate-500">Your buy-in</span><span className="font-bold text-foreground">{amount}</span></div>
          <div className="flex items-center justify-between text-sm"><span className="text-slate-500">Charged now</span><span className="font-semibold text-foreground">{amount}</span></div>
          <p className="flex items-start gap-2 border-t border-slate-200 pt-2 text-xs text-slate-500"><Icon name="shield" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage" /> Held until your whole team accepts. If everyone doesn&rsquo;t accept within {SPRINT.windowHours} hours, you&rsquo;re refunded in full.</p>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 p-3">
          <Icon name="coins" className="h-4 w-4 shrink-0 text-slate-400" />
          <span className="text-sm text-slate-400">Card details</span>
          <span className="ml-auto text-xs text-slate-300">•••• 4242</span>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button onClick={onPaid} className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-sage text-sm font-bold text-white transition-colors hover:bg-sage-dark"><Icon name="check" className="h-4 w-4" /> Pay {amount} &amp; accept</button>
          <button onClick={onClose} className="h-12 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50">Cancel</button>
        </div>
        <p className="mt-3 text-center text-[11px] text-slate-400">Prototype — no real payment is taken.</p>
      </div>
    </div>
  );
}

// A later step viewed before it's unlocked: a greyed teaser + why it's locked.
function LockedPreview({ i, accepted, isFree, onGoInvite }: { i: number; accepted: boolean; isFree: boolean; onGoInvite: () => void }) {
  const p = PHASES[i];
  const seedLock = isFree && i >= 5;
  const reason = !accepted
    ? "Accept your invite to get started — then the sprint opens up, step by step."
    : seedLock
      ? "Validation is part of the Seed protocol."
      : i === 2
        ? "Synthesis runs once everyone's input is in."
        : `Opens once you've finished ${PHASES[i - 1].label}.`;
  return (
    <div className="relative mx-auto max-w-5xl">
      <div aria-hidden className="pointer-events-none select-none space-y-4 opacity-40 blur-[2px] grayscale">
        <Card className="p-5">
          <div className="h-6 w-44 rounded bg-slate-200" />
          <div className="mt-2 h-3 w-72 rounded bg-slate-100" />
        </Card>
        <div className="grid gap-4 sm:grid-cols-2">
          {[0, 1, 2, 3].map((n) => (
            <Card key={n} className="p-4">
              <div className="h-3 w-24 rounded bg-slate-200" />
              <div className="mt-2 h-3 w-full rounded bg-slate-100" />
              <div className="mt-1.5 h-3 w-5/6 rounded bg-slate-100" />
            </Card>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 p-4 backdrop-blur-[1px]">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-slate-100 p-6 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sage-tint text-sage"><Icon name="lock" className="h-5 w-5" /></span>
          <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-slate-400">Step {i + 1}</p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-foreground">{p.label}</h2>
          <p className="mt-2 text-sm text-slate-500">{p.blurb}</p>
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500"><Icon name="lock" className="h-3 w-3" /> {reason}</p>
          {!accepted ? (
            <div className="mt-5 flex justify-center"><PrimaryBtn label="Accept your invite" onClick={onGoInvite} icon="bolt" /></div>
          ) : seedLock ? (
            <div className="mt-5"><a href="/demo" className="inline-flex h-11 items-center gap-2 rounded-xl bg-sage px-5 text-sm font-bold text-white transition-colors hover:bg-sage-dark"><Icon name="bolt" className="h-4 w-4" /> Unlock the Seed protocol</a></div>
          ) : null}
        </div>
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

function InputPhase({ onNext }: { onNext: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [voiceMode, setVoiceMode] = useState<Record<string, boolean>>({});
  const done = step >= INTAKE_FLOW.length;
  const cur = done ? null : INTAKE_FLOW[step];
  const isVoice = (id: string) => !!voiceMode[id];
  const update = (id: string, value: unknown) => setAnswers((a) => ({ ...a, [id]: value }));
  const answeredIn = (s: IntakeSection) => s.questions.filter((q) => isAnswered(answers[q.id]) || isVoice(q.id)).length;
  const curSi = cur ? cur.si : INTAKE.length - 1;
  const canSend = !!cur && (isAnswered(answers[cur.q.id]) || isVoice(cur.q.id) || cur.q.field.kind === "slider");
  return (
    <Columns
      left={<IntakeNav curSi={curSi} answeredIn={answeredIn} />}
      center={
        <Card className="flex h-full flex-col p-6">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sage text-white"><FlashMark className="h-4 w-4" /></span>
              <div><p className="text-sm font-bold text-foreground">Flash</p><p className="text-xs text-slate-400">Tell me about yourself — type, talk, or tap.</p></div>
            </div>
            <span className="rounded-full bg-sage-tint px-3 py-1 text-xs font-semibold text-sage-dark">{Math.min(step, INTAKE_FLOW.length)}/{INTAKE_TOTAL}</span>
          </div>

          <div className="flex-1 space-y-4">
            {INTAKE_FLOW.slice(0, step + 1).map((item, i) => (
              <Fragment key={item.q.id}>
                {item.first && <SectionIntro index={item.si} title={item.title} blurb={item.blurb} />}
                <AgentBubble q={item.q} />
                {i < step && <UserAnswer field={item.q.field} value={answers[item.q.id]} voice={isVoice(item.q.id)} />}
              </Fragment>
            ))}
            {done && <AgentBubble text="That's everything. Whenever you're ready, I'll synthesise all three of you." />}
          </div>

          <div className="mt-5 border-t border-slate-100 pt-4">
            {done ? (
              <div className="flex items-center justify-between gap-4 rounded-xl bg-sage-tint/40 p-3">
                <p className="text-sm font-semibold text-sage-dark">Submitted — private until the team synthesis runs.</p>
                <PrimaryBtn label="Run synthesis" onClick={onNext} icon="sparkle" />
              </div>
            ) : cur ? (
              <Composer key={cur.q.id} q={cur.q} value={answers[cur.q.id]} onChange={(v) => update(cur.q.id, v)} voice={isVoice(cur.q.id)} onVoice={() => setVoiceMode((m) => ({ ...m, [cur.q.id]: !m[cur.q.id] }))} canSend={canSend} onSend={() => setStep((s) => s + 1)} />
            ) : null}
          </div>
        </Card>
      }
      right={
        <div className="space-y-4">
          <RailTitle>How input works</RailTitle>
          <Card><p className="text-sm text-slate-600"><span className="font-semibold text-foreground">Just dump it.</span> No wrong answers — get it down, refine later.</p></Card>
          <Card><p className="text-sm text-slate-600"><span className="font-semibold text-foreground">Type, talk, or tap.</span> Each question picks the easiest way to answer.</p></Card>
          <Card><p className="text-sm text-slate-600"><span className="font-semibold text-foreground">Private.</span> Your answers stay yours until the team synthesis runs.</p></Card>
          <Card className="bg-sage-tint/30"><p className="flex items-center gap-2 text-sm font-bold text-foreground"><Icon name="clock" className="h-4 w-4 text-sage" /> Deadline</p><p className="mt-1 text-sm text-slate-600">12 hours from team formation.</p></Card>
        </div>
      }
    />
  );
}

function IntakeNav({ curSi, answeredIn }: { curSi: number; answeredIn: (s: IntakeSection) => number }) {
  const youDone = INTAKE.reduce((n, s) => n + answeredIn(s), 0);
  const team = [
    { id: "maya", done: youDone, you: true },
    { id: "alex", done: INTAKE_TOTAL, you: false },
    { id: "priya", done: 19, you: false },
  ];
  return (
    <div className="space-y-4 lg:sticky lg:top-4">
      <RailTitle>Your intake</RailTitle>
      <p className="px-1 text-xs text-slate-400">Six sections, conversational. Anonymous until synthesis.</p>
      <div className="space-y-1.5">
        {INTAKE.map((s, i) => {
          const a = answeredIn(s);
          const complete = a === s.questions.length && i < curSi;
          const active = i === curSi;
          return (
            <div key={s.id} className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${active ? "border-sage bg-sage-tint/30" : "border-transparent"}`}>
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${complete ? "bg-sage text-white" : active ? "bg-sage/20 text-sage-dark" : "bg-slate-100 text-slate-400"}`}>{complete ? <Icon name="check" className="h-3 w-3" /> : i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className={`block truncate text-sm font-semibold ${active ? "text-sage-dark" : "text-slate-600"}`}>{s.title}</span>
                <span className="block text-[11px] text-slate-400">{a}/{s.questions.length}</span>
              </span>
            </div>
          );
        })}
      </div>
      <div className="space-y-2.5 rounded-xl border border-slate-200 p-3">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Team progress</p>
        {team.map((t) => {
          const m = memberById(t.id);
          const pct = Math.round((t.done / INTAKE_TOTAL) * 100);
          return (
            <div key={t.id} className="flex items-center gap-2.5">
              <Avatar m={m} size="h-7 w-7 text-[10px]" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">{m.name}{t.you && <span className="font-normal text-slate-400"> (you)</span>}</span>
                  <span className="tabular-nums text-slate-400">{t.done}/{INTAKE_TOTAL}</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-sage" style={{ width: `${pct}%` }} /></div>
              </div>
            </div>
          );
        })}
      </div>
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

function AgentBubble({ q, text }: { q?: IntakeQuestion; text?: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sage text-white"><FlashMark className="h-3.5 w-3.5" /></span>
      <div className="max-w-lg rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-2.5">
        <p className="text-sm text-slate-700">{q ? q.q : text}</p>
        {q?.help && <p className="mt-1 text-xs text-slate-400">{q.help}</p>}
        {q && isVoiceable(q.field) && <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-sage-dark"><Icon name="mic" className="h-3 w-3" /> Voice or text</p>}
      </div>
    </div>
  );
}

function UserAnswer({ field, value, voice }: { field: IntakeField; value: unknown; voice: boolean }) {
  const text = formatAnswer(field, value);
  return (
    <div className="flex justify-end">
      <div className="max-w-lg rounded-2xl rounded-tr-sm bg-sage px-4 py-2.5 text-sm text-white">
        {voice && <span className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-white/80"><Icon name="mic" className="h-3.5 w-3.5" /> voice memo</span>}
        <span className="whitespace-pre-line">{text || (voice ? "Voice memo (demo)" : "—")}</span>
      </div>
    </div>
  );
}

function formatAnswer(f: IntakeField, v: unknown): string {
  switch (f.kind) {
    case "short":
    case "long":
    case "location":
      return asStr(v);
    case "slider":
      return `${typeof v === "number" ? v : f.min} ${f.unit ?? ""}`.trim();
    case "multiSelect": {
      const m = asMulti(v);
      const sel = m.sel.filter((x) => x !== "Other");
      if (m.sel.includes("Other") && m.other) sel.push(m.other);
      return sel.join(", ");
    }
    case "ranked": {
      const r = asRanked(v);
      return [r.ranked.join(" › "), r.note].filter(Boolean).join(" — ");
    }
  }
  return "";
}

// The chat composer: renders the right input control for the current question.
function Composer({ q, value, onChange, voice, onVoice, canSend, onSend }: { q: IntakeQuestion; value: unknown; onChange: (v: unknown) => void; voice: boolean; onVoice: () => void; canSend: boolean; onSend: () => void }) {
  const f = q.field;
  const label = canSend ? "Send" : q.optional ? "Skip" : "Send";
  return (
    <div>
      <div className="mb-3">
        {(f.kind === "short" || f.kind === "long") && <TextControl value={asStr(value)} onChange={onChange} max={f.max} placeholder={f.placeholder} multiline={f.kind === "long"} voiceable={f.voice} voice={voice} onVoice={onVoice} onEnter={canSend ? onSend : undefined} />}
        {f.kind === "slider" && <SliderControl value={typeof value === "number" ? value : f.min} onChange={onChange} min={f.min} max={f.max} step={f.step} unit={f.unit} />}
        {f.kind === "location" && <LocationControl value={asStr(value)} onChange={onChange} placeholder={f.placeholder} />}
        {f.kind === "multiSelect" && <MultiSelectControl value={asMulti(value)} onChange={onChange} options={f.options} allowOther={f.allowOther} />}
        {f.kind === "ranked" && <RankedControl value={asRanked(value)} onChange={onChange} options={f.options} />}
      </div>
      <div className="flex items-center justify-end">
        <button onClick={onSend} disabled={!canSend && !q.optional} className="inline-flex h-11 items-center gap-2 rounded-xl bg-sage px-5 text-sm font-bold text-white transition-colors hover:bg-sage-dark disabled:opacity-40">{label} <Icon name="send" className="h-4 w-4" /></button>
      </div>
    </div>
  );
}

function TextControl({ value, onChange, max, placeholder, multiline, voiceable, voice, onVoice, onEnter }: { value: string; onChange: (v: string) => void; max?: number; placeholder?: string; multiline?: boolean; voiceable?: boolean; voice?: boolean; onVoice: () => void; onEnter?: () => void }) {
  if (voiceable && voice) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-sage bg-sage-tint/20 p-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage text-white"><Icon name="mic" className="h-4 w-4" /></span>
        <div className="min-w-0 flex-1">
          <div className="flex items-end gap-0.5">{Array.from({ length: 28 }).map((_, i) => <span key={i} className="w-1 rounded-full bg-sage/50" style={{ height: `${5 + ((i * 11) % 16)}px` }} />)}</div>
          <p className="mt-1 text-xs text-slate-500">Recording · 0:00 / 2:00 <span className="text-slate-400">(demo)</span></p>
        </div>
        <button onClick={onVoice} className="shrink-0 text-xs font-semibold text-sage-dark hover:underline">Type instead</button>
      </div>
    );
  }
  return (
    <div>
      <div className="relative">
        {multiline
          ? <textarea value={value} onChange={(e) => onChange(e.target.value)} maxLength={max} rows={3} placeholder={placeholder} className="w-full resize-y rounded-xl border border-slate-200 p-3 pr-10 text-sm text-foreground focus:border-sage focus:outline-none" />
          : <input value={value} onChange={(e) => onChange(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onEnter?.(); } }} maxLength={max} placeholder={placeholder} className="w-full rounded-xl border border-slate-200 p-3 pr-10 text-sm text-foreground focus:border-sage focus:outline-none" />}
        {voiceable && <button onClick={onVoice} aria-label="Record voice memo" className="absolute right-2 top-2.5 flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-sage"><Icon name="mic" className="h-4 w-4" /></button>}
      </div>
      {max && <p className="mt-1 text-right text-[11px] text-slate-400">{value.length}/{max}</p>}
    </div>
  );
}

function SliderControl({ value, onChange, min, max, step, unit }: { value: number; onChange: (v: number) => void; min: number; max: number; step: number; unit?: string }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline gap-1.5"><span className="text-2xl font-bold tabular-nums text-foreground">{value}{value === max && "+"}</span>{unit && <span className="text-sm text-slate-500">{unit}</span>}</div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-sage" />
      <div className="mt-1 flex justify-between text-[11px] text-slate-400"><span>{min}</span><span>{max}+</span></div>
    </div>
  );
}

function LocationControl({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-200 p-3 focus-within:border-sage">
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
        {items.map((o) => { const on = value.sel.includes(o); return <button key={o} onClick={() => toggle(o)} className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${on ? "border-sage bg-sage text-white" : "border-slate-200 text-slate-600 hover:border-sage/50"}`}>{o}</button>; })}
      </div>
      {allowOther && value.sel.includes("Other") && <input value={value.other} onChange={(e) => onChange({ ...value, other: e.target.value })} placeholder="Tell us more" className="mt-2 w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-sage focus:outline-none" />}
    </div>
  );
}

function RankedControl({ value, onChange, options }: { value: RankedVal; onChange: (v: RankedVal) => void; options: string[] }) {
  const toggle = (o: string) => onChange({ ...value, ranked: value.ranked.includes(o) ? value.ranked.filter((x) => x !== o) : [...value.ranked, o] });
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => { const idx = value.ranked.indexOf(o); const on = idx >= 0; return (
          <button key={o} onClick={() => toggle(o)} className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${on ? "border-sage bg-sage text-white" : "border-slate-200 text-slate-600 hover:border-sage/50"}`}>
            {on && <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/5 text-[10px] text-sage-dark">{idx + 1}</span>}{o}
          </button>
        ); })}
      </div>
      <input value={value.note} onChange={(e) => onChange({ ...value, note: e.target.value })} placeholder="Anything to add" className="mt-2 w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-sage focus:outline-none" />
    </div>
  );
}

/* ----------------------------------------------------- 2. Synthesis */

function SynthesisPhase({ onNext }: { onNext: () => void }) {
  const [energy, setEnergy] = useState<Record<string, number[]>>(() => ({ maya: [...SKILL_ENERGY.maya], alex: [...SKILL_ENERGY.alex], priya: [...SKILL_ENERGY.priya] }));
  const [shown, setShown] = useState<Record<string, boolean>>({ team: true, maya: false, alex: false, priya: false });
  const [editId, setEditId] = useState("maya");
  const [roles, setRoles] = useState(SYNTH_ROLES.map((r) => ({ ...r })));
  const [industries, setIndustries] = useState<NetworkNode[]>(NETWORK.filter((n) => n.kind === "industry").map((n) => ({ ...n })));
  const [locations, setLocations] = useState<NetworkNode[]>(NETWORK.filter((n) => n.kind === "location").map((n) => ({ ...n })));
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState<Record<string, boolean>>({ skills: true });
  const [problems, setProblems] = useState<Votable[]>(LIVED_PROBLEMS.map((p) => ({ ...p })));
  const [obsessions, setObsessions] = useState<Votable[]>(OBSESSIONS.map((p) => ({ ...p })));
  const [markets, setMarkets] = useState<Votable[]>(TARGET_MARKETS.map((p) => ({ ...p })));

  const toggleConfirm = (k: string) => setConfirmed((c) => ({ ...c, [k]: !c[k] }));
  const toggleOpen = (k: string) => setOpen((o) => ({ ...o, [k]: !o[k] }));
  const rolesConfirmed = roles.every((r) => confirmed[r.memberId]);

  return (
    <Columns
      left={
        <div className="space-y-4">
          <RailTitle>Steps</RailTitle>
          {[
            { t: "Review input", d: "All three intakes read.", done: true },
            { t: "Team", d: "Confirm energy, network, roles." },
            { t: "Focus", d: "Add, edit, veto problems & markets." },
          ].map((s) => (
            <Card key={s.t}>
              <div className="flex items-center gap-3">
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${s.done ? "bg-sage text-white" : "bg-slate-100 text-slate-400"}`}>{s.done ? <Icon name="check" className="h-3 w-3" /> : ""}</span>
                <div><p className="text-sm font-bold text-foreground">{s.t}</p><p className="text-xs text-slate-500">{s.d}</p></div>
              </div>
            </Card>
          ))}
        </div>
      }
      center={
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <CountdownBadge />
            <p className="hidden text-xs text-slate-400 sm:block">Lists keep updating as people edit. Run over and it just shows late — no hard block.</p>
          </div>

          <Card className="p-5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Synthesis</h1>
            <p className="mt-1 text-slate-500">The agent read all three intakes. Confirm who you are, then narrow to a focus.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {CONVERGENCE_SIGNALS.map((s) => (
                <span key={s.kind} className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${s.tone === "warn" ? "bg-amber-50 text-amber-700" : "bg-sage-tint/40 text-sage-dark"}`}><Icon name={s.icon} className="h-3.5 w-3.5" />{s.kind}</span>
              ))}
            </div>
          </Card>

          <Part label="Team" hint="Confirm your profile — add, edit, confirm. Nothing's removed here.">
            <div className="space-y-3">
              <ConfirmItem title="Skills & energy" hint="Tap a dot to adjust — outer energises, inner drains." open={open.skills} onToggle={() => toggleOpen("skills")} confirmed={confirmed.skills} onConfirm={() => toggleConfirm("skills")}>
                <SkillRadar energy={energy} shown={shown} onToggle={(k) => setShown((s) => ({ ...s, [k]: !s[k] }))} editId={editId} onEdit={(id) => { setEditId(id); setShown((s) => ({ ...s, [id]: true })); }} onEnergy={(id, i, val) => setEnergy((e) => ({ ...e, [id]: e[id].map((x, idx) => (idx === i ? val : x)) }))} />
              </ConfirmItem>
              <ConfirmItem title="Network" hint="Industries you can talk to." open={open.network} onToggle={() => toggleOpen("network")} confirmed={confirmed.network} onConfirm={() => toggleConfirm("network")}>
                <NetworkList nodes={industries} onNodes={setIndustries} kind="industry" icon="building" addLabel="industry" />
              </ConfirmItem>
              <ConfirmItem title="Locations" hint="Where you can reach and meet." open={open.locations} onToggle={() => toggleOpen("locations")} confirmed={confirmed.locations} onConfirm={() => toggleConfirm("locations")}>
                <NetworkList nodes={locations} onNodes={setLocations} kind="location" icon="target" addLabel="location" />
              </ConfirmItem>
              <ConfirmItem title="Roles & tasks" hint="Confirm each person's role." open={open.roles} onToggle={() => toggleOpen("roles")} confirmed={rolesConfirmed}>
                <RolesTasks roles={roles} onRoles={setRoles} confirmed={confirmed} onConfirm={toggleConfirm} />
              </ConfirmItem>
            </div>
          </Part>

          <Part label="Focus" hint="Narrow the focus — add, edit, or veto. No voting yet; that happens at Opportunity Spaces.">
            <Section title="Lived problems">
              <VotableList items={problems} onItems={setProblems} addLabel="problem" />
            </Section>
            <Section title="Obsessions & moonshots">
              <VotableList items={obsessions} onItems={setObsessions} addLabel="obsession" />
            </Section>
            <Section title="Potential target markets">
              <VotableList items={markets} onItems={setMarkets} addLabel="market" />
            </Section>
          </Part>

          <div className="flex justify-end"><PrimaryBtn label="Agree opportunity spaces" onClick={onNext} icon="sparkle" /></div>
        </div>
      }
    />
  );
}

// A confirmable, collapsible Team item: add / edit / confirm. No delete or veto.
function ConfirmItem({ title, hint, open, onToggle, confirmed, onConfirm, children }: { title: string; hint?: string; open: boolean; onToggle: () => void; confirmed?: boolean; onConfirm?: () => void; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white/5">
      <div className="flex items-center gap-2 p-3">
        <button onClick={onToggle} className="flex min-w-0 flex-1 items-center gap-2.5 text-left">
          <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${confirmed ? "bg-sage text-white" : "bg-slate-100 text-slate-400"}`}>{confirmed ? <Icon name="check" className="h-3 w-3" /> : <Icon name="user" className="h-3 w-3" />}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold text-foreground">{title}</span>
            {hint && <span className="block truncate text-xs text-slate-400">{hint}</span>}
          </span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={`h-4 w-4 shrink-0 text-slate-300 transition-transform ${open ? "rotate-180" : ""}`}><path d="m6 9 6 6 6-6" /></svg>
        </button>
        {onConfirm && (
          <button onClick={onConfirm} className={`inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors ${confirmed ? "bg-sage text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}><Icon name={confirmed ? "check" : "thumb"} className="h-3.5 w-3.5" />{confirmed ? "Confirmed" : "Confirm"}</button>
        )}
      </div>
      {open && <div className="border-t border-slate-100 p-4">{children}</div>}
    </div>
  );
}

// Editable network nodes (industries or locations). Add / edit only — no delete.
function NetworkList({ nodes, onNodes, kind, icon, addLabel }: { nodes: NetworkNode[]; onNodes: (n: NetworkNode[]) => void; kind: NetworkNode["kind"]; icon: IconName; addLabel: string }) {
  const setNode = (idx: number, patch: Partial<NetworkNode>) => onNodes(nodes.map((n, i) => (i === idx ? { ...n, ...patch } : n)));
  return (
    <div className="space-y-2">
      {nodes.map((node, idx) => (
        <div key={idx} className="rounded-xl border border-slate-200 p-3">
          <div className="flex items-center gap-2">
            <Icon name={icon} className="h-4 w-4 shrink-0 text-sage" />
            <input value={node.name} onChange={(e) => setNode(idx, { name: e.target.value })} placeholder={`Add ${addLabel}…`} className="-mx-1 min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-1.5 py-1 text-sm font-semibold text-foreground hover:border-slate-200 focus:border-sage focus:bg-white/5 focus:outline-none" />
            {node.members.length > 0 && <div className="ml-auto flex -space-x-1.5">{node.members.map((id) => <Avatar key={id} m={memberById(id)} size="h-6 w-6 text-[9px]" />)}</div>}
          </div>
          <input value={node.opportunity} onChange={(e) => setNode(idx, { opportunity: e.target.value })} placeholder="What's the opportunity here?" className="-mx-1 mt-1.5 w-full rounded-md border border-transparent bg-transparent px-1.5 py-1 text-sm text-slate-600 hover:border-slate-200 focus:border-sage focus:bg-white/5 focus:outline-none" />
        </div>
      ))}
      <button onClick={() => onNodes([...nodes, { name: "", kind, members: [], opportunity: "" }])} className="text-sm font-semibold text-sage-dark hover:underline">+ Add {addLabel}</button>
    </div>
  );
}

function CountdownBadge() {
  const [s, setS] = useState(23 * 3600 + 47 * 60 + 12);
  useEffect(() => {
    const id = setInterval(() => setS((x) => (x > 0 ? x - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const p = (n: number) => String(n).padStart(2, "0");
  if (s <= 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700">
        <Icon name="clock" className="h-4 w-4" /> Window closed · late
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-sm font-bold tabular-nums text-amber-700">
      <Icon name="clock" className="h-4 w-4" /> {p(Math.floor(s / 3600))}:{p(Math.floor((s % 3600) / 60))}:{p(s % 60)} left
    </span>
  );
}

const MEMBER_COLOR: Record<string, string> = { maya: "#10b981", alex: "#0ea5e9", priya: "#f59e0b" };
const TEAM_COLOR = "#6f8f5f";

function SkillRadar({ energy, shown, onToggle, editId, onEdit, onEnergy }: { energy: Record<string, number[]>; shown: Record<string, boolean>; onToggle: (k: string) => void; editId: string; onEdit: (id: string) => void; onEnergy: (id: string, i: number, val: number) => void }) {
  const n = SKILLS.length, cx = 130, cy = 128, R = 88, max = 5;
  const pt = (i: number, val: number): [number, number] => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = (val / max) * R;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };
  // Team = the outer envelope: the best of everyone on each skill.
  const team = SKILLS.map((_, i) => Math.max(...COHORT.map((m) => energy[m.id][i])));
  const polyStr = (vals: number[]) => vals.map((v, i) => { const [x, y] = pt(i, v); return `${x.toFixed(1)},${y.toFixed(1)}`; }).join(" ");
  const toggles = [{ id: "team", name: "Team", color: TEAM_COLOR }, ...COHORT.map((m) => ({ id: m.id, name: m.name, color: MEMBER_COLOR[m.id] }))];
  return (
    <div className="grid items-start gap-4 lg:grid-cols-2">
      <svg viewBox="0 0 260 260" className="mx-auto w-full max-w-[300px]">
        {[1, 2, 3, 4, 5].map((ring) => <polygon key={ring} points={polyStr(SKILLS.map(() => ring))} fill="none" stroke="#e2e8f0" strokeWidth="1" />)}
        {SKILLS.map((label, i) => {
          const [x, y] = pt(i, max);
          const [lx, ly] = pt(i, max + 0.85);
          return (
            <g key={label}>
              <line x1={cx} y1={cy} x2={x} y2={y} stroke="#e2e8f0" strokeWidth="1" />
              <text x={lx} y={ly} fontSize="7.5" fill="#64748b" textAnchor={lx > cx + 6 ? "start" : lx < cx - 6 ? "end" : "middle"} dominantBaseline="middle">{label}</text>
            </g>
          );
        })}
        {shown.team && <polygon points={polyStr(team)} fill="rgba(111,143,95,0.15)" stroke={TEAM_COLOR} strokeWidth="2" />}
        {COHORT.map((m) => shown[m.id] && <polygon key={m.id} points={polyStr(energy[m.id])} fill="none" stroke={MEMBER_COLOR[m.id]} strokeWidth="2" />)}
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
        <p className="mt-2 text-[11px] text-slate-400">Outer = energises (create), inner = drains. Team is the outer envelope — the best of everyone on each skill.</p>

        <div className="mt-4 rounded-xl border border-sage/30 bg-sage-tint/15 p-3">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-sage-dark">
            <Icon name="bolt" className="h-3.5 w-3.5" /> Adjust energy
            <span className="ml-auto rounded-full bg-sage-tint px-2 py-0.5 text-[10px] font-semibold normal-case tracking-normal text-sage-dark">Editable</span>
          </p>
          <p className="mt-1 text-[11px] text-slate-500">Pick a person, then tap the dots to set each skill 0–5.</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {COHORT.map((m) => {
              const on = editId === m.id;
              return <button key={m.id} onClick={() => onEdit(m.id)} className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${on ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: MEMBER_COLOR[m.id] }} />{m.name}</button>;
            })}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5">
            {SKILLS.map((label, i) => <DotScore key={label} label={label} value={energy[editId][i]} onChange={(val) => onEnergy(editId, i, val)} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function RolesTasks({ roles, onRoles, confirmed, onConfirm }: { roles: typeof SYNTH_ROLES; onRoles: (r: typeof SYNTH_ROLES) => void; confirmed: Record<string, boolean>; onConfirm: (id: string) => void }) {
  const setRole = (id: string, patch: Partial<(typeof SYNTH_ROLES)[number]>) => onRoles(roles.map((r) => (r.memberId === id ? { ...r, ...patch } : r)));
  return (
    <div className="space-y-2">
      {roles.map((r) => {
        const m = memberById(r.memberId);
        const ok = confirmed[r.memberId];
        return (
          <div key={r.memberId} className="rounded-xl border border-slate-200 p-3">
            <div className="flex items-center gap-2">
              <Avatar m={m} size="h-8 w-8 text-[10px]" />
              <input value={r.role} onChange={(e) => setRole(r.memberId, { role: e.target.value })} className="-mx-1 min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-1.5 py-1 text-sm font-semibold text-foreground hover:border-slate-200 focus:border-sage focus:bg-white/5 focus:outline-none" />
              <button onClick={() => onConfirm(r.memberId)} className={`inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors ${ok ? "bg-sage text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}><Icon name={ok ? "check" : "thumb"} className="h-3.5 w-3.5" />{ok ? "Confirmed" : "Confirm"}</button>
            </div>
            <input value={r.tasks} onChange={(e) => setRole(r.memberId, { tasks: e.target.value })} className="-mx-1 mt-1.5 w-full rounded-md border border-transparent bg-transparent px-1.5 py-1 text-xs text-slate-600 hover:border-slate-200 focus:border-sage focus:bg-white/5 focus:outline-none" />
          </div>
        );
      })}
    </div>
  );
}

function VotableList({ items, onItems, addLabel }: { items: Votable[]; onItems: (v: Votable[]) => void; addLabel: string }) {
  const [seq, setSeq] = useState(0);
  const setText = (id: string, text: string) => onItems(items.map((i) => (i.id === id ? { ...i, text } : i)));
  return (
    <div>
      <p className="-mt-1 mb-2 text-xs text-slate-400">Derived from your inputs — edit freely, or veto what doesn&rsquo;t fit. No voting yet; that&rsquo;s next.</p>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2 rounded-xl border border-slate-200 p-2.5">
            <input value={item.text} onChange={(e) => setText(item.id, e.target.value)} placeholder={`Add a ${addLabel}…`} className="min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-1.5 py-1 text-sm text-foreground hover:border-slate-200 focus:border-sage focus:bg-white/5 focus:outline-none" />
            <button onClick={() => onItems(items.filter((i) => i.id !== item.id))} aria-label={`Veto ${addLabel}`} className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-bold text-slate-400 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"><Icon name="minus" className="h-3.5 w-3.5" />Veto</button>
          </div>
        ))}
      </div>
      <button onClick={() => { onItems([...items, { id: `c${seq}`, text: "", votes: 0 }]); setSeq(seq + 1); }} className="mt-2 text-sm font-semibold text-sage-dark hover:underline">+ Add a {addLabel}</button>
    </div>
  );
}

function FiveWhys({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const v = value.length === 5 ? value : ["", "", "", "", ""];
  return (
    <div className="mt-2 space-y-1.5 rounded-lg bg-slate-50 p-3">
      <p className="text-[11px] font-semibold text-slate-400">5 Whys — private to you. Keep asking &ldquo;why?&rdquo; to the root cause.</p>
      {v.map((w, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-11 shrink-0 text-[11px] font-bold text-sage-dark">Why {i + 1}</span>
          <input value={w} onChange={(e) => onChange(v.map((x, idx) => (idx === i ? e.target.value : x)))} placeholder={i === 0 ? "Why is this a problem?" : "…and why is that?"} className="flex-1 rounded-md border border-slate-200 px-2 py-1 text-sm focus:border-sage focus:outline-none" />
        </div>
      ))}
    </div>
  );
}


/* ------------------------------------------- 2b. Opportunity (spaces → research → birth) */

function OpportunityPhase({ onNext }: { onNext: () => void }) {
  const spaces = [...OPPORTUNITY_SPACES].sort((a, b) => b.votes - a.votes);
  const [spaceId, setSpaceId] = useState(spaces[0].id);
  const [whys, setWhys] = useState<Record<string, string[]>>({});
  const [whysOpen, setWhysOpen] = useState(false);
  const agreed = OPPORTUNITY_SPACES.find((s) => s.id === spaceId) ?? spaces[0];
  return (
    <Columns
      left={
        <div className="space-y-4">
          <RailTitle>Stages</RailTitle>
          {[
            { t: "Opportunity spaces", d: "Agree the broad space.", n: "1" },
            { t: "Market research", d: "PESTLE's six dimensions.", n: "2" },
            { t: "Angles", d: "Lenses on the opportunity.", n: "3" },
          ].map((s) => (
            <Card key={s.t}><div className="flex items-center gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sage-tint text-xs font-bold text-sage-dark">{s.n}</span><div><p className="text-sm font-bold text-foreground">{s.t}</p><p className="text-xs text-slate-500">{s.d}</p></div></div></Card>
          ))}
          <Card className="bg-sage-tint/20"><p className="text-sm text-slate-600"><span className="font-semibold text-foreground">Fed by synthesis.</span> Your top problems, obsessions, and markets shaped these spaces.</p></Card>
        </div>
      }
      center={
        <div className="space-y-5">
          <Card className="p-5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Opportunity</h1>
            <p className="mt-1 text-slate-500">Before a venture, the group agrees a broad opportunity space — then researches it.</p>
          </Card>

          <Part label="Opportunity spaces" hint="Agree the space first. Vote counts carried from synthesis.">
            <p className="-mt-1 mb-1 text-xs text-slate-400">Select the space the team is agreeing on.</p>
            <div className="space-y-2">
              {spaces.map((s) => {
                const active = s.id === spaceId;
                return (
                  <button key={s.id} onClick={() => setSpaceId(s.id)} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${active ? "border-sage bg-sage-tint/20 ring-1 ring-sage" : "border-slate-200 hover:border-sage/50"}`}>
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${active ? "bg-sage text-white" : "border border-slate-300"}`}>{active && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5"><path d="m5 12 5 5L20 7" /></svg>}</span>
                    <span className="flex-1 text-sm text-foreground">{s.text}</span>
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-slate-400"><Icon name="thumb" className="h-3.5 w-3.5" />{s.votes}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-3 rounded-xl border border-slate-200 p-3">
              <button onClick={() => setWhysOpen((o) => !o)} className="flex w-full items-center gap-2.5 text-left">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-tint text-[11px] font-bold text-sage-dark">?</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-foreground">5 Whys</span>
                  <span className="block truncate text-xs text-slate-400">Interrogate the root of {agreed.text}</span>
                </span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={`h-4 w-4 shrink-0 text-slate-300 transition-transform ${whysOpen ? "rotate-180" : ""}`}><path d="m6 9 6 6 6-6" /></svg>
              </button>
              {whysOpen && <FiveWhys value={whys[spaceId] ?? ["", "", "", "", ""]} onChange={(arr) => setWhys((w) => ({ ...w, [spaceId]: arr }))} />}
            </div>
          </Part>

          <Part label="Market research" hint="PESTLE's six dimensions, run against the agreed space.">
            <p className="-mt-1 mb-2 text-xs text-slate-400">Researching: <span className="font-semibold text-sage-dark">{agreed.text}</span></p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {RESEARCH_LENSES.map((l) => (
                <div key={l.key} className="rounded-xl border border-slate-200 p-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-sage-dark">{l.label}</p>
                  <p className="mt-1 text-sm text-slate-700">{l.finding}</p>
                </div>
              ))}
            </div>
          </Part>

          <Part label="Angles" hint="Look at the opportunity through different lenses — each gives a different version of it.">
            <p className="-mt-1 mb-2 text-xs text-slate-400">e.g. what's the X-Prize version of this? where's the Blue Ocean angle?</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {LENSES.map((l) => (
                <div key={l.id} className="rounded-xl border border-slate-200 p-3">
                  <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-sage-dark"><Icon name={l.icon} className="h-3.5 w-3.5" />{l.name}</p>
                  <p className="text-[11px] italic text-slate-400">{l.question}</p>
                  <p className="mt-1 text-sm text-slate-700">{l.reframe}</p>
                </div>
              ))}
            </div>
          </Part>

          <div className="flex flex-col items-start gap-3 rounded-2xl border border-sage/40 bg-sage-tint/20 p-5 sm:flex-row sm:items-center">
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">Agree the space — it births your ventures</p>
              <p className="mt-0.5 text-xs text-slate-500">Once the team agrees on <span className="font-semibold text-sage-dark">{agreed.text}</span>, Flash births a handful of candidate ventures from it to take into formation.</p>
            </div>
            <PrimaryBtn label="Birth ventures" onClick={onNext} icon="sparkle" />
          </div>
        </div>
      }
      right={
        <div className="space-y-4 lg:sticky lg:top-4">
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white/5 p-5">
            <RailTitle>Agreed space</RailTitle>
            <div className="rounded-xl border border-sage/30 bg-sage-tint/20 p-3"><p className="text-sm font-semibold text-foreground">{agreed.text}</p></div>
            <p className="text-xs text-slate-400">Researched and viewed through the lenses, then it births your candidate ventures.</p>
          </div>
        </div>
      }
    />
  );
}

/* ------------------------------------------------------ 3. Ventures */

function VenturesPhase({ plan, ventureId, onSelect, name, onName, venture, onVenture, recorded, onRecord, onNext }: { plan: "free" | "full"; ventureId: string; onSelect: (id: string) => void; name: string; onName: (n: string) => void; venture: VentureDraft; onVenture: React.Dispatch<React.SetStateAction<VentureDraft>>; recorded: Record<string, boolean>; onRecord: (id: string) => void; onNext: () => void }) {
  const isFree = plan === "free";
  const v = VENTURES.find((x) => x.id === ventureId)!;
  const isChosen = v.id === CHOSEN_ID;
  const editable = isChosen && !isFree;
  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <RailTitle>Venture outlines</RailTitle>
          <p className="text-xs text-slate-400">Born from the opportunity space. Anonymous voting until reveal; the agent mediates revisions.</p>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {VENTURES.map((x) => {
            const active = x.id === ventureId;
            return (
              <button key={x.id} onClick={() => onSelect(x.id)} className={`flex w-56 shrink-0 flex-col rounded-xl border p-3 text-left transition-colors ${active ? "border-sage bg-sage-tint/20 ring-1 ring-sage" : "border-slate-200 hover:border-sage/50"}`}>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{x.name}</span>
                  {x.recommended && <span className="rounded-full bg-sage px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">Top</span>}
                  <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-slate-500"><Icon name="thumb" className="h-3.5 w-3.5" />{x.votes}</span>
                </div>
                <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{x.thesis}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <section className="min-w-0 flex-1">
          <Card className="p-6">
            <CenterHead title={isChosen ? name : v.name} sub="One-sentence thesis, scored — what, for whom, why now." right={isChosen && !isFree ? (
              <span className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-500"><Icon name="bolt" className="h-3.5 w-3.5 text-sage" /> rename<input value={name} onChange={(e) => onName(e.target.value)} className="ml-1 w-24 border-b border-slate-300 bg-transparent text-foreground focus:border-sage focus:outline-none" /></span>
            ) : undefined} />

            <div className="rounded-xl border border-sage/30 bg-sage-tint/20 p-4">
              {editable
                ? <EditableArea value={venture.thesis} onChange={(val) => onVenture((p) => ({ ...p, thesis: val }))} className="text-foreground" />
                : <p className="text-foreground">{v.thesis}</p>}
            </div>

            {editable ? (
              <RichVentureDetail venture={venture} onVenture={onVenture} recorded={recorded} onRecord={onRecord} onNext={onNext} />
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
                {isChosen ? (
                  <div className="mt-6"><Upsell title="Full venture details are part of Seed" text="Origin story, team & equity, financials, the 7-day sprint, risk register, and the commitment ritual — plus the validation engine." /></div>
                ) : (
                  <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Select <span className="font-semibold text-foreground">{VENTURE_DETAILS.name}</span> (the top-voted venture) to see full details.</div>
                )}
              </>
            )}
          </Card>
        </section>
        <aside className="lg:w-80 lg:shrink-0">
          <div className="lg:sticky lg:top-4 lg:self-start">
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/5 p-5">
              <RailTitle>Deliberation</RailTitle>
              <div className="grid gap-3"><Bars label="Spark" value={v.spark} /><Bars label="Conviction" value={v.conviction} /></div>
              <div className="flex gap-2">
                <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-sage py-2.5 text-sm font-semibold text-white"><Icon name="thumb" className="h-4 w-4" /> Vote</button>
                <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-slate-600"><Icon name="comment" className="h-4 w-4" /> Comment</button>
              </div>
              <p className="text-xs text-slate-400">All three vote independently within 12 hours. Votes reveal together.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-slate-200 p-3"><p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-0.5 text-sm text-foreground">{value}</p></div>;
}

function FullVentureDetails({ venture, onVenture, recorded, onRecord, onNext }: { venture: VentureDraft; onVenture: React.Dispatch<React.SetStateAction<VentureDraft>>; recorded: Record<string, boolean>; onRecord: (id: string) => void; onNext: () => void }) {
  const d = VENTURE_DETAILS;
  const setRow = (i: number, patch: Partial<VentureDraft["capTable"]["rows"][number]>) =>
    onVenture((p) => ({ ...p, capTable: { ...p.capTable, rows: p.capTable.rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)) } }));
  const setPool = (pool: number) => onVenture((p) => ({ ...p, capTable: { ...p.capTable, pool } }));
  return (
    <div className="space-y-6 border-t border-slate-100 pt-6">
      <Section title="The origin story">
        <div className="space-y-2 text-sm text-slate-700">{d.origin.map((p, i) => <p key={i}>{p}</p>)}</div>
      </Section>

      <CapTable capTable={venture.capTable} setRow={setRow} setPool={setPool} />

      <Section title="Financials">
        <p className="mb-2 text-xs text-slate-400">{d.financials.note}</p>
        <dl className="space-y-2">{d.financials.rows.map((r) => <div key={r.label} className="flex gap-3 rounded-lg border border-slate-200 p-3 text-sm"><dt className="w-28 shrink-0 font-semibold text-slate-400">{r.label}</dt><dd className="text-foreground">{r.value}</dd></div>)}</dl>
      </Section>

      <Section title="7-day sprint plan">
        <div className="space-y-2">{d.sprint.map((s) => <div key={s.days} className="flex gap-3 rounded-lg border border-slate-200 p-3"><span className="shrink-0 rounded-md bg-sage-tint px-2 py-1 text-xs font-bold text-sage-dark">{s.days}</span><p className="text-sm text-slate-700">{s.text}</p></div>)}</div>
      </Section>

      <Section title="Risk register">
        <div className="space-y-2">{d.risks.map((r) => (
          <div key={r.risk} className="rounded-lg border border-slate-200 p-3">
            <p className="flex items-start gap-2 text-sm font-semibold text-foreground"><Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />{r.risk}</p>
            <p className="mt-1 pl-6 text-sm text-slate-600"><span className="font-semibold text-sage-dark">Mitigation:</span> {r.mitigation}</p>
          </div>
        ))}</div>
      </Section>

      <Section title="The commitment">
        <div className="space-y-2">{d.commitments.map((c) => { const m = memberById(c.memberId); const rec = recorded[c.memberId]; return (
          <div key={c.memberId} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
            <Avatar m={m} size="h-9 w-9 text-xs" />
            <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-foreground">{m.name}</p><p className="truncate text-xs text-slate-500">{c.statement}</p></div>
            <button onClick={() => onRecord(c.memberId)} className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-colors ${rec ? "bg-sage text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}><Icon name={rec ? "check" : "play"} className="h-3.5 w-3.5" />{rec ? "Recorded" : "Record"}</button>
          </div>
        ); })}</div>
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

function ValidationPhase({ name, venture, onVenture, checkin, onCheckin, published, onPublish }: { name: string; venture: VentureDraft; onVenture: React.Dispatch<React.SetStateAction<VentureDraft>>; checkin: string; onCheckin: (d: string) => void; published: boolean; onPublish: (p: boolean) => void }) {
  const [channel, setChannel] = useState<(typeof CHANNELS)[number]["key"]>("linkedin");
  const v = VALIDATION;
  const deck = buildDeck(venture, name);
  const landing = buildLanding(venture);
  return (
    <Columns
      left={
        <div className="space-y-4">
          <RailTitle>Check-ins</RailTitle>
          <p className="px-1 text-xs text-slate-400">The agent goes quiet between these. The work is yours.</p>
          {v.checkins.map((c) => {
            const sel = c.day === checkin;
            return (
              <button key={c.day} onClick={() => onCheckin(c.day)} className={`block w-full rounded-xl border p-3 text-left transition-colors ${sel ? "border-sage bg-sage-tint/20 ring-1 ring-sage" : "border-slate-200 hover:border-sage/50"}`}>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{c.day}</span>
                  <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${c.status === "active" ? "bg-sage text-white" : "bg-slate-100 text-slate-400"}`}>{c.status === "active" ? "Open now" : "Locked"}</span>
                </div>
                {sel && <p className="mt-2 text-sm text-slate-600">{c.text}</p>}
              </button>
            );
          })}

          <div className="pt-2"><RailTitle>What you walk away with</RailTitle></div>
          <Card className="bg-sage-tint/20"><p className="font-bold text-foreground">{name}</p><p className="mt-0.5 text-sm text-slate-600">Venture locked. Validation assets generated.</p></Card>
          <Card><ul className="space-y-1.5">{["Venture details & roles", "Team alignment & cap table", "Hosted landing page", "Live signups dashboard", "Pitch deck", "Outreach copy"].map((x) => <CheckRow key={x} label={x} />)}</ul></Card>
          <Card className="bg-slate-50"><p className="flex items-center gap-2 text-sm font-bold text-foreground"><Icon name="heart" className="h-4 w-4 text-sage" /> The Flash Fund</p><p className="mt-1 text-sm text-slate-600">Part of every buy-in seeds ventures that emerge here.</p></Card>
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
            <PublishBar published={published} onPublish={onPublish} url={v.liveUrl} />
            <LandingHero name={name} landing={landing} />
          </Section></div>

          <div className="mt-6"><Section title="Pitch deck">
            <p className="-mt-1 mb-3 text-xs text-slate-400">{deck.length} slides, YC seed-deck order — generated live from your venture outline, cap table, and revenue model.</p>
            <DeckViewer slides={deck} name={name} />
          </Section></div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Section title="Outreach copy">
              <div className="mb-3 flex flex-wrap gap-2">{CHANNELS.map((c) => <button key={c.key} onClick={() => setChannel(c.key)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${channel === c.key ? "bg-sage text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>{c.label}</button>)}</div>
              <p className="whitespace-pre-line rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">{v.outreach[channel]}</p>
            </Section>
            <Section title="Feedback synthesis">
            <p className="mb-2 text-xs text-slate-400">{v.feedbackNote}</p>
            <p className="mb-2 text-sm text-slate-600">{v.sendTarget}</p>
            <ul className="space-y-1.5">{v.feedbackEdits.map((e) => <li key={e} className="flex items-start gap-2 rounded-lg bg-slate-50 p-2.5 text-sm text-slate-700"><Icon name="refresh" className="mt-0.5 h-4 w-4 shrink-0 text-sage" />{e}</li>)}</ul>
          </Section></div>
        </Card>
      }
    />
  );
}

/* ------------------------------------------ validation assets: landing + deck */

function FlashMark({ className = "h-5 w-5 text-sage" }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true"><path d="M13 2 4.5 13.5H11l-1.5 8.5L20 9.5h-6.5L13 2Z" /></svg>;
}

function LandingHero({ name, landing }: { name: string; landing: typeof VALIDATION.landing }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/5 shadow-sm">
      <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        <span className="ml-3 rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-slate-400">relaunch.co</span>
      </div>
      <div className="p-6 sm:p-8">
        <div className="mb-7 flex items-center gap-2">
          <FlashMark className="h-5 w-5 text-sage" />
          <span className="font-bold tracking-tight text-foreground">{name}</span>
        </div>
        <div className="grid items-center gap-8 lg:grid-cols-2">
          {/* value, how, next step, social proof */}
          <div>
            <h3 className="text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl">{landing.headline}</h3>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">{landing.subhead}</p>

            <div className="mt-6">
              <span className="inline-flex h-12 items-center rounded-xl bg-sage px-6 text-sm font-bold text-white">{landing.cta}</span>
            </div>

            <div className="mt-7 flex items-center gap-3 border-t border-slate-100 pt-5">
              <div className="flex -space-x-2">
                {["bg-emerald-200", "bg-sky-200", "bg-amber-200", "bg-rose-200"].map((c, i) => (
                  <span key={i} className={`h-8 w-8 rounded-full ring-2 ring-white ${c}`} />
                ))}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{landing.proof.stat}</p>
                <p className="text-xs text-slate-500">{landing.proof.detail}</p>
              </div>
            </div>
          </div>

          {/* visual */}
          <div>
            <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-sage-tint to-slate-100 ring-1 ring-slate-200">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-sage shadow-sm"><Icon name="play" className="h-7 w-7" /></span>
            </div>
            <p className="mt-2 text-center text-sm text-slate-500">{landing.visualCaption}</p>
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
        <button onClick={() => go(i - 1)} aria-label="Previous slide" className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-600 shadow-sm backdrop-blur transition-colors hover:bg-white hover:text-sage-dark">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <button onClick={() => go(i + 1)} aria-label="Next slide" className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-600 shadow-sm backdrop-blur transition-colors hover:bg-white hover:text-sage-dark">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m9 18 6-6-6-6" /></svg>
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {slides.map((s, n) => {
          const active = n === i;
          return (
            <button key={s.label} onClick={() => setI(n)} className={`flex shrink-0 flex-col rounded-lg border px-3 py-2 text-left transition-colors ${active ? "border-sage bg-sage-tint/30 ring-1 ring-sage" : "border-slate-200 hover:border-sage/40"}`}>
              <span className="text-[10px] font-bold tabular-nums text-slate-400">{String(n + 1).padStart(2, "0")}</span>
              <span className={`whitespace-nowrap text-xs font-semibold ${active ? "text-sage-dark" : "text-slate-600"}`}>{s.label}</span>
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
          <FlashMark className="h-4 w-4 text-sage" />
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
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sage-dark">{slide.label}</p>
            <h3 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-[28px]">{slide.headline}</h3>

            {slide.kind === "team" ? (
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {(slide.team ?? []).map((r) => {
                  const m = memberById(r.memberId);
                  return (
                    <div key={r.memberId} className="rounded-xl border border-slate-200 p-3">
                      <div className="flex items-center gap-2">
                        <Avatar m={m} size="h-8 w-8 text-[10px]" />
                        <span className="rounded-md bg-sage-tint px-1.5 py-0.5 text-xs font-bold text-sage-dark">{r.equity === "" ? "—" : `${r.equity}%`}</span>
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
                  <div key={p} className="rounded-xl border border-sage/30 bg-sage-tint/20 p-3 text-sm font-semibold text-foreground">{p}</div>
                ))}
              </div>
            ) : (
              <ul className="mt-4 space-y-2">
                {slide.points?.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-[15px] text-slate-700">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />
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
      className={`-mx-1.5 w-full resize-y rounded-md border border-transparent bg-transparent px-1.5 py-1 leading-snug hover:border-slate-200 focus:border-sage focus:bg-white/5 focus:outline-none ${className}`}
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
function DotScore({ value, onChange, label }: { value: number; onChange?: (v: number) => void; label?: string }) {
  return (
    <div>
      {label && <div className="mb-1 flex items-center justify-between text-xs"><span className="text-slate-500">{label}</span><span className="font-semibold tabular-nums text-sage-dark">{value}/5</span></div>}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" disabled={!onChange} onClick={() => onChange?.(n)} aria-label={`${label ?? "score"}: ${n} of 5`} className={`h-2.5 flex-1 rounded-full transition-colors ${n <= value ? "bg-sage" : "bg-slate-200"} ${onChange ? "cursor-pointer hover:opacity-80" : ""}`} />
        ))}
      </div>
    </div>
  );
}

function RichVentureDetail({ venture, onVenture, recorded, onRecord, onNext }: { venture: VentureDraft; onVenture: React.Dispatch<React.SetStateAction<VentureDraft>>; recorded: Record<string, boolean>; onRecord: (id: string) => void; onNext: () => void }) {
  const set = <K extends keyof VentureDraft,>(key: K, val: VentureDraft[K]) => onVenture((p) => ({ ...p, [key]: val }));
  const setBasics = (patch: Partial<VentureDraft["basics"]>) => onVenture((p) => ({ ...p, basics: { ...p.basics, ...patch } }));
  const setAdvantage = (patch: Partial<VentureDraft["advantage"]>) => onVenture((p) => ({ ...p, advantage: { ...p.advantage, ...patch } }));
  const setCompetition = (patch: Partial<VentureDraft["competition"]>) => onVenture((p) => ({ ...p, competition: { ...p.competition, ...patch } }));
  const setProblem = (patch: Partial<VentureDraft["problem"]>) => onVenture((p) => ({ ...p, problem: { ...p.problem, ...patch } }));
  const setDiff = (patch: Partial<VentureDraft["differentiation"]>) => onVenture((p) => ({ ...p, differentiation: { ...p.differentiation, ...patch } }));
  return (
    <div className="mt-5 space-y-5">
      <Section title="North star">
        <div className="rounded-xl border border-sage/30 bg-sage-tint/20 p-4">
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
        <Section title="Market"><MarketReport /></Section>
      </Part>

      <Part label="Differentiation" hint="Differentiation makes products click.">
        <DifferentiationBlock diff={venture.differentiation} set={setDiff} />
        <Section title="Principles"><PrinciplesEditor principles={venture.principles} onChange={(p) => set("principles", p)} /></Section>
      </Part>

      <Part label="Approach" hint="How you'll solve it — never commit to your first idea.">
        <Section title="Options"><ApproachOptions chosen={venture.approachId} onPick={(id) => set("approachId", id)} /></Section>
      </Part>

      <RevenueBreakdown revenue={venture.revenue} onChange={(r) => set("revenue", r)} />

      <FullVentureDetails venture={venture} onVenture={onVenture} recorded={recorded} onRecord={onRecord} onNext={onNext} />
    </div>
  );
}

// A Click top-level part (Basics / Differentiation / Approach) — a defined,
// bordered section with a book-style header.
function Part({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50/40 p-5">
      <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-slate-200 pb-3">
        <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-sage-dark">{label}</h2>
        <p className="text-xs text-slate-400">{hint}</p>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function MarketReport() {
  const [run, setRun] = useState(false);
  const r = MARKET_REPORT;
  if (!run) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-sage/50 bg-sage-tint/10 p-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">Run an in-depth market report</p>
          <p className="text-xs text-slate-500">Pulls the team&rsquo;s inputs and public data into sizing, trends, segments, and competition.</p>
        </div>
        <button onClick={() => setRun(true)} className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-sage px-4 text-sm font-bold text-white transition-colors hover:bg-sage-dark"><Icon name="chart" className="h-4 w-4" /> Run market report</button>
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
          <div key={s.label} className="rounded-lg border border-sage/30 bg-sage-tint/20 p-3">
            <p className="text-[11px] font-bold uppercase tracking-wide text-sage-dark">{s.label}</p>
            <p className="text-lg font-bold tabular-nums text-foreground">{s.value}</p>
            <p className="text-[11px] text-slate-500">{s.note}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div><p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">Tailwinds</p><ul className="space-y-1.5">{r.trends.map((t) => <li key={t} className="flex items-start gap-2 text-sm text-slate-700"><Icon name="chart" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage" />{t}</li>)}</ul></div>
        <div><p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">Segments</p><ul className="space-y-1.5">{r.segments.map((t) => <li key={t} className="flex items-start gap-2 text-sm text-slate-700"><Icon name="group" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage" />{t}</li>)}</ul></div>
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
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />
            <input value={p} onChange={(e) => setAt(i, e.target.value)} placeholder="A rule your team will live by" className="flex-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-foreground focus:border-sage focus:outline-none" />
            <button onClick={() => onChange(principles.filter((_, idx) => idx !== i))} aria-label="Remove principle" className="mt-1.5 shrink-0 text-slate-300 hover:text-slate-500"><Icon name="minus" className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
      <button onClick={() => onChange([...principles, ""])} className="mt-3 text-sm font-semibold text-sage-dark hover:underline">+ Add a principle</button>
    </div>
  );
}

function ApproachOptions({ chosen, onPick }: { chosen: string; onPick: (id: string) => void }) {
  return (
    <div>
      <p className="-mt-1 mb-3 text-xs text-slate-400">At least three. Each is a one-pager — pick the one to carry into validation.</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {APPROACH_OPTIONS.map((o) => {
          const active = o.id === chosen;
          return (
            <button key={o.id} onClick={() => onPick(o.id)} className={`flex flex-col rounded-xl border p-3 text-left transition-colors ${active ? "border-sage bg-sage-tint/20 ring-1 ring-sage" : "border-slate-200 hover:border-sage/50"}`}>
              <div className="flex items-center gap-2">
                <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${active ? "bg-sage text-white" : "border border-slate-300"}`}>{active && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5"><path d="m5 12 5 5L20 7" /></svg>}</span>
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
          <span className="rounded-lg bg-sage px-2.5 py-1 text-sm font-bold tabular-nums text-white">{overall}/10</span>
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
              <button key={m.id} onClick={() => onChange(revenueDefaults(m))} className={`rounded-xl border p-3 text-left transition-colors ${active ? "border-sage bg-sage-tint/20 ring-1 ring-sage" : "border-slate-200 hover:border-sage/50"}`}>
                <p className="text-sm font-bold text-foreground">{m.label}</p>
                <p className="mt-0.5 text-[11px] uppercase tracking-wide text-slate-400">Y3 {m.unit}</p>
                <p className="text-lg font-bold tabular-nums text-sage-dark">{money(y3)}</p>
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
                      <input inputMode="numeric" value={revenue.drivers[d.key] ?? 0} onChange={(e) => setDriver(d.key, Number(e.target.value.replace(/[^0-9]/g, "")) || 0)} className="w-24 rounded-md border border-slate-200 px-2 py-1 text-right text-sm tabular-nums focus:border-sage focus:outline-none" />
                      {d.suffix && <span className="text-sm text-slate-400">{d.suffix}</span>}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white/5 p-2.5">
                  <span className="text-sm text-slate-600">Annual growth</span>
                  <span className="flex items-center gap-0.5">
                    <input inputMode="numeric" value={revenue.growth} onChange={(e) => onChange({ ...revenue, growth: Number(e.target.value.replace(/[^0-9]/g, "")) || 0 })} className="w-24 rounded-md border border-slate-200 px-2 py-1 text-right text-sm tabular-nums focus:border-sage focus:outline-none" />
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
                    <div className="w-full rounded-t-md bg-sage" style={{ height: `${Math.max(6, (rev / max) * 100)}%` }} />
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
            <div className="rounded-lg border border-sage/30 bg-sage-tint/20 p-3"><p className="text-xs font-bold text-sage-dark">What fits</p><p className="mt-0.5 text-sm text-slate-700">{model.fits}</p></div>
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
                <td className="p-3"><div className="flex items-center gap-1"><input inputMode="numeric" value={r.equity} placeholder="—" onChange={(e) => setRow(i, { equity: e.target.value.replace(/[^0-9]/g, "").slice(0, 3) })} className="w-12 rounded-md border border-slate-200 px-2 py-1 text-right tabular-nums focus:border-sage focus:outline-none" /><span className="text-slate-400">%</span></div></td>
                <td className="p-3"><input value={r.vesting} onChange={(e) => setRow(i, { vesting: e.target.value })} className="-mx-1.5 w-full rounded-md border border-transparent bg-transparent px-1.5 py-1 text-slate-600 hover:border-slate-200 focus:border-sage focus:bg-white/5 focus:outline-none" /></td>
              </tr>
            ); })}
            <tr className="border-t border-slate-100 bg-slate-50/40">
              <td className="p-3"><p className="font-semibold text-foreground">Option pool</p><p className="text-xs text-slate-500">Reserved</p></td>
              <td className="p-3 text-slate-500">Future hires</td>
              <td className="p-3"><div className="flex items-center gap-1"><input inputMode="numeric" value={capTable.pool} onChange={(e) => setPool(Number(e.target.value.replace(/[^0-9]/g, "").slice(0, 3)) || 0)} className="w-12 rounded-md border border-slate-200 px-2 py-1 text-right tabular-nums focus:border-sage focus:outline-none" /><span className="text-slate-400">%</span></div></td>
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

function PublishBar({ published, onPublish, url }: { published: boolean; onPublish: (p: boolean) => void; url: string }) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
      {published ? (
        <>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sage/15 px-2.5 py-1 text-xs font-bold text-sage-dark"><span className="h-2 w-2 rounded-full bg-sage" /> Live</span>
          <code className="text-sm text-slate-600">{url}</code>
          <button className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"><Icon name="copy" className="h-3.5 w-3.5" /> Copy link</button>
          <span className="ml-auto hidden items-center gap-1.5 text-xs text-slate-400 sm:flex"><Icon name="shield" className="h-3.5 w-3.5" /> Hosted by Flash Company · collecting signups</span>
          <button onClick={() => onPublish(false)} className="text-xs font-semibold text-slate-400 hover:text-slate-600">Unpublish</button>
        </>
      ) : (
        <>
          <span className="text-sm text-slate-600">Launch a hosted page and start collecting signups.</span>
          <button onClick={() => onPublish(true)} className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-lg bg-sage px-4 text-sm font-bold text-white transition-colors hover:bg-sage-dark"><Icon name="bolt" className="h-4 w-4" /> Publish</button>
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
                <Icon name="target" className="h-4 w-4 shrink-0 text-sage" />
                <p className="text-sm font-semibold text-foreground">{s.test}</p>
                <span className="ml-auto text-sm font-bold tabular-nums text-sage-dark">{value}/{s.target} <span className="text-xs font-normal text-slate-400">{s.metric}</span></span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${hit ? "bg-sage" : "bg-sage/60"}`} style={{ width: `${pct}%` }} /></div>
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

function buildDeck(v: VentureDraft, name: string): DeckSlide[] {
  const model = REVENUE_MODELS.find((m) => m.id === v.revenue.id) ?? REVENUE_MODELS[0];
  const build = revenueBuild(v.revenue.id, v.revenue.drivers, v.revenue.growth);
  const founders = v.capTable.rows.map((r) => memberById(r.memberId).name).join(" · ");
  const team = v.capTable.rows.map((r) => ({ memberId: r.memberId, role: r.role, equity: r.equity }));
  const approach = approachOf(v);
  return [
    { kind: "title", label: "Title", headline: name, points: [v.thesis], footnote: `${founders} — founding team` },
    { label: "Problem", headline: "Parents who pause their careers face a cold, confidence-eroding path back.", points: ["Job boards screen people out the moment they see a two-year gap.", "No trusted, supportive route back — only a cold search box.", v.problem.payNow] },
    { label: "Approach", headline: approach.title, points: [approach.why] },
    { label: "Why now", headline: "Returnships are going mainstream.", points: ["The motherhood penalty is finally in the spotlight.", "Flexible and returner hiring is becoming the default ask."] },
    { kind: "market", label: "Market", headline: MARKET_REPORT.summary, points: MARKET_REPORT.stats.map((s) => `${s.label}: ${s.value}`), footnote: `${money(build[2])} Y3 ${model.unit} (illustrative)` },
    { label: "Product", headline: "Recruit → 8-week programme → employer intros → measured outcomes.", points: ["A waitlist opens to the community.", "The cohort runs the guided 8-week programme.", "Warm employer intros, with outcomes tracked."] },
    { label: "Business model", headline: `${model.label}: ${model.pitch}`, points: [`Year 1: ${money(build[0])}`, `Year 3: ${money(build[2])} ${model.unit}`, `Growing ${v.revenue.growth}% a year`] },
    { kind: "traction", label: "Traction", headline: "Distribution and proof before a line of code.", points: ["4,000-member parent community", "Sold-out course — 80 parents, twice", "Validation waitlist live"] },
    { label: "Why us", headline: v.differentiation.statement, points: [v.unique] },
    { kind: "team", label: "Team", headline: "Three founders, one problem they can't stop noticing.", team },
    { kind: "ask", label: "The ask", headline: "Run the pilot, hit the day-30 gate, open cohort two.", points: ["First cohort: 12 parents.", "5 warm employer intros pre-lined.", "Day-30 go/no-go → a Series-A-ready traction story."] },
  ];
}

function buildLanding(v: VentureDraft): typeof VALIDATION.landing {
  return { ...VALIDATION.landing, subhead: approachOf(v).why };
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
      <button onClick={() => onToggle(key)} className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-sm font-semibold transition-colors ${on ? "border-sage bg-sage-tint/30 text-foreground" : "border-slate-200 text-slate-600 hover:border-sage/50"}`}>
        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${on ? "bg-sage text-white" : "border border-slate-300"}`}>{on && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3"><path d="m5 12 5 5L20 7" /></svg>}</span>
        {question}
      </button>
    );
  };
  return (
    <div className="rounded-xl border border-slate-200 p-4 sm:p-5">
      <div className="mb-3 hidden items-center justify-between text-[11px] font-bold uppercase tracking-wide text-slate-400 lg:flex">
        <span className="flex-1">Founding hypothesis</span>
        <span className="flex w-[13rem] items-center justify-between">Scorecard <span className="rounded bg-sage px-1.5 py-0.5 text-white tabular-nums">{done}/{SCORECARD.length}</span></span>
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
