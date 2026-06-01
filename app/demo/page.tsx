"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AGENT_INTRO,
  AGENT_NAME,
  BIRTH_CERTIFICATE,
  CHECKPOINTS,
  CHOSEN_ID,
  COHORT,
  COHORT_DUMPS,
  COHORT_READINESS,
  COMMITMENTS,
  CONVERGENCE_SIGNALS,
  DECISION_FRAMEWORK,
  DUMPS,
  EQUITY_NOTE,
  HYPOTHESES,
  OUTPUT_MENU,
  PHASES,
  ROLES,
  SPRINT,
  SUGGESTED_CONTACTS,
  TAGLINE,
  YOU,
  memberById,
  type DumpKind,
  type Hypothesis,
  type HypothesisStatus,
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
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {D[name].split("|").map((seg, i) => <path key={i} d={seg} />)}
    </svg>
  );
}

const KIND_ICON: Record<DumpKind, IconName> = { text: "message", voice: "mic", link: "link", image: "image", doc: "doc" };

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
function SageChip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-md bg-sage-tint px-2.5 py-1 text-xs font-medium text-sage-dark">{children}</span>;
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

/* ------------------------------------------------------------ the page */

export default function Demo() {
  const [phase, setPhase] = useState(0);
  const [dumps, setDumps] = useState(0);
  const [hypId, setHypId] = useState(CHOSEN_ID);
  const [statuses, setStatuses] = useState<Record<string, HypothesisStatus>>(
    Object.fromEntries(HYPOTHESES.map((h) => [h.id, h.status]))
  );
  const [recorded, setRecorded] = useState<Record<string, boolean>>(
    Object.fromEntries(COMMITMENTS.map((c) => [c.memberId, c.recorded]))
  );
  const [checkpoint, setCheckpoint] = useState("Day 7");

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/70">
      <Header phase={phase} />
      <Timeline phase={phase} onJump={setPhase} />
      <main className="mx-auto w-full max-w-[1500px] flex-1 px-5 py-6">
        {phase === 0 && <CohortPhase onNext={() => setPhase(1)} />}
        {phase === 1 && <ConvergencePhase dumps={dumps} onDump={() => setDumps((d) => Math.min(DUMPS.length, d + 1))} onNext={() => setPhase(2)} />}
        {phase === 2 && <FormationPhase hypId={hypId} onSelect={setHypId} statuses={statuses} setStatuses={setStatuses} onNext={() => setPhase(3)} />}
        {phase === 3 && <OutputPhase recorded={recorded} onRecord={(id) => setRecorded((r) => ({ ...r, [id]: !r[id] }))} onNext={() => setPhase(4)} />}
        {phase === 4 && <FollowThroughPhase active={checkpoint} onSelect={setCheckpoint} recorded={recorded} />}
      </main>
    </div>
  );
}

function Header({ phase }: { phase: number }) {
  const p = PHASES[phase];
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
            <Icon name="clock" className="h-3.5 w-3.5" /> {SPRINT.windowHours}h sprint · {p.day}
          </span>
          <div className="hidden items-center -space-x-2 sm:flex">
            {COHORT.map((m) => <Avatar key={m.id} m={m} />)}
          </div>
          <button className="inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <Icon name="group" className="h-4 w-4" /> Share
          </button>
        </div>
      </div>
    </header>
  );
}

function Timeline({ phase, onJump }: { phase: number; onJump: (n: number) => void }) {
  return (
    <nav className="border-b border-slate-200 bg-white">
      <ol className="mx-auto flex w-full max-w-[1500px] gap-2 overflow-x-auto px-5 py-3">
        {PHASES.map((p, i) => {
          const active = i === phase;
          const done = i < phase;
          return (
            <li key={p.id} className="flex flex-1 items-center gap-2">
              <button onClick={() => onJump(i)} className={`flex flex-1 items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors ${active ? "border-sage bg-sage-tint/40" : "border-transparent hover:bg-slate-50"}`}>
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${active ? "bg-sage text-white" : done ? "bg-sage/20 text-sage-dark" : "bg-slate-100 text-slate-400"}`}>{i + 1}</span>
                <span className="min-w-0">
                  <span className="block whitespace-nowrap text-[10px] font-bold uppercase tracking-wide text-slate-400">{p.day}</span>
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

/* -------------------------------------------------------- 0. Cohort */

function CohortPhase({ onNext }: { onNext: () => void }) {
  return (
    <Columns
      left={
        <div className="space-y-4">
          <RailTitle>Why this works</RailTitle>
          <Card>
            <p className="flex items-center gap-2 font-bold text-foreground"><Icon name="sparkle" className="h-4 w-4 text-sage" /> Invitation-driven trust</p>
            <p className="mt-1.5 text-sm text-slate-600">Someone you trust sends it: &ldquo;you&rsquo;re in, I&rsquo;m in, let&rsquo;s bring in a third.&rdquo; Low bar on time and input.</p>
          </Card>
          <Card>
            <p className="flex items-center gap-2 font-bold text-foreground"><Icon name="clock" className="h-4 w-4 text-sage" /> Time-boxed on purpose</p>
            <p className="mt-1.5 text-sm text-slate-600">A fixed {SPRINT.windowHours}-hour window forces action — the constraint is the feature.</p>
            <p className="mt-3 rounded-lg bg-sage-tint/40 px-3 py-2 text-center text-lg font-bold text-sage-dark">71:48 left</p>
          </Card>
        </div>
      }
      center={
        <Card className="p-6">
          <CenterHead title="Open the sprint" sub="Invite 3–5 people you trust. Each contributes individually — no group chat." />
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="mb-3 text-sm font-bold text-foreground">Your cohort</p>
            <ul className="space-y-2.5">
              {COHORT.map((m) => (
                <li key={m.id} className="flex items-center gap-3">
                  <Avatar m={m} />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground">{m.name} {m.id === YOU && <span className="text-xs font-normal text-slate-400">(you)</span>}</p>
                    <p className="truncate text-xs text-slate-500">{m.role} · {m.network}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${m.accepted ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{m.accepted ? "In" : "Invited"}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-foreground"><Icon name="coins" className="h-4 w-4 text-sage" /> Buy-in</p>
              <p className="mt-1.5 text-sm text-slate-600">{SPRINT.buyInTotal} total into the kitty ({SPRINT.buyInPer} each). Everyone has skin in the game.</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-foreground"><Icon name="message" className="h-4 w-4 text-sage" /> Individual input</p>
              <p className="mt-1.5 text-sm text-slate-600">Everyone feeds one shared agent separately. Group chats are a plague — not here.</p>
            </div>
          </div>
          <div className="mt-6 flex justify-end"><PrimaryBtn label="Start convergence" onClick={onNext} icon="bolt" /></div>
        </Card>
      }
      right={
        <div className="space-y-4">
          <RailTitle>Suggested from your contacts</RailTitle>
          {SUGGESTED_CONTACTS.map((c) => (
            <Card key={c.name}>
              <div className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">{c.name.split(" ").map((s) => s[0]).join("")}</span>
                <div><p className="font-semibold text-foreground">{c.name}</p><p className="mt-0.5 text-xs text-slate-500">{c.reason}</p></div>
              </div>
            </Card>
          ))}
          <p className="px-1 text-xs text-slate-400">Not a matching service — it works from who&rsquo;s already in the space, then suggests people you could test with.</p>
          <Card className="bg-sage-tint/30">
            <p className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground"><Icon name="check" className="h-4 w-4 text-sage" /> Readiness</p>
            <ul className="space-y-1.5">{COHORT_READINESS.map((r) => <CheckRow key={r.label} label={r.label} done={r.done} />)}</ul>
          </Card>
        </div>
      }
    />
  );
}

/* --------------------------------------------------- 1. Convergence */

function ConvergencePhase({ dumps, onDump, onNext }: { dumps: number; onDump: () => void; onNext: () => void }) {
  const next = DUMPS[dumps];
  const done = dumps >= DUMPS.length;
  const signals = CONVERGENCE_SIGNALS.slice(0, dumps);
  return (
    <Columns
      left={
        <div className="space-y-4">
          <RailTitle>Cohort contributions</RailTitle>
          <p className="px-1 text-xs text-slate-400">Each person dumps separately, async, across the 3 days.</p>
          {COHORT.map((m) => {
            const cd = COHORT_DUMPS[m.id];
            const isYou = m.id === YOU;
            return (
              <Card key={m.id}>
                <div className="mb-2 flex items-center gap-2">
                  <Avatar m={m} size="h-7 w-7 text-[10px]" />
                  <span className="font-bold text-foreground">{m.name} {isYou && <span className="text-xs font-normal text-slate-400">(you)</span>}</span>
                  <span className="ml-auto text-xs font-semibold text-sage-dark">{isYou ? dumps : cd?.count ?? 0} items</span>
                </div>
                {!isYou && cd && (
                  <>
                    <p className="text-xs text-slate-600">{cd.sample}</p>
                    <div className="mt-2 flex gap-1.5 text-slate-400">{cd.kinds.map((k) => <Icon key={k} name={KIND_ICON[k]} className="h-3.5 w-3.5" />)}</div>
                  </>
                )}
                {isYou && <p className="text-xs text-slate-400">Dumping now →</p>}
              </Card>
            );
          })}
        </div>
      }
      center={
        <Card className="flex h-full flex-col p-6">
          <CenterHead title="Convergence" sub="Dump anything — no structure. The agent reads across all five of you." />
          <div className="flex-1 space-y-3">
            <Bubble agent text={AGENT_INTRO} />
            {DUMPS.slice(0, dumps).map((d, i) => (
              <div key={i} className="space-y-3">
                <Bubble text={d.label} kind={d.kind} />
                <Bubble agent text={d.agent} />
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-slate-100 pt-4">
            {!done ? (
              <button onClick={onDump} className="flex w-full items-center gap-3 rounded-xl border border-dashed border-sage/50 bg-sage-tint/20 p-3 text-left transition-colors hover:bg-sage-tint/40">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-sage"><Icon name={KIND_ICON[next.kind]} className="h-4 w-4" /></span>
                <span className="min-w-0 flex-1"><span className="block text-[11px] font-bold uppercase tracking-wide text-sage-dark">Dump next ({next.kind})</span><span className="block truncate text-sm text-slate-600">{next.label}</span></span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sage text-white"><Icon name="send" className="h-4 w-4" /></span>
              </button>
            ) : (
              <div className="flex items-center justify-between gap-4 rounded-xl bg-sage-tint/40 p-3">
                <p className="text-sm font-semibold text-sage-dark">Convergence map complete — {AGENT_NAME} has the patterns.</p>
                <PrimaryBtn label="Go to Formation" onClick={onNext} icon="sparkle" />
              </div>
            )}
          </div>
        </Card>
      }
      right={
        <div className="space-y-4">
          <RailTitle>Convergence map</RailTitle>
          {signals.length === 0 && <Card><p className="text-sm text-slate-400">Patterns appear here as you dump.</p></Card>}
          {signals.map((s) => (
            <Card key={s.kind} className={s.tone === "warn" ? "border-amber-200 bg-amber-50/60" : "border-sage/30 bg-sage-tint/20"}>
              <div className="flex gap-3">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${s.tone === "warn" ? "bg-amber-100 text-amber-700" : "bg-sage-tint text-sage-dark"}`}><Icon name={s.icon} className="h-4 w-4" /></span>
                <div><p className={`text-xs font-bold uppercase tracking-wide ${s.tone === "warn" ? "text-amber-700" : "text-sage-dark"}`}>{s.kind}</p><p className="mt-0.5 text-sm text-slate-700">{s.text}</p></div>
              </div>
            </Card>
          ))}
        </div>
      }
    />
  );
}

function Bubble({ agent, text, kind }: { agent?: boolean; text: string; kind?: DumpKind }) {
  if (agent) {
    return (
      <div className="flex items-start gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sage text-white"><svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5"><path d="M13 2 4.5 13.5H11l-1.5 8.5L20 9.5h-6.5L13 2Z" /></svg></span>
        <p className="max-w-md rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-2.5 text-sm text-slate-700">{text}</p>
      </div>
    );
  }
  const attach = kind && kind !== "text";
  return (
    <div className="flex justify-end">
      <div className="max-w-md rounded-2xl rounded-tr-sm bg-sage px-4 py-2.5 text-sm text-white">
        {attach && <span className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-white/80"><Icon name={KIND_ICON[kind]} className="h-3.5 w-3.5" /> {kind}</span>}
        {text}
      </div>
    </div>
  );
}

/* ---------------------------------------------------- 2. Formation */

const STATUS_META: Record<HypothesisStatus, { label: string; cls: string }> = {
  approved: { label: "Approved", cls: "bg-emerald-100 text-emerald-700" },
  tumble: { label: "In the tumble dryer", cls: "bg-amber-100 text-amber-700" },
  folded: { label: "Folded into Relaunch", cls: "bg-slate-100 text-slate-600" },
  proposed: { label: "Under review", cls: "bg-sky-100 text-sky-700" },
};

function FormationPhase({ hypId, onSelect, statuses, setStatuses, onNext }: { hypId: string; onSelect: (id: string) => void; statuses: Record<string, HypothesisStatus>; setStatuses: (s: Record<string, HypothesisStatus>) => void; onNext: () => void }) {
  const hyp = HYPOTHESES.find((h) => h.id === hypId)!;
  const parked = HYPOTHESES.filter((h) => statuses[h.id] === "tumble");
  const setStatus = (id: string, st: HypothesisStatus) => setStatuses({ ...statuses, [id]: st });
  return (
    <Columns
      left={
        <div className="space-y-4">
          <RailTitle>Deliberation</RailTitle>
          <Card>
            <p className="text-sm text-slate-600">The agent proposed {HYPOTHESES.length} ranked hypotheses. Vote, challenge, pivot — or park anything in the tumble dryer.</p>
          </Card>
          <Card>
            <p className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground"><Icon name="pause" className="h-4 w-4 text-amber-500" /> Tumble dryer</p>
            {parked.length === 0 ? <p className="text-sm text-slate-400">Nothing parked.</p> : (
              <ul className="space-y-1.5">{parked.map((h) => <li key={h.id} className="text-sm text-slate-600">{h.title}</li>)}</ul>
            )}
          </Card>
        </div>
      }
      center={
        <Card className="p-6">
          <CenterHead title="Formation" sub="Ranked venture hypotheses from your convergence map." />
          <div className="space-y-3">
            {HYPOTHESES.map((h) => {
              const active = h.id === hypId;
              const st = statuses[h.id];
              return (
                <button key={h.id} onClick={() => onSelect(h.id)} className={`block w-full rounded-xl border p-4 text-left transition-colors ${active ? "border-sage bg-sage-tint/20 ring-1 ring-sage" : "border-slate-200 hover:border-sage/50"}`}>
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">{h.rank}</span>
                    <span className="font-bold text-foreground">{h.title}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_META[st].cls}`}>{STATUS_META[st].label}</span>
                    <span className="ml-auto rounded-lg bg-sage-tint px-2 py-0.5 text-sm font-bold text-sage-dark">{h.score}</span>
                  </div>
                  <p className="text-sm text-slate-600">{h.note}</p>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex justify-end"><PrimaryBtn label="Lock the venture & generate output" onClick={onNext} icon="bolt" /></div>
        </Card>
      }
      right={
        <div className="lg:sticky lg:top-4 lg:self-start">
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <RailTitle>Selected hypothesis</RailTitle>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_META[statuses[hyp.id]].cls}`}>{STATUS_META[statuses[hyp.id]].label}</span>
            </div>
            <p className="text-xl font-bold text-foreground">{hyp.title}</p>
            <Field label="Customer" value={hyp.customer} />
            <Field label="Problem" value={hyp.problem} />
            <Field label="Why this team" value={hyp.whyTeam} />
            <Field label="Validation plan" value={hyp.validation} />
            <div className="flex gap-4 rounded-lg bg-slate-50 p-3 text-center text-xs">
              <div className="flex-1"><p className="text-base font-bold text-emerald-600">{hyp.votes.approve}</p><p className="text-slate-500">approve</p></div>
              <div className="flex-1"><p className="text-base font-bold text-amber-600">{hyp.votes.challenge}</p><p className="text-slate-500">challenge</p></div>
              <div className="flex-1"><p className="text-base font-bold text-sky-600">{hyp.votes.pivot}</p><p className="text-slate-500">pivot</p></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <VoteBtn icon="thumb" label="Approve" tone="bg-sage text-white" onClick={() => setStatus(hyp.id, "approved")} />
              <VoteBtn icon="alert" label="Challenge" tone="border border-slate-200 text-slate-600" onClick={() => setStatus(hyp.id, "proposed")} />
              <VoteBtn icon="refresh" label="Pivot" tone="border border-slate-200 text-slate-600" onClick={() => setStatus(hyp.id, "proposed")} />
              <VoteBtn icon="pause" label="Park" tone="border border-slate-200 text-slate-600" onClick={() => setStatus(hyp.id, "tumble")} />
            </div>
          </div>
        </div>
      }
    />
  );
}

function VoteBtn({ icon, label, tone, onClick }: { icon: IconName; label: string; tone: string; onClick: () => void }) {
  return <button onClick={onClick} className={`inline-flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-semibold transition-colors hover:opacity-90 ${tone}`}><Icon name={icon} className="h-4 w-4" />{label}</button>;
}
function Field({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs font-bold text-slate-400">{label}</p><p className="mt-0.5 text-sm text-slate-600">{value}</p></div>;
}

/* ------------------------------------------------------- 3. Output */

function OutputPhase({ recorded, onRecord, onNext }: { recorded: Record<string, boolean>; onRecord: (id: string) => void; onNext: () => void }) {
  const recordedCount = Object.values(recorded).filter(Boolean).length;
  return (
    <Columns
      left={
        <div className="space-y-4">
          <RailTitle>Venture birth certificate</RailTitle>
          <Card className="p-2 lg:sticky lg:top-4">
            <ul className="space-y-1">
              {OUTPUT_MENU.map((m) => (
                <li key={m.id}>
                  <a href={`#${m.id}`} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-sage-dark">
                    <Icon name={m.icon} className="h-4 w-4" />{m.label}
                  </a>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      }
      center={
        <Card className="p-6">
          <CenterHead title="Output — Day 3" sub="Your venture birth certificate, ready to share. One page, top to bottom." right={<button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"><Icon name="doc" className="h-4 w-4" /> Export</button>} />
          <div className="divide-y divide-slate-100">
            {OUTPUT_MENU.map((m) => (
              <section key={m.id} id={m.id} className="scroll-mt-6 py-8 first:pt-0 last:pb-0">
                <h2 className="mb-4 flex items-center gap-2.5 text-lg font-bold text-foreground"><RailIcon name={m.icon} />{m.label}</h2>
                <SectionBody id={m.id} recorded={recorded} onRecord={onRecord} />
              </section>
            ))}
          </div>
          <div className="mt-6 flex justify-end"><PrimaryBtn label="Set up follow-through" onClick={onNext} icon="calendar" /></div>
        </Card>
      }
      right={
        <div className="space-y-4">
          <RailTitle>Status</RailTitle>
          <Card className="bg-sage-tint/20">
            <p className="font-bold text-foreground">Relaunch</p>
            <p className="mt-0.5 text-sm text-slate-600">Venture locked. All assets generated.</p>
          </Card>
          <Card>
            <p className="mb-2 text-sm font-bold text-foreground">Commitment ritual</p>
            <p className="text-sm text-slate-600">{recordedCount} of {COMMITMENTS.length} founders have recorded their 30-second commitment.</p>
          </Card>
          <Card className="bg-slate-50">
            <p className="flex items-center gap-2 text-sm font-bold text-foreground"><Icon name="lock" className="h-4 w-4 text-slate-400" /> Then the agent goes quiet</p>
            <p className="mt-1.5 text-sm text-slate-600">After day 3 it returns only at day 7, 14, 21 and 30. The work is yours.</p>
          </Card>
        </div>
      }
    />
  );
}

function SectionBody({ id, recorded, onRecord }: { id: string; recorded: Record<string, boolean>; onRecord: (id: string) => void }) {
  const b = BIRTH_CERTIFICATE;
  if (id === "thesis") return <Thesis />;
  if (id === "charter") return <ul className="space-y-2">{b.charter.map((c) => <li key={c} className="flex gap-2 text-foreground"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-sage" />{c}</li>)}</ul>;
  if (id === "roles") return (
    <>
      <div className="space-y-2">{ROLES.map((r) => { const m = memberById(r.memberId); return (
        <div key={r.memberId} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
          <Avatar m={m} size="h-8 w-8 text-[10px]" />
          <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-foreground">{m.name} · {r.title}</p><p className="text-xs text-slate-500">{r.responsibilities}</p></div>
          <span className="rounded-lg bg-sage px-2.5 py-1 text-sm font-bold text-white">{r.equity}%</span>
        </div>); })}</div>
      <p className="mt-3 text-xs text-slate-500">{EQUITY_NOTE}</p>
    </>
  );
  if (id === "decisions") return <ul className="space-y-2">{DECISION_FRAMEWORK.map((d) => <li key={d} className="flex gap-2 text-foreground"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-sage" />{d}</li>)}</ul>;
  if (id === "roadmap") return (
    <div className="space-y-2">{b.roadmap.map((w) => (
      <div key={w.week} className="flex gap-3 rounded-lg border border-slate-200 p-3"><span className="shrink-0 rounded-md bg-sage-tint px-2 py-1 text-xs font-bold text-sage-dark">{w.week}</span><p className="text-sm text-slate-700">{w.text}</p></div>
    ))}</div>
  );
  if (id === "deck") return (
    <>
      <p className="mb-3 text-xs text-slate-400">{b.deckNote}</p>
      <div className="grid gap-3 sm:grid-cols-2">{b.deck.map((s, i) => (
        <div key={s.title} className="rounded-xl border border-slate-200 p-4"><p className="text-xs font-bold text-slate-400">Slide {i + 1}</p><p className="mt-1 font-bold text-foreground">{s.title}</p><p className="mt-1 text-sm text-slate-600">{s.body}</p></div>
      ))}</div>
    </>
  );
  if (id === "landing") return <LandingPreview />;
  if (id === "outreach") return <Outreach />;
  if (id === "validation") return (
    <>
      <p className="mb-2 text-xs font-bold text-slate-400">Tests we&rsquo;ll run</p>
      <ul className="space-y-1.5">{b.validation.tests.map((t) => <li key={t} className="flex items-center gap-2 text-sm text-slate-700"><Icon name="target" className="h-4 w-4 text-sage" />{t}</li>)}</ul>
      <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{b.validation.resultsNote}</p>
      <div className="mt-4 rounded-lg bg-sage-tint/30 p-4"><p className="text-xs font-bold uppercase tracking-wide text-sage-dark">Decision rule</p><p className="mt-1 text-sm text-foreground">{b.validation.decisionRule}</p></div>
    </>
  );
  // commitments
  return (
    <>
      <p className="mb-3 text-sm text-slate-600">Each founder records a 30-second video: &ldquo;I&rsquo;m in for 30 days, my first task is X, due Y.&rdquo;</p>
      <div className="space-y-2">{COMMITMENTS.map((c) => { const m = memberById(c.memberId); const rec = recorded[c.memberId]; return (
        <div key={c.memberId} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
          <Avatar m={m} size="h-9 w-9 text-xs" />
          <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-foreground">{m.name}</p><p className="truncate text-xs text-slate-500">{c.task} · due {c.due}</p></div>
          <button onClick={() => onRecord(c.memberId)} className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-colors ${rec ? "bg-sage text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
            <Icon name={rec ? "check" : "play"} className="h-3.5 w-3.5" />{rec ? "Recorded" : "Record"}
          </button>
        </div>); })}</div>
    </>
  );
}

function Thesis() {
  const t = BIRTH_CERTIFICATE.thesis;
  return (
    <div className="space-y-6">
      <div>
        <ThesisHeader day="Day 1" title="Define & Differentiate" intro={t.defineDifferentiate.intro} />
        <div className="mt-3 grid gap-3 sm:grid-cols-2">{t.defineDifferentiate.points.map((p) => <SubCard key={p.label} icon={p.icon} label={p.label} text={p.text} />)}</div>
      </div>
      <div>
        <ThesisHeader day="Day 2" title="Find the Right Approach" intro={t.findApproach.intro} />
        <div className="mt-3 grid gap-3 sm:grid-cols-2">{t.findApproach.points.map((p) => <SubCard key={p.label} icon={p.icon} label={p.label} text={p.text} />)}</div>
        <div className="mt-3 rounded-xl bg-sage-tint/30 p-4"><p className="text-xs font-bold uppercase tracking-wide text-sage-dark">Testable hypothesis</p><p className="mt-1 text-foreground">{t.findApproach.hypothesis}</p></div>
      </div>
    </div>
  );
}

function ThesisHeader({ day, title, intro }: { day: string; title: string; intro: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="rounded-md bg-sage px-2 py-0.5 text-[10px] font-bold uppercase text-white">{day}</span>
      <span className="font-bold text-foreground">{title}</span>
      <span className="text-sm text-slate-500">— {intro}</span>
    </div>
  );
}

function SubCard({ icon, label, text }: { icon: IconName; label: string; text: string }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="flex items-center gap-2 text-sm font-bold text-foreground"><Icon name={icon} className="h-4 w-4 text-sage" />{label}</p>
      <p className="mt-1.5 text-sm text-slate-600">{text}</p>
    </div>
  );
}

function LandingPreview() {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const l = BIRTH_CERTIFICATE.landing;
  return (
    <>
      <div className="mb-3 flex justify-end gap-1 rounded-lg bg-slate-100 p-1">
        <button onClick={() => setDevice("desktop")} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${device === "desktop" ? "bg-sage text-white" : "text-slate-500"}`}>Desktop</button>
        <button onClick={() => setDevice("mobile")} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${device === "mobile" ? "bg-sage text-white" : "text-slate-500"}`}>Mobile</button>
      </div>
      <div className="rounded-2xl border border-slate-200 p-6">
        <div className={`mx-auto ${device === "mobile" ? "max-w-xs" : "max-w-full"}`}>
          <div className="mb-5 flex items-center gap-2"><svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-sage"><path d="M13 2 4.5 13.5H11l-1.5 8.5L20 9.5h-6.5L13 2Z" /></svg><span className="font-bold text-foreground">Relaunch</span></div>
          <h3 className="text-3xl font-bold leading-tight tracking-tight text-foreground">{l.headline}</h3>
          <p className="mt-3 text-slate-600">{l.subhead}</p>
          <span className="mt-5 inline-flex h-11 items-center rounded-xl bg-sage px-5 text-sm font-bold text-white">{l.cta}</span>
          <div className="mt-6 flex h-32 items-center justify-center rounded-xl bg-sage-tint/40 text-sm font-medium text-sage/70">Hero visual</div>
        </div>
      </div>
    </>
  );
}

const CHANNELS = [{ key: "linkedin", label: "LinkedIn" }, { key: "dm", label: "DM" }, { key: "email", label: "Email" }, { key: "whatsapp", label: "WhatsApp" }] as const;

function Outreach() {
  const [active, setActive] = useState<(typeof CHANNELS)[number]["key"]>("linkedin");
  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">{CHANNELS.map((c) => <button key={c.key} onClick={() => setActive(c.key)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${active === c.key ? "bg-sage text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>{c.label}</button>)}</div>
      <p className="whitespace-pre-line rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed text-slate-700">{BIRTH_CERTIFICATE.outreach[active]}</p>
    </div>
  );
}

/* ------------------------------------------------- 4. Follow-through */

function FollowThroughPhase({ active, onSelect, recorded }: { active: string; onSelect: (d: string) => void; recorded: Record<string, boolean> }) {
  const cp = CHECKPOINTS.find((c) => c.day === active)!;
  const recordedCount = Object.values(recorded).filter(Boolean).length;
  return (
    <Columns
      left={
        <div className="space-y-4">
          <RailTitle>How follow-through works</RailTitle>
          <Card>
            <p className="flex items-center gap-2 font-bold text-foreground"><Icon name="lock" className="h-4 w-4 text-sage" /> The agent is dormant</p>
            <p className="mt-1.5 text-sm text-slate-600">After the 3-day sprint it returns only at day 7, 14, 21 and 30 — removing constant reliance and pushing the group to do the work.</p>
          </Card>
          <Card>
            <p className="flex items-center gap-2 font-bold text-foreground"><Icon name="bolt" className="h-4 w-4 text-sage" /> Efficient by design</p>
            <p className="mt-1.5 text-sm text-slate-600">Fewer touchpoints means fewer tokens and a positive constraint on the team.</p>
          </Card>
        </div>
      }
      center={
        <Card className="p-6">
          <CenterHead title="Follow-through" sub="The 30-day arc. The agent checks in; the team does the work." />
          <ol className="relative space-y-3 border-l-2 border-slate-100 pl-6">
            {CHECKPOINTS.map((c) => {
              const sel = c.day === active;
              return (
                <li key={c.day} className="relative">
                  <span className={`absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full ${c.status === "active" ? "bg-sage text-white" : "border-2 border-slate-200 bg-white text-slate-300"}`}>
                    {c.status === "locked" && <Icon name="lock" className="h-2.5 w-2.5" />}
                  </span>
                  <button onClick={() => onSelect(c.day)} className={`block w-full rounded-xl border p-4 text-left transition-colors ${sel ? "border-sage bg-sage-tint/20 ring-1 ring-sage" : "border-slate-200 hover:border-sage/50"}`}>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">{c.day} · {c.title}</span>
                      <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${c.status === "active" ? "bg-sage text-white" : "bg-slate-100 text-slate-400"}`}>{c.status === "active" ? "Open now" : "Locked"}</span>
                    </div>
                    {sel && (
                      <div className="mt-3">
                        <p className="text-xs font-bold text-slate-400">The agent asks</p>
                        <ul className="mt-1 space-y-1">{cp.asks.map((a) => <li key={a} className="flex gap-2 text-sm text-slate-700"><Icon name="message" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage" />{a}</li>)}</ul>
                        <p className="mt-3 text-xs font-bold text-slate-400">Due by then</p>
                        <p className="mt-0.5 text-sm text-slate-600">{cp.due}</p>
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
        </Card>
      }
      right={
        <div className="space-y-4">
          <RailTitle>Carried forward</RailTitle>
          <Card className="bg-sage-tint/20"><p className="font-bold text-foreground">Relaunch</p><p className="mt-0.5 text-sm text-slate-600">Pilot cohort live; first pulse at day 7.</p></Card>
          <Card>
            <p className="mb-2 text-sm font-bold text-foreground">Commitments</p>
            <p className="text-sm text-slate-600">{recordedCount} of {COMMITMENTS.length} recorded. Each founder owns one first task with a due date.</p>
          </Card>
          <Card className="bg-slate-50">
            <p className="flex items-center gap-2 text-sm font-bold text-foreground"><Icon name="refresh" className="h-4 w-4 text-sage" /> Day-30 review</p>
            <p className="mt-1.5 text-sm text-slate-600">Go / no-go, plus a chance to rebalance roles and equity.</p>
          </Card>
        </div>
      }
    />
  );
}
