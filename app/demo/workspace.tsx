"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AGENT_NAME,
  CHOSEN_ID,
  COHORT,
  CONVERGENCE_SIGNALS,
  INPUT_STATUS,
  INVITE,
  OPPORTUNITY_SPACES,
  PHASES,
  QUESTIONS,
  SPRINT,
  TAGLINE,
  VALIDATION,
  VENTURES,
  VENTURE_DETAILS,
  YOU,
  memberById,
  type IconName,
  type Member,
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
  const [answered, setAnswered] = useState(0);
  const [ventureId, setVentureId] = useState(CHOSEN_ID);
  const [name, setName] = useState(VENTURE_DETAILS.name);
  const [recorded, setRecorded] = useState<Record<string, boolean>>(
    Object.fromEntries(VENTURE_DETAILS.commitments.map((c) => [c.memberId, c.recorded]))
  );
  const [checkin, setCheckin] = useState("Day 7");

  // Free stops at the venture outlines; validation is locked.
  const go = (i: number) => setPhase(isFree && i >= 4 ? 3 : i);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/70">
      <Header phase={phase} plan={plan} />
      <Timeline phase={phase} onJump={go} plan={plan} />
      <main className="mx-auto w-full max-w-[1500px] flex-1 px-5 py-6">
        {phase === 0 && <InvitePhase onNext={() => setPhase(1)} />}
        {phase === 1 && <InputPhase answered={answered} onAnswer={() => setAnswered((a) => Math.min(QUESTIONS.length, a + 1))} onNext={() => setPhase(2)} />}
        {phase === 2 && <SynthesisPhase onNext={() => setPhase(3)} />}
        {phase === 3 && <VenturesPhase plan={plan} ventureId={ventureId} onSelect={setVentureId} name={name} onName={setName} recorded={recorded} onRecord={(id) => setRecorded((r) => ({ ...r, [id]: !r[id] }))} onNext={() => setPhase(4)} />}
        {!isFree && phase === 4 && <ValidationPhase name={name} checkin={checkin} onCheckin={setCheckin} />}
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

function InputPhase({ answered, onAnswer, onNext }: { answered: number; onAnswer: () => void; onNext: () => void }) {
  const next = QUESTIONS[answered];
  const done = answered >= QUESTIONS.length;
  return (
    <Columns
      left={
        <div className="space-y-4">
          <RailTitle>Team input</RailTitle>
          <p className="px-1 text-xs text-slate-400">Each person answers privately. Anonymous to the group until synthesis.</p>
          {COHORT.map((m) => {
            const st = INPUT_STATUS[m.id];
            const isYou = m.id === YOU;
            const doneN = isYou ? answered : st.done;
            return (
              <Card key={m.id}>
                <div className="mb-2 flex items-center gap-2">
                  <Avatar m={m} size="h-7 w-7 text-[10px]" />
                  <span className="font-bold text-foreground">{m.name} {isYou && <span className="text-xs font-normal text-slate-400">(you)</span>}</span>
                  <span className="ml-auto text-xs font-semibold text-sage-dark">{doneN}/{st.total}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-sage" style={{ width: `${(doneN / st.total) * 100}%` }} /></div>
                {!isYou && <p className="mt-2 text-xs text-slate-400">{st.done >= st.total ? "Completed · anonymous" : "In progress · anonymous"}</p>}
              </Card>
            );
          })}
        </div>
      }
      center={
        <Card className="flex h-full flex-col p-6">
          <CenterHead title="Your 15 questions" sub="Answer privately — typed or voice. The agent asks one at a time." right={<span className="rounded-full bg-sage-tint px-3 py-1 text-xs font-semibold text-sage-dark">{answered}/{QUESTIONS.length}</span>} />
          <div className="flex-1 space-y-3">
            <Bubble agent text={`Welcome. I'll ask ${QUESTIONS.length} short questions — there are no wrong answers. Dump what's true.`} />
            {QUESTIONS.slice(0, answered).map((q, i) => (
              <div key={i} className="space-y-3">
                <Bubble agent text={`${i + 1}. ${q.q}`} />
                <Bubble text={q.a} voice={q.voice} />
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-slate-100 pt-4">
            {!done ? (
              <button onClick={onAnswer} className="flex w-full items-center gap-3 rounded-xl border border-dashed border-sage/50 bg-sage-tint/20 p-3 text-left transition-colors hover:bg-sage-tint/40">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-sage"><Icon name={next.voice ? "mic" : "message"} className="h-4 w-4" /></span>
                <span className="min-w-0 flex-1"><span className="block text-[11px] font-bold uppercase tracking-wide text-sage-dark">Question {answered + 1} · answer {next.voice ? "by voice" : "typed"}</span><span className="block truncate text-sm text-slate-600">{next.q}</span></span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sage text-white"><Icon name="send" className="h-4 w-4" /></span>
              </button>
            ) : (
              <div className="flex items-center justify-between gap-4 rounded-xl bg-sage-tint/40 p-3">
                <p className="text-sm font-semibold text-sage-dark">Submitted — private until {AGENT_NAME} synthesises all three.</p>
                <PrimaryBtn label="Run synthesis" onClick={onNext} icon="sparkle" />
              </div>
            )}
          </div>
        </Card>
      }
      right={
        <div className="space-y-4">
          <RailTitle>How input works</RailTitle>
          <Card><p className="text-sm text-slate-600"><span className="font-semibold text-foreground">Private link.</span> A simple form — 15–30 minutes.</p></Card>
          <Card><p className="text-sm text-slate-600"><span className="font-semibold text-foreground">Voice option.</span> Up to 2 minutes per answer.</p></Card>
          <Card><p className="text-sm text-slate-600"><span className="font-semibold text-foreground">Anonymous.</span> Hidden from the group until synthesis is complete.</p></Card>
          <Card className="bg-sage-tint/30"><p className="flex items-center gap-2 text-sm font-bold text-foreground"><Icon name="clock" className="h-4 w-4 text-sage" /> Deadline</p><p className="mt-1 text-sm text-slate-600">12 hours from team formation.</p></Card>
        </div>
      }
    />
  );
}

function Bubble({ agent, text, voice }: { agent?: boolean; text: string; voice?: boolean }) {
  if (agent) {
    return (
      <div className="flex items-start gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sage text-white"><svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5"><path d="M13 2 4.5 13.5H11l-1.5 8.5L20 9.5h-6.5L13 2Z" /></svg></span>
        <p className="max-w-md rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-2.5 text-sm text-slate-700">{text}</p>
      </div>
    );
  }
  return (
    <div className="flex justify-end">
      <div className="max-w-md rounded-2xl rounded-tr-sm bg-sage px-4 py-2.5 text-sm text-white">
        {voice && <span className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-white/80"><Icon name="mic" className="h-3.5 w-3.5" /> voice memo</span>}
        {text}
      </div>
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

function VenturesPhase({ plan, ventureId, onSelect, name, onName, recorded, onRecord, onNext }: { plan: "free" | "full"; ventureId: string; onSelect: (id: string) => void; name: string; onName: (n: string) => void; recorded: Record<string, boolean>; onRecord: (id: string) => void; onNext: () => void }) {
  const isFree = plan === "free";
  const v = VENTURES.find((x) => x.id === ventureId)!;
  const isChosen = v.id === CHOSEN_ID;
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

          <div className="rounded-xl border border-sage/30 bg-sage-tint/20 p-4"><p className="text-foreground">{v.thesis}</p></div>

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
            isFree ? (
              <div className="mt-6"><Upsell title="Full venture details are part of Seed" text="Origin story, team & equity, financials, the 7-day sprint, risk register, and the commitment ritual — plus the validation engine." /></div>
            ) : (
              <FullVentureDetails recorded={recorded} onRecord={onRecord} onNext={onNext} />
            )
          ) : (
            <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Select <span className="font-semibold text-foreground">{VENTURE_DETAILS.name}</span> (the top-voted venture) to see full details.</div>
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

function FullVentureDetails({ recorded, onRecord, onNext }: { recorded: Record<string, boolean>; onRecord: (id: string) => void; onNext: () => void }) {
  const d = VENTURE_DETAILS;
  return (
    <div className="mt-6 space-y-6 border-t border-slate-100 pt-6">
      <Section title="The origin story">
        <div className="space-y-2 text-sm text-slate-700">{d.origin.map((p, i) => <p key={i}>{p}</p>)}</div>
      </Section>

      <Section title="Team & resource map">
        <div className="space-y-2">
          {d.team.map((r) => { const m = memberById(r.memberId); return (
            <div key={r.memberId} className="rounded-xl border border-slate-200 p-3">
              <div className="flex items-center gap-3">
                <Avatar m={m} size="h-8 w-8 text-[10px]" />
                <p className="flex-1 text-sm font-semibold text-foreground">{m.name} · {r.role}</p>
                <span className="rounded-lg bg-sage px-2.5 py-1 text-sm font-bold text-white">{r.equity}%</span>
              </div>
              <div className="mt-2 grid gap-1 text-xs text-slate-600 sm:grid-cols-2">
                <p><span className="font-semibold text-slate-400">Responsibility:</span> {r.responsibility}</p>
                <p><span className="font-semibold text-slate-400">First tasks:</span> {r.tasks}</p>
                <p className="sm:col-span-2"><span className="font-semibold text-slate-400">Brings:</span> {r.resource}</p>
              </div>
            </div>
          ); })}
        </div>
      </Section>

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

function ValidationPhase({ name, checkin, onCheckin }: { name: string; checkin: string; onCheckin: (d: string) => void }) {
  const [channel, setChannel] = useState<(typeof CHANNELS)[number]["key"]>("linkedin");
  const v = VALIDATION;
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

          <div className="mt-6"><Section title="Landing page">
            <div className="rounded-2xl border border-slate-200 p-6">
              <div className="mb-4 flex items-center gap-2"><svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-sage"><path d="M13 2 4.5 13.5H11l-1.5 8.5L20 9.5h-6.5L13 2Z" /></svg><span className="font-bold text-foreground">{name}</span></div>
              <h3 className="text-2xl font-bold leading-tight tracking-tight text-foreground">{v.landing.headline}</h3>
              <p className="mt-2 text-slate-600">{v.landing.subhead}</p>
              <span className="mt-4 inline-flex h-11 items-center rounded-xl bg-sage px-5 text-sm font-bold text-white">{v.landing.cta}</span>
              <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-400"><Icon name="comment" className="h-3.5 w-3.5" /> Built-in feedback widget collects responses.</p>
            </div>
          </Section></div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Section title="Pitch deck">
              <div className="grid gap-2">{v.deck.slice(0, 4).map((s, i) => <div key={s.title} className="rounded-lg border border-slate-200 p-3"><p className="text-xs font-bold text-slate-400">Slide {i + 1}</p><p className="text-sm font-bold text-foreground">{s.title}</p></div>)}<p className="text-xs text-slate-400">+ {v.deck.length - 4} more slides (YC seed-deck format).</p></div>
            </Section>
            <Section title="Outreach copy">
              <div className="mb-3 flex flex-wrap gap-2">{CHANNELS.map((c) => <button key={c.key} onClick={() => setChannel(c.key)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${channel === c.key ? "bg-sage text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>{c.label}</button>)}</div>
              <p className="whitespace-pre-line rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">{v.outreach[channel]}</p>
            </Section>
          </div>

          <div className="mt-6"><Section title="Feedback synthesis">
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
          <Card><ul className="space-y-1.5">{["Venture details & roles", "Team alignment & clarity", "Landing page to test", "Pitch deck", "Outreach copy"].map((x) => <CheckRow key={x} label={x} />)}</ul></Card>
          <Card className="bg-slate-50"><p className="flex items-center gap-2 text-sm font-bold text-foreground"><Icon name="heart" className="h-4 w-4 text-sage" /> The Flash Fund</p><p className="mt-1 text-sm text-slate-600">Part of every buy-in seeds ventures that emerge here.</p></Card>
        </div>
      }
    />
  );
}
