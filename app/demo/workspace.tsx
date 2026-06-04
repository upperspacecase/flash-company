"use client";

import Link from "next/link";
import { Fragment, useState } from "react";
import {
  CHOSEN_ID,
  COHORT,
  CONVERGENCE_SIGNALS,
  DIFFERENTIATION,
  INTAKE,
  INTAKE_TOTAL,
  INVITE,
  LENSES,
  OPPORTUNITY_SPACES,
  PHASES,
  REVENUE_MODELS,
  SPRINT,
  TAGLINE,
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
  type IntakeQuestion,
  type IntakeSection,
  type Lens,
  type Member,
  type VentureDraft,
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
  return <div className={`rounded-2xl border border-slate-200 bg-white p-4 ${className}`}>{children}</div>;
}
function Chip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{children}</span>;
}
function RailIcon({ name }: { name: IconName }) {
  return <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sage-tint text-sage-dark"><Icon name={name} className="h-4 w-4" /></span>;
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
function Columns({ left, center, right }: { left: React.ReactNode; center: React.ReactNode; right: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <aside className="lg:w-72 lg:shrink-0">{left}</aside>
      <section className="min-w-0 flex-1">{center}</section>
      <aside className="lg:w-80 lg:shrink-0">{right}</aside>
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
  const [ventureId, setVentureId] = useState(CHOSEN_ID);
  const [name, setName] = useState(VENTURE_DETAILS.name);
  const [recorded, setRecorded] = useState<Record<string, boolean>>(
    Object.fromEntries(VENTURE_DETAILS.commitments.map((c) => [c.memberId, c.recorded]))
  );
  const [checkin, setCheckin] = useState("Day 7");
  const [venture, setVenture] = useState<VentureDraft>(makeVentureDraft);
  const [published, setPublished] = useState(false);

  // Free stops at the venture outlines; validation is locked.
  const go = (i: number) => setPhase(isFree && i >= 4 ? 3 : i);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/70">
      <Header phase={phase} plan={plan} />
      <Timeline phase={phase} onJump={go} plan={plan} />
      <main className="mx-auto w-full max-w-[1500px] flex-1 px-5 py-6">
        {phase === 0 && <InvitePhase onNext={() => setPhase(1)} />}
        {phase === 1 && <InputPhase onNext={() => setPhase(2)} />}
        {phase === 2 && <SynthesisPhase onNext={() => setPhase(3)} />}
        {phase === 3 && <VenturesPhase plan={plan} ventureId={ventureId} onSelect={setVentureId} name={name} onName={setName} venture={venture} onVenture={setVenture} recorded={recorded} onRecord={(id) => setRecorded((r) => ({ ...r, [id]: !r[id] }))} onNext={() => setPhase(4)} />}
        {!isFree && phase === 4 && <ValidationPhase name={name} venture={venture} checkin={checkin} onCheckin={setCheckin} published={published} onPublish={setPublished} />}
      </main>
    </div>
  );
}

function Header({ phase, plan }: { phase: number; plan: "free" | "full" }) {
  const p = PHASES[phase];
  const isFree = plan === "free";
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-sage"><path d="M13 2 4.5 13.5H11l-1.5 8.5L20 9.5h-6.5L13 2Z" /></svg>
          <span className="text-lg font-bold tracking-tight text-foreground">Flash Company</span>
          <span className="hidden text-sm font-medium italic text-sage md:inline">{TAGLINE}</span>
        </Link>
        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden items-center gap-2 rounded-full bg-sage-tint px-3 py-1.5 text-xs font-semibold text-sage-dark sm:flex">
            <Icon name="clock" className="h-3.5 w-3.5" /> {isFree ? `Free · ${SPRINT.freeHours}h` : `${SPRINT.windowHours}h sprint · ${p.day}`}
          </span>
          <div className="hidden items-center -space-x-2 sm:flex">{COHORT.map((m) => <Avatar key={m.id} m={m} />)}</div>
          <button className="inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Icon name="link" className="h-4 w-4" /> Invite</button>
        </div>
      </div>
    </header>
  );
}

function Timeline({ phase, onJump, plan }: { phase: number; onJump: (n: number) => void; plan: "free" | "full" }) {
  const isFree = plan === "free";
  return (
    <nav className="border-b border-slate-200 bg-white">
      <ol className="mx-auto flex w-full max-w-[1500px] gap-2 overflow-x-auto px-5 py-3">
        {PHASES.map((p, i) => {
          const locked = isFree && i >= 4;
          const active = i === phase && !locked;
          const done = i < phase;
          return (
            <li key={p.id} className="flex flex-1 items-center gap-2">
              <button disabled={locked} onClick={() => !locked && onJump(i)} className={`flex flex-1 items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors ${active ? "border-sage bg-sage-tint/40" : locked ? "cursor-not-allowed border-transparent opacity-50" : "border-transparent hover:bg-slate-50"}`}>
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${active ? "bg-sage text-white" : done ? "bg-sage/20 text-sage-dark" : "bg-slate-100 text-slate-400"}`}>
                  {locked ? <Icon name="lock" className="h-3 w-3" /> : i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block whitespace-nowrap text-[10px] font-bold uppercase tracking-wide text-slate-400">{locked ? "Seed" : p.day}</span>
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

function InvitePhase({ onNext }: { onNext: () => void }) {
  return (
    <Columns
      left={
        <div className="space-y-4">
          <RailTitle>Why this works</RailTitle>
          <Card><p className="flex items-center gap-2 font-bold text-foreground"><Icon name="sparkle" className="h-4 w-4 text-sage" /> Invitation-driven trust</p><p className="mt-1.5 text-sm text-slate-600">Someone you trust sends the link. Low bar on time and input.</p></Card>
          <Card><p className="flex items-center gap-2 font-bold text-foreground"><Icon name="clock" className="h-4 w-4 text-sage" /> 48-hour window</p><p className="mt-1.5 text-sm text-slate-600">It opens once everyone accepts. The constraint forces action.</p></Card>
        </div>
      }
      center={
        <Card className="p-6">
          <CenterHead title="Invite your team" sub="Up to 3 people. Share a link — no app, no account." />
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="mb-2 text-sm font-bold text-foreground">Shareable link</p>
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-sage"><Icon name="link" className="h-4 w-4" /></span>
              <code className="min-w-0 flex-1 truncate text-sm text-slate-600">{INVITE.url}</code>
              <button className="inline-flex items-center gap-1.5 rounded-md bg-sage px-3 py-1.5 text-xs font-bold text-white"><Icon name="copy" className="h-3.5 w-3.5" /> Copy</button>
            </div>
            <p className="mt-2 text-xs text-slate-400">{INVITE.note}</p>
          </div>
          <div className="mt-4 rounded-xl border border-slate-200 p-4">
            <p className="mb-3 text-sm font-bold text-foreground">Who&rsquo;s accepted</p>
            <ul className="space-y-2.5">
              {COHORT.map((m) => (
                <li key={m.id} className="flex items-center gap-3">
                  <Avatar m={m} />
                  <div className="min-w-0 flex-1"><p className="font-semibold text-foreground">{m.name} {m.id === YOU && <span className="text-xs font-normal text-slate-400">(you)</span>}</p><p className="truncate text-xs text-slate-500">{m.role} · {m.brings}</p></div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${m.accepted ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{m.accepted ? "Accepted" : "Pending"}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-slate-400">{INVITE.forms}</p>
          </div>
          <div className="mt-6 flex justify-end"><PrimaryBtn label="Start the sprint" onClick={onNext} icon="bolt" /></div>
        </Card>
      }
      right={
        <div className="space-y-4">
          <RailTitle>The setup</RailTitle>
          <Card className="bg-sage-tint/20"><p className="flex items-center gap-2 font-bold text-foreground"><Icon name="message" className="h-4 w-4 text-sage" /> Individual input</p><p className="mt-1.5 text-sm text-slate-600">Everyone feeds one shared agent separately — no group chat.</p></Card>
          <Card><p className="flex items-center gap-2 font-bold text-foreground"><Icon name="coins" className="h-4 w-4 text-sage" /> Buy-in</p><p className="mt-1.5 text-sm text-slate-600">Seed is $50 per person. Part goes to the Flash Fund for fast seed funding.</p></Card>
        </div>
      }
    />
  );
}

/* --------------------------------------------------------- 1. Input */
// A pure data dump: six sections of mixed-format questions. Answers live in
// local state and aren't wired anywhere yet.

type MultiVal = { sel: string[]; other: string };
type SelectVal = { choice: string; note: string };
type RankedVal = { ranked: string[]; note: string };

const asStr = (v: unknown) => (typeof v === "string" ? v : "");
const asArr = (v: unknown) => (Array.isArray(v) ? (v as string[]) : []);
function asMulti(v: unknown): MultiVal {
  return v && typeof v === "object" && Array.isArray((v as MultiVal).sel) ? (v as MultiVal) : { sel: [], other: "" };
}
function asSelect(v: unknown): SelectVal {
  return v && typeof v === "object" && "choice" in v ? (v as SelectVal) : { choice: "", note: "" };
}
function asRanked(v: unknown): RankedVal {
  return v && typeof v === "object" && "ranked" in v ? (v as RankedVal) : { ranked: [], note: "" };
}
function isAnswered(v: unknown): boolean {
  if (v == null) return false;
  if (typeof v === "string") return v.trim().length > 0;
  if (typeof v === "number") return v > 0;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "object") return Object.values(v as Record<string, unknown>).some(isAnswered);
  return false;
}

function InputPhase({ onNext }: { onNext: () => void }) {
  const [section, setSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [voiceMode, setVoiceMode] = useState<Record<string, boolean>>({});
  const sec = INTAKE[section];
  const isLast = section === INTAKE.length - 1;
  const update = (id: string, value: unknown) => setAnswers((a) => ({ ...a, [id]: value }));
  const answeredIn = (s: IntakeSection) => s.questions.filter((q) => isAnswered(answers[q.id])).length;
  const total = INTAKE.reduce((n, s) => n + answeredIn(s), 0);
  return (
    <Columns
      left={<IntakeNav current={section} onJump={setSection} answeredIn={answeredIn} />}
      center={
        <Card className="p-6">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide text-sage-dark">Section {section + 1} of {INTAKE.length}</span>
            <span className="text-xs font-semibold text-slate-400">{total}/{INTAKE_TOTAL} answered</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{sec.title}</h1>
          <p className="mt-1 text-slate-500">{sec.blurb}</p>

          <div className="mt-6 space-y-6">
            {sec.questions.map((q) => (
              <QuestionField key={q.id} q={q} value={answers[q.id]} onChange={(v) => update(q.id, v)} voice={!!voiceMode[q.id]} onVoice={() => setVoiceMode((m) => ({ ...m, [q.id]: !m[q.id] }))} />
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
            <button onClick={() => setSection((s) => Math.max(0, s - 1))} disabled={section === 0} className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40">Back</button>
            {isLast
              ? <PrimaryBtn label="Submit intake" onClick={onNext} icon="check" />
              : <PrimaryBtn label={`Next: ${INTAKE[section + 1].title}`} onClick={() => setSection((s) => s + 1)} icon="send" />}
          </div>
        </Card>
      }
      right={
        <div className="space-y-4">
          <RailTitle>How input works</RailTitle>
          <Card><p className="text-sm text-slate-600"><span className="font-semibold text-foreground">Just dump it.</span> No wrong answers — get it down, refine later.</p></Card>
          <Card><p className="text-sm text-slate-600"><span className="font-semibold text-foreground">Voice or text.</span> Any prompt with a mic can be a 2-minute voice memo.</p></Card>
          <Card><p className="text-sm text-slate-600"><span className="font-semibold text-foreground">Private.</span> Your answers stay yours until the team synthesis runs.</p></Card>
          <Card className="bg-sage-tint/30"><p className="flex items-center gap-2 text-sm font-bold text-foreground"><Icon name="clock" className="h-4 w-4 text-sage" /> Deadline</p><p className="mt-1 text-sm text-slate-600">12 hours from team formation.</p></Card>
        </div>
      }
    />
  );
}

function IntakeNav({ current, onJump, answeredIn }: { current: number; onJump: (i: number) => void; answeredIn: (s: IntakeSection) => number }) {
  return (
    <div className="space-y-4">
      <RailTitle>Your intake</RailTitle>
      <p className="px-1 text-xs text-slate-400">Answer in any order. Anonymous to the group until synthesis.</p>
      <div className="space-y-1.5">
        {INTAKE.map((s, i) => {
          const a = answeredIn(s);
          const done = a === s.questions.length;
          const active = i === current;
          return (
            <button key={s.id} onClick={() => onJump(i)} className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${active ? "border-sage bg-sage-tint/30" : "border-transparent hover:bg-slate-50"}`}>
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${done ? "bg-sage text-white" : active ? "bg-sage/20 text-sage-dark" : "bg-slate-100 text-slate-400"}`}>{done ? <Icon name="check" className="h-3 w-3" /> : i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className={`block truncate text-sm font-semibold ${active ? "text-sage-dark" : "text-slate-600"}`}>{s.title}</span>
                <span className="block text-[11px] text-slate-400">{a}/{s.questions.length}</span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-2 px-1 pt-1">
        <div className="flex -space-x-2">{COHORT.map((m) => <Avatar key={m.id} m={m} size="h-7 w-7 text-[10px]" />)}</div>
        <p className="text-xs text-slate-400">Maya {`(you)`}, Alex, and Priya each fill this in separately.</p>
      </div>
    </div>
  );
}

function QuestionField({ q, value, onChange, voice, onVoice }: { q: IntakeQuestion; value: unknown; onChange: (v: unknown) => void; voice: boolean; onVoice: () => void }) {
  const f = q.field;
  return (
    <div>
      <label className="block text-sm font-semibold text-foreground">{q.q}{q.optional && <span className="ml-1.5 text-xs font-normal text-slate-400">(optional)</span>}</label>
      {q.help && <p className="mt-0.5 text-xs text-slate-400">{q.help}</p>}
      <div className="mt-2">
        {(f.kind === "short" || f.kind === "long") && <TextControl value={asStr(value)} onChange={onChange} max={f.max} placeholder={f.placeholder} multiline={f.kind === "long"} voiceable={f.voice} voice={voice} onVoice={onVoice} />}
        {f.kind === "slider" && <SliderControl value={typeof value === "number" ? value : f.min} onChange={onChange} min={f.min} max={f.max} step={f.step} unit={f.unit} />}
        {f.kind === "location" && <LocationControl value={asStr(value)} onChange={onChange} placeholder={f.placeholder} />}
        {f.kind === "multiLocation" && <ChipsInput value={asArr(value)} onChange={onChange} />}
        {f.kind === "multiSelect" && <MultiSelectControl value={asMulti(value)} onChange={onChange} options={f.options} allowOther={f.allowOther} />}
        {f.kind === "select" && <SelectControl value={asSelect(value)} onChange={onChange} options={f.options} />}
        {f.kind === "ranked" && <RankedControl value={asRanked(value)} onChange={onChange} options={f.options} />}
      </div>
    </div>
  );
}

function TextControl({ value, onChange, max, placeholder, multiline, voiceable, voice, onVoice }: { value: string; onChange: (v: string) => void; max?: number; placeholder?: string; multiline?: boolean; voiceable?: boolean; voice?: boolean; onVoice: () => void }) {
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
          : <input value={value} onChange={(e) => onChange(e.target.value)} maxLength={max} placeholder={placeholder} className="w-full rounded-xl border border-slate-200 p-3 pr-10 text-sm text-foreground focus:border-sage focus:outline-none" />}
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

function ChipsInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState("");
  const add = () => { const t = draft.trim(); if (t && !value.includes(t)) onChange([...value, t]); setDraft(""); };
  return (
    <div>
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 p-2 focus-within:border-sage">
        <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} placeholder="Add a place, press Enter" className="min-w-0 flex-1 px-1 text-sm text-foreground focus:outline-none" />
        <button onClick={add} className="shrink-0 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200">Add</button>
      </div>
      {value.length > 0 && <div className="mt-2 flex flex-wrap gap-2">{value.map((c) => <span key={c} className="inline-flex items-center gap-1 rounded-lg bg-sage-tint px-2.5 py-1 text-xs font-medium text-sage-dark">{c}<button onClick={() => onChange(value.filter((x) => x !== c))} aria-label={`Remove ${c}`} className="text-sage-dark/60 hover:text-sage-dark"><Icon name="minus" className="h-3 w-3" /></button></span>)}</div>}
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

function SelectControl({ value, onChange, options }: { value: SelectVal; onChange: (v: SelectVal) => void; options: string[] }) {
  const items = [...options, "Other"];
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {items.map((o) => { const on = value.choice === o; return <button key={o} onClick={() => onChange({ ...value, choice: o })} className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${on ? "border-sage bg-sage text-white" : "border-slate-200 text-slate-600 hover:border-sage/50"}`}>{o}</button>; })}
      </div>
      <input value={value.note} onChange={(e) => onChange({ ...value, note: e.target.value })} placeholder="Add a line if you like" className="mt-2 w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-sage focus:outline-none" />
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
            {on && <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] text-sage-dark">{idx + 1}</span>}{o}
          </button>
        ); })}
      </div>
      <input value={value.note} onChange={(e) => onChange({ ...value, note: e.target.value })} placeholder="Anything to add" className="mt-2 w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-sage focus:outline-none" />
    </div>
  );
}

/* ----------------------------------------------------- 2. Synthesis */

function SynthesisPhase({ onNext }: { onNext: () => void }) {
  return (
    <Columns
      left={
        <div className="space-y-4">
          <RailTitle>What the agent did</RailTitle>
          {[
            { icon: "doc" as IconName, t: "Read every answer", d: "Across all three intakes." },
            { icon: "chart" as IconName, t: "Deep market research", d: "Gaps, documented pain points, first principles." },
            { icon: "sparkle" as IconName, t: "Best practices", d: "Lean startup, growth hacking, org singularity." },
          ].map((s) => (
            <Card key={s.t}><div className="flex gap-3"><RailIcon name={s.icon} /><div><p className="font-bold text-foreground">{s.t}</p><p className="mt-0.5 text-sm text-slate-600">{s.d}</p></div></div></Card>
          ))}
        </div>
      }
      center={
        <Card className="p-6">
          <CenterHead title="Synthesis" sub="Your convergence map, and the opportunity spaces it points to." />
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">Convergence map</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {CONVERGENCE_SIGNALS.map((s) => (
              <div key={s.kind} className={`rounded-xl border p-3 ${s.tone === "warn" ? "border-amber-200 bg-amber-50/60" : "border-sage/30 bg-sage-tint/20"}`}>
                <p className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide ${s.tone === "warn" ? "text-amber-700" : "text-sage-dark"}`}><Icon name={s.icon} className="h-3.5 w-3.5" />{s.kind}</p>
                <p className="mt-1 text-sm text-slate-700">{s.text}</p>
              </div>
            ))}
          </div>

          <p className="mb-3 mt-7 text-xs font-bold uppercase tracking-wide text-slate-400">Opportunity spaces</p>
          <div className="space-y-3">
            {OPPORTUNITY_SPACES.map((o) => (
              <div key={o.id} className={`rounded-xl border p-4 ${o.top ? "border-sage bg-sage-tint/20" : "border-slate-200"}`}>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-foreground">{o.title}</p>
                  {o.top && <span className="rounded-full bg-sage px-2 py-0.5 text-[10px] font-bold uppercase text-white">Top space</span>}
                  <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-slate-500"><Icon name="thumb" className="h-3.5 w-3.5" />{o.votes}</span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{o.text}</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2"><Bars label="Spark" value={o.spark} /><Bars label="Conviction" value={o.conviction} /></div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end"><PrimaryBtn label="See venture outlines" onClick={onNext} icon="sparkle" /></div>
        </Card>
      }
      right={
        <div className="space-y-4">
          <RailTitle>Your input</RailTitle>
          <Card><p className="text-sm text-slate-600">Spark and conviction are your sliders — how much energy and belief each space pulls from the team.</p></Card>
          <Card className="bg-sage-tint/30"><p className="flex items-center gap-2 text-sm font-bold text-foreground"><Icon name="comment" className="h-4 w-4 text-sage" /> Comment & vote</p><p className="mt-1 text-sm text-slate-600">Each person weighs in before the agent drafts ventures.</p></Card>
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
    <Columns
      left={
        <div className="space-y-4">
          <RailTitle>Venture outlines</RailTitle>
          <p className="px-1 text-xs text-slate-400">Anonymous voting until reveal. Clear thresholds. The agent mediates revisions.</p>
          {VENTURES.map((x) => {
            const active = x.id === ventureId;
            return (
              <button key={x.id} onClick={() => onSelect(x.id)} className={`block w-full rounded-xl border p-3 text-left transition-colors ${active ? "border-sage bg-sage-tint/20 ring-1 ring-sage" : "border-slate-200 hover:border-sage/50"}`}>
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
      }
      center={
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
      }
      right={
        <div className="lg:sticky lg:top-4 lg:self-start">
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
            <RailTitle>Deliberation</RailTitle>
            <div className="grid gap-3"><Bars label="Spark" value={v.spark} /><Bars label="Conviction" value={v.conviction} /></div>
            <div className="flex gap-2">
              <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-sage py-2.5 text-sm font-semibold text-white"><Icon name="thumb" className="h-4 w-4" /> Vote</button>
              <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-slate-600"><Icon name="comment" className="h-4 w-4" /> Comment</button>
            </div>
            <p className="text-xs text-slate-400">All three vote independently within 12 hours. Votes reveal together.</p>
          </div>
        </div>
      }
    />
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

function ValidationPhase({ name, venture, checkin, onCheckin, published, onPublish }: { name: string; venture: VentureDraft; checkin: string; onCheckin: (d: string) => void; published: boolean; onPublish: (p: boolean) => void }) {
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
        </div>
      }
      center={
        <Card className="p-6">
          <CenterHead title={`Validate ${name}`} sub="Test the riskiest assumptions with real people before you build." />
          <Section title="Hypothesis">
            <div className="rounded-xl bg-sage-tint/30 p-4 text-foreground">{v.hypothesis}</div>
            <ul className="mt-3 space-y-1.5">{v.assumptions.map((a) => <li key={a} className="flex items-start gap-2 text-sm text-slate-700"><Icon name="target" className="mt-0.5 h-4 w-4 shrink-0 text-sage" />{a}</li>)}</ul>
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
      right={
        <div className="space-y-4">
          <RailTitle>What you walk away with</RailTitle>
          <Card className="bg-sage-tint/20"><p className="font-bold text-foreground">{name}</p><p className="mt-0.5 text-sm text-slate-600">Venture locked. Validation assets generated.</p></Card>
          <Card><ul className="space-y-1.5">{["Venture details & roles", "Team alignment & cap table", "Hosted landing page", "Live signups dashboard", "Pitch deck", "Outreach copy"].map((x) => <CheckRow key={x} label={x} />)}</ul></Card>
          <Card className="bg-slate-50"><p className="flex items-center gap-2 text-sm font-bold text-foreground"><Icon name="heart" className="h-4 w-4 text-sage" /> The Flash Fund</p><p className="mt-1 text-sm text-slate-600">Part of every buy-in seeds ventures that emerge here.</p></Card>
        </div>
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
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        <span className="ml-3 rounded-md bg-white px-2 py-0.5 text-[11px] text-slate-400">relaunch.co</span>
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
        <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
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
              <div className="mt-4 inline-flex items-center gap-2 self-start rounded-xl bg-foreground px-4 py-2 text-sm font-bold text-white">
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

function EditableArea({ value, onChange, className = "", rows = 2 }: { value: string; onChange: (v: string) => void; className?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className={`-mx-1.5 w-full resize-y rounded-md border border-transparent bg-transparent px-1.5 py-1 leading-snug hover:border-slate-200 focus:border-sage focus:bg-white focus:outline-none ${className}`}
    />
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
  const [lensId, setLensId] = useState(LENSES[0].id);
  const lens = LENSES.find((l) => l.id === lensId) ?? LENSES[0];
  const set = <K extends keyof VentureDraft,>(key: K, val: VentureDraft[K]) => onVenture((p) => ({ ...p, [key]: val }));
  const setProblem = (patch: Partial<VentureDraft["problem"]>) => onVenture((p) => ({ ...p, problem: { ...p.problem, ...patch } }));
  const setDiff = (patch: Partial<VentureDraft["differentiation"]>) => onVenture((p) => ({ ...p, differentiation: { ...p.differentiation, ...patch } }));
  const toggleStory = (s: string) => onVenture((p) => ({ ...p, story: p.story.includes(s) ? p.story.filter((x) => x !== s) : [...p.story, s] }));
  return (
    <div className="mt-5 space-y-5">
      <Section title="Purpose">
        <div className="rounded-xl border border-sage/30 bg-sage-tint/20 p-4">
          <p className="text-xs italic text-slate-400">Start with a clear why.</p>
          <EditableArea value={venture.purpose} onChange={(val) => set("purpose", val)} className="mt-1 text-foreground" />
        </div>
      </Section>

      <ProblemBreakdown problem={venture.problem} set={setProblem} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Section title="Solution"><div className="h-full rounded-xl border border-slate-200 p-4"><EditableArea value={venture.solution} onChange={(val) => set("solution", val)} className="text-sm text-foreground" rows={3} /></div></Section>
        <Section title="Market"><div className="h-full rounded-xl border border-slate-200 p-4"><EditableArea value={venture.market} onChange={(val) => set("market", val)} className="text-sm text-foreground" rows={3} /></div></Section>
      </div>

      <DifferentiationBlock diff={venture.differentiation} set={setDiff} />
      <RevenueBreakdown revenue={venture.revenue} onChange={(r) => set("revenue", r)} />

      <Section title="Only we can do this">
        <div className="rounded-xl border border-slate-200 p-4"><EditableArea value={venture.unique} onChange={(val) => set("unique", val)} className="text-sm text-foreground" /></div>
      </Section>

      <Section title="See it through lenses">
        <p className="-mt-1 mb-3 text-xs text-slate-400">Zoom out to spot the big opportunity, then zoom in to make it real. Pull the bits that ring true — they feed the story.</p>
        <LensTabs lensId={lensId} onPick={setLensId} />
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <LensPanel lens={lens} pulled={venture.story} onPull={toggleStory} />
          <StoryPanel pulled={venture.story} onRemove={toggleStory} />
        </div>
      </Section>

      <FullVentureDetails venture={venture} onVenture={onVenture} recorded={recorded} onRecord={onRecord} onNext={onNext} />
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
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {DIFFERENTIATION.guidance.map((g) => (
            <div key={g.key} className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs font-bold text-sage-dark">{g.key}</p>
              <p className="text-[11px] font-medium text-slate-400">{g.prompt}</p>
              <p className="mt-1 text-sm text-slate-700">{g.text}</p>
            </div>
          ))}
        </div>
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
                  <div key={d.key} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-2.5">
                    <span className="text-sm text-slate-600">{d.label}</span>
                    <span className="flex items-center gap-0.5">
                      {d.prefix && <span className="text-sm text-slate-400">{d.prefix}</span>}
                      <input inputMode="numeric" value={revenue.drivers[d.key] ?? 0} onChange={(e) => setDriver(d.key, Number(e.target.value.replace(/[^0-9]/g, "")) || 0)} className="w-24 rounded-md border border-slate-200 px-2 py-1 text-right text-sm tabular-nums focus:border-sage focus:outline-none" />
                      {d.suffix && <span className="text-sm text-slate-400">{d.suffix}</span>}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-2.5">
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
              <div className="mt-3 rounded-lg bg-foreground px-3 py-2 text-center">
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
                <td className="p-3"><input value={r.vesting} onChange={(e) => setRow(i, { vesting: e.target.value })} className="-mx-1.5 w-full rounded-md border border-transparent bg-transparent px-1.5 py-1 text-slate-600 hover:border-slate-200 focus:border-sage focus:bg-white focus:outline-none" /></td>
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
          <button className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"><Icon name="copy" className="h-3.5 w-3.5" /> Copy link</button>
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
    <Section title="Scorecard · what we're testing">
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

/* -------------------------------------------------- synthesis: the lenses */

function LensTabs({ lensId, onPick }: { lensId: string; onPick: (id: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {LENSES.map((l, i) => {
        const active = l.id === lensId;
        const bandStart = i > 0 && LENSES[i - 1].band !== l.band;
        return (
          <Fragment key={l.id}>
            {bandStart && <span className="mx-1 hidden h-5 w-px bg-slate-200 sm:block" aria-hidden="true" />}
            <button onClick={() => onPick(l.id)} className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${active ? "border-sage bg-sage text-white" : "border-slate-200 text-slate-600 hover:border-sage/50"}`}>
              <Icon name={l.icon} className="h-3.5 w-3.5" /> {l.name}
            </button>
          </Fragment>
        );
      })}
    </div>
  );
}

function LensPanel({ lens, pulled, onPull }: { lens: Lens; pulled: string[]; onPull: (s: string) => void }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-sage-dark"><Icon name={lens.icon} className="h-4 w-4" /> {lens.name} lens</p>
      <p className="mt-1.5 text-xs italic text-slate-400">{lens.question}</p>
      <p className="mt-2 text-sm font-medium text-foreground">{lens.reframe}</p>
      <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-slate-400">Pull what rings true</p>
      <div className="mt-2 space-y-2">
        {lens.insights.map((ins) => {
          const on = pulled.includes(ins);
          return (
            <button key={ins} onClick={() => onPull(ins)} className={`flex w-full items-start gap-2.5 rounded-lg border p-2.5 text-left text-sm transition-colors ${on ? "border-sage bg-sage-tint/30 text-foreground" : "border-slate-200 text-slate-700 hover:border-sage/50"}`}>
              <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${on ? "bg-sage text-white" : "border border-slate-300"}`}>
                {on && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5"><path d="m5 12 5 5L20 7" /></svg>}
              </span>
              <span className="flex-1">{ins}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StoryPanel({ pulled, onRemove }: { pulled: string[]; onRemove: (s: string) => void }) {
  return (
    <div className="rounded-xl border border-sage/40 bg-sage-tint/20 p-4">
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-sage-dark">
        <Icon name="sparkle" className="h-4 w-4" /> Your story so far
        <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-500">{pulled.length} pulled</span>
      </p>
      {pulled.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">Pull bits from the lenses — they collect here into a clear, concrete story you can build the venture from.</p>
      ) : (
        <ul className="mt-3 space-y-1.5">
          {pulled.map((p) => (
            <li key={p} className="flex items-start gap-2 rounded-lg bg-white/70 p-2.5 text-sm text-slate-700">
              <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
              <span className="flex-1">{p}</span>
              <button onClick={() => onRemove(p)} aria-label="Remove from story" className="shrink-0 text-slate-300 transition-colors hover:text-slate-500"><Icon name="minus" className="h-4 w-4" /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------------------------- validation assets, generated from the venture */

// The deck and landing are built live from the editable venture draft, so
// edits in Ventures (and the cap table / revenue model) feed straight through.
function buildDeck(v: VentureDraft, name: string): DeckSlide[] {
  const model = REVENUE_MODELS.find((m) => m.id === v.revenue.id) ?? REVENUE_MODELS[0];
  const build = revenueBuild(v.revenue.id, v.revenue.drivers, v.revenue.growth);
  const founders = v.capTable.rows.map((r) => memberById(r.memberId).name).join(" · ");
  const team = v.capTable.rows.map((r) => ({ memberId: r.memberId, role: r.role, equity: r.equity }));
  return [
    { kind: "title", label: "Title", headline: name, points: [v.thesis], footnote: `${founders} — founding team` },
    { label: "Problem", headline: "Parents who pause their careers face a cold, confidence-eroding path back.", points: ["Job boards screen people out the moment they see a two-year gap.", "No trusted, supportive route back — only a cold search box.", v.problem.payNow] },
    { label: "Solution", headline: v.solution, points: ["A community that gets it.", "Real, warm employer introductions.", "Confidence rebuilt and measured over 8 weeks."] },
    { label: "Why now", headline: "Returnships are going mainstream.", points: ["The motherhood penalty is finally in the spotlight.", "Flexible and returner hiring is becoming the default ask."] },
    { kind: "market", label: "Market", headline: v.market, points: ["Wedge: Maya's 4,000-member parent community.", "Expand into adjacent returner networks and employer partners."], footnote: `${money(build[2])} Y3 ${model.unit} (illustrative)` },
    { label: "Product", headline: "Recruit → 8-week programme → employer intros → measured outcomes.", points: ["A waitlist opens to the community.", "The cohort runs the guided 8-week programme.", "Warm employer intros, with outcomes tracked."] },
    { label: "Business model", headline: `${model.label}: ${model.pitch}`, points: [`Year 1: ${money(build[0])}`, `Year 3: ${money(build[2])} ${model.unit}`, `Growing ${v.revenue.growth}% a year`] },
    { kind: "traction", label: "Traction", headline: "Distribution and proof before a line of code.", points: ["4,000-member parent community", "Sold-out course — 80 parents, twice", "Validation waitlist live"] },
    { label: "Why us", headline: v.differentiation.statement, points: [v.unique] },
    { kind: "team", label: "Team", headline: "Three founders, one problem they can't stop noticing.", team },
    { kind: "ask", label: "The ask", headline: "Run the pilot, hit the day-30 gate, open cohort two.", points: ["First cohort: 12 parents.", "5 warm employer intros pre-lined.", "Day-30 go/no-go → a Series-A-ready traction story."] },
  ];
}

function buildLanding(v: VentureDraft): typeof VALIDATION.landing {
  return { ...VALIDATION.landing, subhead: v.solution };
}
