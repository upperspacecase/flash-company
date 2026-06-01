"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  BASICS_QUESTIONS,
  CONSTRAINTS,
  CROSS_NOTES,
  FOUNDATION,
  MAP_INGREDIENTS,
  MEMBERS,
  OPPORTUNITIES,
  OUTPUT_MENU,
  PATTERN_CHIPS,
  SHARED_ANSWERS,
  SHARED_CONTEXT,
  SHARED_PROMPTS,
  SIGNALS,
  STAGES,
  SYNTHESIS_READINESS,
  TAGLINE,
  memberById,
  type Approach,
  type IconName,
  type Member,
  type Opportunity,
} from "./data";

/* ------------------------------------------------------------------ icons */

function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  const p = (d: string) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {d.split("|").map((seg, i) => (
        <path key={i} d={seg} />
      ))}
    </svg>
  );
  switch (name) {
    case "people": return p("M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2|M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8|M22 21v-2a4 4 0 0 0-3-3.87|M16 3.13A4 4 0 0 1 16 11");
    case "group": return p("M17 21v-2a4 4 0 0 0-3-3.87|M7 21v-2a4 4 0 0 1 3-3.87|M12 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6|M5 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5|M19 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5");
    case "user": return p("M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2|M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8");
    case "question": return p("M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3|M12 17h.01|M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0");
    case "bulb": return p("M9 18h6|M10 22h4|M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1h6c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2");
    case "folder": return p("M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z");
    case "scale": return p("M12 3v18|M7 7h10|M3 7l4 10H3zM3 7l4-3 4 3|M21 7l-4 10h4zM21 7l-4-3-4 3");
    case "alert": return p("M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z|M12 9v4|M12 17h.01");
    case "sparkle": return p("M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z|M19 15l.6 1.6L21 17l-1.4.4L19 19l-.6-1.6L17 17l1.4-.4z");
    case "minus": return p("M5 12h14|M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0");
    case "doc": return p("M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z|M14 2v6h6|M8 13h8|M8 17h6");
    case "laptop": return p("M3 5a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v11H3z|M2 20h20|M9 20l.5-2h5l.5 2");
    case "store": return p("M3 9l1.5-5h15L21 9|M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9|M3 9h18|M9 20v-6h6v6");
    case "flask": return p("M9 3h6|M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3|M7 16h10");
    case "clock": return p("M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18|M12 7v5l3 2");
    case "chart": return p("M3 3v18h18|M7 15l3-3 3 2 4-5");
    case "shield": return p("M12 2l8 3v6c0 5-3.5 8-8 11-4.5-3-8-6-8-11V5z");
    case "gear": return p("M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6|M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-2.7-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.1-2.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z");
    case "dollar": return p("M12 1v22|M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6");
    case "star": return p("M12 2l3 6.5 7 .9-5 4.8 1.3 7L12 18l-6.6 3.2L6.7 14l-5-4.8 7-.9z");
    case "check": return p("M9 11l3 3L22 4|M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11");
    case "tag": return p("M20.6 13.4 12 22l-9-9V3h10l7.6 7.6a2 2 0 0 1 0 2.8z|M7 7h.01");
  }
}

/* ------------------------------------------------------- shared primitives */

function Avatar({ m, size = "h-8 w-8 text-xs" }: { m: Member; size?: string }) {
  return (
    <span className={`flex ${size} items-center justify-center rounded-full font-bold ring-2 ring-white ${m.ring}`}>
      {m.initials}
    </span>
  );
}

function RailCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-slate-200 bg-white p-4 ${className}`}>{children}</div>;
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{children}</span>;
}

function SageChip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-md bg-sage-tint px-2.5 py-1 text-xs font-medium text-sage-dark">{children}</span>;
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

function RailIcon({ name }: { name: IconName }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sage-tint text-sage-dark">
      <Icon name={name} className="h-4 w-4" />
    </span>
  );
}

function ScoreDots({ value }: { value: number }) {
  return (
    <span className="flex gap-1">
      {[0, 1, 2, 3, 4].map((i) => {
        const full = i + 1 <= Math.floor(value);
        const half = !full && i < value;
        return (
          <span
            key={i}
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: full ? "var(--sage)" : half ? "linear-gradient(90deg, var(--sage) 50%, #e2e8f0 50%)" : "#e2e8f0" }}
          />
        );
      })}
    </span>
  );
}

const BADGE_TONE: Record<Approach["badgeTone"], string> = {
  good: "bg-emerald-100 text-emerald-700",
  warn: "bg-amber-100 text-amber-700",
  info: "bg-sky-100 text-sky-700",
  neutral: "bg-slate-100 text-slate-600",
};

const LEVEL_DOT: Record<Opportunity["levelTone"], string> = {
  good: "bg-emerald-500",
  warn: "bg-amber-400",
  info: "bg-amber-400",
};

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
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="mt-1 text-slate-500">{sub}</p>
      </div>
      {right}
    </div>
  );
}

function Continue({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex h-12 items-center gap-2 rounded-xl bg-sage px-6 text-sm font-bold text-white transition-colors hover:bg-sage-dark">
      {label}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
    </button>
  );
}

/* --------------------------------------------------------------- the page */

export default function Demo() {
  const [step, setStep] = useState(0);
  const [oppId, setOppId] = useState(OPPORTUNITIES[0].id);
  const [approachIdx, setApproachIdx] = useState(
    OPPORTUNITIES[0].approaches.findIndex((a) => a.recommended)
  );
  const [outputView, setOutputView] = useState("page");

  const opp = OPPORTUNITIES.find((o) => o.id === oppId)!;
  const approach = opp.approaches[approachIdx] ?? opp.approaches[0];

  function selectOpp(id: string) {
    setOppId(id);
    const o = OPPORTUNITIES.find((x) => x.id === id)!;
    setApproachIdx(Math.max(0, o.approaches.findIndex((a) => a.recommended)));
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/70">
      {/* header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-4 px-5 py-3">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-sage"><path d="M13 2 4.5 13.5H11l-1.5 8.5L20 9.5h-6.5L13 2Z" /></svg>
            <span className="text-lg font-bold tracking-tight text-foreground">Flash Company</span>
            <span className="hidden text-sm font-medium italic text-sage md:inline">{TAGLINE}</span>
          </Link>

          <Stepper step={step} onJump={setStep} />

          <div className="flex shrink-0 items-center gap-3">
            <div className="hidden items-center -space-x-2 sm:flex">
              {MEMBERS.map((m) => <Avatar key={m.id} m={m} />)}
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500 ring-2 ring-white">+2</span>
            </div>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <Icon name="group" className="h-4 w-4" /> Share
            </button>
            <button className="hidden h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 sm:flex">···</button>
          </div>
        </div>
      </header>

      {/* content */}
      <main className="mx-auto w-full max-w-[1500px] flex-1 px-5 py-6">
        {step === 0 && <Basics onNext={() => setStep(1)} />}
        {step === 1 && <Shared onNext={() => setStep(2)} onBack={() => setStep(0)} />}
        {step === 2 && <MapStage opp={opp} onSelect={selectOpp} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
        {step === 3 && (
          <Approaches
            opp={opp}
            idx={approachIdx}
            approach={approach}
            onPick={setApproachIdx}
            onSelect={() => setStep(4)}
          />
        )}
        {step === 4 && (
          <OutputStage
            opp={opp}
            view={outputView}
            onView={setOutputView}
            onBack={() => setStep(3)}
          />
        )}
      </main>
    </div>
  );
}

/* ----------------------------------------------------------------- stepper */

function Stepper({ step, onJump }: { step: number; onJump: (n: number) => void }) {
  const arrow = "polygon(0 0, calc(100% - 13px) 0, 100% 50%, calc(100% - 13px) 100%, 0 100%, 13px 50%)";
  const first = "polygon(0 0, calc(100% - 13px) 0, 100% 50%, calc(100% - 13px) 100%, 0 100%)";
  const lastShape = "polygon(0 0, 100% 0, 100% 100%, 0 100%, 13px 50%)";
  return (
    <ol className="hidden items-stretch overflow-hidden rounded-xl border border-slate-200 bg-slate-100 lg:flex">
      {STAGES.map((s, i) => {
        const active = i === step;
        const clip = i === 0 ? first : i === STAGES.length - 1 ? lastShape : arrow;
        return (
          <li key={s.id}>
            <button
              onClick={() => onJump(i)}
              style={{ clipPath: clip, marginLeft: i ? -13 : 0 }}
              className={`flex items-center gap-2 py-2.5 pl-5 pr-6 text-sm font-semibold transition-colors ${
                active ? "bg-sage text-white" : "bg-white text-slate-500 hover:text-slate-800"
              }`}
            >
              <span className={active ? "text-white/80" : "text-slate-400"}>{i + 1}</span>
              {s.label}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

/* -------------------------------------------------------------- 1. Basics */

function Basics({ onNext }: { onNext: () => void }) {
  return (
    <Columns
      left={
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Team snapshot</p>
          {MEMBERS.map((m) => (
            <RailCard key={m.id}>
              <div className="mb-2 flex items-center gap-2">
                <span className="font-bold text-foreground">{m.name}</span>
                {m.lead && <span className="rounded bg-sage-tint px-1.5 py-0.5 text-[10px] font-bold uppercase text-sage-dark">Lead</span>}
              </div>
              <div className="mb-2 flex flex-wrap gap-1.5">{m.tags.map((t) => <Chip key={t}>{t}</Chip>)}</div>
              <p className="flex items-center gap-1.5 text-xs text-slate-500"><Icon name="group" className="h-3.5 w-3.5" /> Network: {m.network}</p>
            </RailCard>
          ))}
          <RailCard>
            <p className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground"><Icon name="alert" className="h-4 w-4 text-amber-500" /> Constraints</p>
            <ul className="space-y-1.5 text-sm text-slate-600">
              {CONSTRAINTS.map((c) => <li key={c} className="flex gap-2"><span className="text-slate-300">•</span>{c}</li>)}
            </ul>
          </RailCard>
        </div>
      }
      center={
        <RailCard className="p-6">
          <CenterHead title="Basics intake" sub="Capture the raw material before exploring ideas." />
          <div className="space-y-3">
            {BASICS_QUESTIONS.map((item, i) => (
              <div key={i} className="flex gap-4 rounded-xl border border-slate-200 p-4">
                <RailIcon name={item.icon} />
                <div className="grid flex-1 gap-1 sm:grid-cols-[1fr_1.4fr] sm:gap-4">
                  <p className="font-semibold text-foreground">{i + 1}. {item.q}</p>
                  <p className="text-sm text-slate-600">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-slate-50 p-4">
            <p className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground"><Icon name="people" className="h-4 w-4 text-sage" /> Shared context</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {MEMBERS.map((m) => (
                <div key={m.id}>
                  <p className="mb-1.5 text-xs font-bold text-slate-500">{m.name}</p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {SHARED_CONTEXT[m.id].map((t) => <li key={t} className="flex gap-1.5"><span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${m.dot}`} />{t}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex justify-end"><Continue label="Continue to shared inputs" onClick={onNext} /></div>
        </RailCard>
      }
      right={
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Foundation summary</p>
          <SummaryCard icon="user" title="Emerging customer" text={FOUNDATION.customer} />
          <SummaryCard icon="alert" title="Core problem" text={FOUNDATION.problem} />
          <SummaryCard icon="star" title="Why this matters" text={FOUNDATION.matters} />
          <RailCard>
            <p className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground"><Icon name="sparkle" className="h-4 w-4 text-sage" /> Our edge</p>
            <div className="flex flex-wrap gap-1.5">{FOUNDATION.edge.map((e) => <SageChip key={e}>{e}</SageChip>)}</div>
          </RailCard>
          <RailCard className="bg-sage-tint/30">
            <p className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground"><Icon name="check" className="h-4 w-4 text-sage" /> Readiness check</p>
            <ul className="space-y-1.5">{FOUNDATION.readiness.map((r) => <CheckRow key={r} label={r} />)}</ul>
          </RailCard>
        </div>
      }
    />
  );
}

function SummaryCard({ icon, title, text }: { icon: IconName; title: string; text: string }) {
  return (
    <RailCard>
      <div className="flex gap-3">
        <RailIcon name={icon} />
        <div>
          <p className="font-bold text-foreground">{title}</p>
          <p className="mt-0.5 text-sm text-slate-600">{text}</p>
        </div>
      </div>
    </RailCard>
  );
}

/* ------------------------------------------------------- 2. Shared inputs */

function Shared({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <Columns
      left={
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Team inputs</p>
          {MEMBERS.map((m) => (
            <RailCard key={m.id}>
              <div className="mb-2 flex items-center gap-2">
                <Avatar m={m} size="h-7 w-7 text-[10px]" />
                <span className="font-bold text-foreground">{m.name}</span>
                {m.lead && <span className="rounded bg-sage-tint px-1.5 py-0.5 text-[10px] font-bold uppercase text-sage-dark">Lead</span>}
              </div>
              <div className="mb-2 flex flex-wrap gap-1.5">{m.tags.map((t) => <Chip key={t}>{t}</Chip>)}</div>
              <p className="flex items-center gap-1.5 text-xs text-sage-dark"><Icon name="check" className="h-3.5 w-3.5" /> Contributed · {m.contributed}</p>
            </RailCard>
          ))}
          <RailCard>
            <p className="mb-2 text-sm font-bold text-foreground">Prompt themes</p>
            <ul className="space-y-2">
              {SHARED_PROMPTS.map((pr) => (
                <li key={pr.q} className="flex items-center gap-2 text-sm text-slate-600"><Icon name={pr.icon} className="h-4 w-4 text-slate-400" />{shortPrompt(pr.q)}</li>
              ))}
            </ul>
          </RailCard>
          <button onClick={onBack} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
            Back to basics
          </button>
        </div>
      }
      center={
        <RailCard className="p-6">
          <CenterHead title="Shared inputs" sub="Collect separate perspectives before the group converges." />
          <div className="space-y-3">
            {SHARED_PROMPTS.map((pr, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-4">
                <p className="mb-3 flex items-center gap-2 font-semibold text-foreground"><RailIcon name={pr.icon} /> {i + 1}. {pr.q}</p>
                <div className="grid gap-4 sm:grid-cols-3">
                  {MEMBERS.map((m) => (
                    <div key={m.id}>
                      <p className="mb-1 flex items-center gap-1.5 text-xs font-bold text-slate-500"><span className={`h-2 w-2 rounded-full ${m.dot}`} />{m.name}</p>
                      <p className="text-sm text-slate-600">{SHARED_ANSWERS[m.id][i]}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-slate-50 p-4">
            <p className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground"><Icon name="group" className="h-4 w-4 text-sage" /> Cross-team notes</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {MEMBERS.map((m) => (
                <div key={m.id}>
                  <p className="mb-1.5 text-xs font-bold text-slate-500">{m.name}</p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {CROSS_NOTES[m.id].map((t) => <li key={t} className="flex gap-1.5"><span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${m.dot}`} />{t}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex justify-end"><Continue label="Continue to opportunity map" onClick={onNext} /></div>
        </RailCard>
      }
      right={
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Signals emerging</p>
          {SIGNALS.map((s) => <SummaryCard key={s.title} icon={s.icon} title={s.title} text={s.text} />)}
          <RailCard>
            <p className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground"><Icon name="tag" className="h-4 w-4 text-sage" /> Patterns detected</p>
            <div className="flex flex-wrap gap-1.5">{PATTERN_CHIPS.map((c) => <SageChip key={c}>{c}</SageChip>)}</div>
          </RailCard>
          <RailCard className="bg-sage-tint/30">
            <p className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground"><Icon name="check" className="h-4 w-4 text-sage" /> Synthesis readiness</p>
            <ul className="space-y-1.5">{SYNTHESIS_READINESS.map((r) => <CheckRow key={r.label} label={r.label} done={r.done} />)}</ul>
          </RailCard>
        </div>
      }
    />
  );
}

function shortPrompt(q: string) {
  return q.replace(/^What /, "").replace(/\?$/, "");
}

/* ----------------------------------------------------- 3. Opportunity map */

function MapStage({ opp, onSelect, onNext, onBack }: { opp: Opportunity; onSelect: (id: string) => void; onNext: () => void; onBack: () => void }) {
  return (
    <Columns
      left={
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Signals to map</p>
          {SIGNALS.map((s) => <SummaryCard key={s.title} icon={s.icon} title={s.title} text={s.text} />)}
          <RailCard>
            <p className="mb-3 text-sm font-bold text-foreground">Inputs used</p>
            <ul className="space-y-2.5">
              {MEMBERS.map((m) => (
                <li key={m.id} className="flex items-center gap-2">
                  <Icon name="check" className="h-4 w-4 text-sage" />
                  <span className="text-sm font-semibold text-foreground">{m.name}</span>
                  <span className="flex flex-wrap gap-1">{m.tags.slice(0, 2).map((t) => <Chip key={t}>{t}</Chip>)}</span>
                </li>
              ))}
            </ul>
          </RailCard>
          <button onClick={onBack} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
            Back to shared inputs
          </button>
        </div>
      }
      center={
        <RailCard className="p-6">
          <CenterHead title="Opportunity map" sub="Turn shared signals into specific opportunities." />
          <div className="space-y-3">
            {OPPORTUNITIES.map((o) => {
              const active = o.id === opp.id;
              return (
                <button
                  key={o.id}
                  onClick={() => onSelect(o.id)}
                  className={`block w-full rounded-xl border p-4 text-left transition-colors ${active ? "border-sage bg-sage-tint/30 ring-1 ring-sage" : "border-slate-200 hover:border-sage/50"}`}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className="font-bold text-foreground">{o.num}. {o.title}</span>
                    {o.id === OPPORTUNITIES[0].id && <span className="rounded-full bg-sage-tint px-2 py-0.5 text-[10px] font-bold uppercase text-sage-dark">{o.fitBadge}</span>}
                    <span className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-slate-500">{o.level}<span className={`h-2.5 w-2.5 rounded-full ${LEVEL_DOT[o.levelTone]}`} /></span>
                  </div>
                  <div className="grid gap-4 text-sm sm:grid-cols-2">
                    <dl className="space-y-1.5">
                      <MapField label="Customer" value={o.customer} />
                      <MapField label="Problem" value={o.problem} />
                      <MapField label="Why us" value={o.whyUs} />
                    </dl>
                    <div className="space-y-1.5">
                      <p className="text-xs font-bold text-slate-400">Evidence</p>
                      <ul className="space-y-1 text-slate-600">{o.evidence.map((e) => <li key={e} className="flex gap-1.5"><span className="text-sage">•</span>{e}</li>)}</ul>
                      <p className="pt-1 text-xs font-bold text-slate-400">Risk</p>
                      <p className="text-slate-600">{o.risk}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-5 rounded-xl bg-slate-50 p-4">
            <p className="mb-3 text-sm font-bold text-sage-dark">Opportunity ingredients (map logic)</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
              {MAP_INGREDIENTS.map((ing, i) => (
                <div key={ing.label} className="flex flex-1 items-center gap-2">
                  <div className="flex-1 rounded-lg border border-slate-200 bg-white p-2.5">
                    <p className="flex items-center gap-1.5 text-xs font-bold text-foreground"><Icon name={ing.icon} className="h-3.5 w-3.5 text-sage" />{ing.label}</p>
                    <p className="mt-0.5 text-[11px] leading-tight text-slate-500">{ing.sub}</p>
                  </div>
                  {i < MAP_INGREDIENTS.length - 1 && <span className="hidden text-slate-300 sm:block">→</span>}
                </div>
              ))}
            </div>
          </div>
        </RailCard>
      }
      right={<SelectedOpportunity opp={opp} onNext={onNext} />}
    />
  );
}

function MapField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-16 shrink-0 text-xs font-bold text-slate-400">{label}</dt>
      <dd className="text-slate-600">{value}</dd>
    </div>
  );
}

function SelectedOpportunity({ opp, onNext }: { opp: Opportunity; onNext: () => void }) {
  const p = opp.panel;
  return (
    <div className="lg:sticky lg:top-4 lg:self-start">
      <div className="space-y-4 rounded-2xl border border-sage/40 bg-white p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Selected opportunity</p>
          <span className="flex items-center gap-1 rounded-full bg-sage-tint px-2 py-0.5 text-xs font-semibold text-sage-dark">{opp.num}. {opp.title} <Icon name="star" className="h-3 w-3" /></span>
        </div>
        <PanelRow icon="user" title="Customer" text={p.customer} />
        <PanelRow icon="alert" title="Problem" text={p.problem} />
        <PanelRow icon="chart" title="Current alternative" text={p.alternative} />
        <PanelRow icon="sparkle" title="Why this group can solve it" text={p.whyGroup} />
        <div className="flex gap-3">
          <RailIcon name="doc" />
          <div className="flex-1">
            <p className="font-bold text-foreground">Evidence from inputs</p>
            <ul className="mt-1.5 space-y-1.5">
              {p.quotes.map((q) => {
                const m = memberById(q.memberId);
                return (
                  <li key={q.memberId} className="flex items-start gap-1.5 text-sm">
                    <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${m.ring}`}>{m.initials}</span>
                    <span className="text-slate-600">{m.name}: <span className="italic">&ldquo;{q.text}&rdquo;</span></span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <PanelRow icon="question" title="Biggest uncertainty" text={p.uncertainty} />

        <div className="rounded-xl bg-slate-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-1.5">
              <p className="mb-1 text-sm font-bold text-sage-dark">Opportunity score</p>
              {p.bars.map((b) => (
                <div key={b.label} className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">{b.label}</span>
                  <ScoreDots value={b.value} />
                </div>
              ))}
            </div>
            <div className="rounded-lg bg-sage-tint px-3 py-2 text-center">
              <p className="text-xs text-sage-dark">Overall</p>
              <p className="text-2xl font-bold text-sage-dark">{p.overall}<span className="text-sm">/10</span></p>
              <p className="text-[10px] font-semibold text-sage-dark">{p.overallLabel}</p>
            </div>
          </div>
        </div>

        <button onClick={onNext} className="flex w-full items-center justify-center gap-2 rounded-xl bg-sage py-3.5 text-sm font-bold text-white transition-colors hover:bg-sage-dark">
          Continue to approaches
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </button>
      </div>
    </div>
  );
}

function PanelRow({ icon, title, text }: { icon: IconName; title: string; text: string }) {
  return (
    <div className="flex gap-3">
      <RailIcon name={icon} />
      <div className="flex-1">
        <p className="font-bold text-foreground">{title}</p>
        <p className="mt-0.5 text-sm text-slate-600">{text}</p>
      </div>
    </div>
  );
}

/* --------------------------------------------------------- 4. Approaches */

const APPROACH_NAV = [
  { id: "explore", label: "Explore approaches", icon: "sparkle" as IconName },
  { id: "compare", label: "Compare", icon: "chart" as IconName },
  { id: "recommend", label: "Recommend", icon: "star" as IconName },
];

const SNAP_ICON: Record<string, IconName> = {
  "Ease to test": "flask",
  "Speed to revenue": "clock",
  "Founder fit": "user",
  "Market size": "chart",
  "Defensibility": "shield",
  "Operational complexity": "gear",
  "Margin potential": "dollar",
  "Overall score": "star",
};

function Approaches({ opp, idx, approach, onPick, onSelect }: { opp: Opportunity; idx: number; approach: Approach; onPick: (i: number) => void; onSelect: () => void }) {
  return (
    <Columns
      left={
        <div className="space-y-4">
          <RailCard>
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">Selected opportunity</p>
            <p className="font-semibold text-foreground">{opp.problem}</p>
          </RailCard>
          <RailCard>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Approaches</p>
            <ul className="space-y-1">
              {APPROACH_NAV.map((n, i) => (
                <li key={n.id}>
                  <span className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-semibold ${i === 0 ? "bg-sage-tint text-sage-dark" : "text-slate-500"}`}>
                    <Icon name={n.icon} className="h-4 w-4" />{n.label}
                  </span>
                </li>
              ))}
            </ul>
          </RailCard>
          <RailCard>
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">About approaches</p>
            <p className="text-sm text-slate-600">Different ways to solve the same customer problem. Compare them across key dimensions to choose the strongest first move.</p>
          </RailCard>
          <AskFlash hint="Ask Flash AI for guidance on evaluating approaches." />
        </div>
      }
      center={
        <RailCard className="p-6">
          <CenterHead
            title="Explore approaches"
            sub="Different ways we could solve this problem for this customer."
            right={<button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"><span className="text-base leading-none">+</span> Add custom approach</button>}
          />
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">{opp.approaches.length} approaches</p>
          <div className="space-y-3">
            {opp.approaches.map((a, i) => {
              const active = i === idx;
              return (
                <button
                  key={a.title}
                  onClick={() => onPick(i)}
                  className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors ${active ? "border-sage bg-sage-tint/20 ring-1 ring-sage" : "border-slate-200 hover:border-sage/50"}`}
                >
                  <RailIcon name={a.icon} />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-foreground">{a.title}</p>
                    <p className="mt-0.5 text-sm text-slate-500">{a.desc}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${BADGE_TONE[a.badgeTone]}`}>{a.badge}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-slate-400"><path d="m9 6 6 6-6 6" /></svg>
                </button>
              );
            })}
          </div>
        </RailCard>
      }
      right={<SelectedApproach approach={approach} onSelect={onSelect} />}
    />
  );
}

function SelectedApproach({ approach, onSelect }: { approach: Approach; onSelect: () => void }) {
  return (
    <div className="lg:sticky lg:top-4 lg:self-start">
      <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Selected approach</p>
          <div className="mt-2 flex gap-3">
            <RailIcon name={approach.icon} />
            <div>
              <p className="text-lg font-bold text-foreground">{approach.title}</p>
              <p className="mt-0.5 text-sm text-slate-500">{approach.desc}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">How it works</p>
            <ul className="space-y-1.5">{approach.howItWorks.map((h) => <li key={h} className="flex items-start gap-1.5 text-sm text-slate-600"><Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage" />{h}</li>)}</ul>
          </div>
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Why this could work</p>
            <ul className="space-y-1.5">{approach.whyItWorks.map((h) => <li key={h} className="flex items-start gap-1.5 text-sm text-slate-600"><Icon name="star" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage" />{h}</li>)}</ul>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Evaluation snapshot</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {approach.snapshot.map((t) => {
              const overall = t.label === "Overall score";
              return (
                <div key={t.label} className={`rounded-lg border p-2.5 ${overall ? "border-sage bg-sage-tint/30" : "border-slate-200"}`}>
                  <p className="flex items-center gap-1 text-[10px] font-semibold text-slate-400"><Icon name={SNAP_ICON[t.label]} className="h-3 w-3" />{t.label}</p>
                  <p className="mt-1 text-lg font-bold text-foreground">{t.score}<span className="text-xs text-slate-400">/10</span></p>
                  <p className="text-[10px] text-slate-500">{t.note}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-sage-dark">Recommended first test</p>
          <p className="mt-1.5 text-sm text-slate-600">{approach.firstTest}</p>
        </div>

        <button onClick={onSelect} className="flex w-full items-center justify-center gap-2 rounded-xl bg-sage py-3.5 text-sm font-bold text-white transition-colors hover:bg-sage-dark">
          <Icon name="check" className="h-4 w-4" /> Select this approach
        </button>
      </div>
    </div>
  );
}

function AskFlash({ hint }: { hint: string }) {
  return (
    <RailCard className="bg-slate-50">
      <p className="mb-1 flex items-center gap-2 text-sm font-bold text-foreground"><Icon name="sparkle" className="h-4 w-4 text-sage" /> Need help?</p>
      <p className="mb-3 text-sm text-slate-600">{hint}</p>
      <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
        <Icon name="sparkle" className="h-4 w-4 text-sage" /> Ask Flash AI
      </button>
    </RailCard>
  );
}

/* ------------------------------------------------------------- 5. Output */

function OutputStage({ opp, view, onView, onBack }: { opp: Opportunity; view: string; onView: (v: string) => void; onBack: () => void }) {
  return (
    <Columns
      left={
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Output menu</p>
          <RailCard className="p-2">
            <ul className="space-y-1">
              {OUTPUT_MENU.map((m) => (
                <li key={m.id}>
                  <button
                    onClick={() => onView(m.id)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${view === m.id ? "bg-sage-tint text-sage-dark" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    <Icon name={m.icon} className="h-4 w-4" />{m.label}
                  </button>
                </li>
              ))}
            </ul>
          </RailCard>
          <AskFlash hint="Ask Flash AI to refine your output or try a different tone." />
        </div>
      }
      center={
        <RailCard className="p-6">
          <CenterHead
            title="5. Output"
            sub="Your AI-generated assets are ready. Review, refine, and export what you need."
            right={
              <div className="flex gap-2">
                <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"><Icon name="doc" className="h-4 w-4" /> Export code</button>
                <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"><Icon name="chart" className="h-4 w-4" /> Make pitch deck</button>
              </div>
            }
          />
          <OutputView opp={opp} view={view} />
          <div className="mt-6 flex items-center justify-between">
            <button onClick={onBack} className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
              Back to Approaches
            </button>
            <Continue label="Next: Share & Test" onClick={() => onView("page")} />
          </div>
        </RailCard>
      }
      right={
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Selected opportunity</p>
          <RailCard>
            <div className="flex gap-3">
              <RailIcon name="people" />
              <div>
                <p className="font-bold text-foreground">{opp.title}</p>
                <p className="text-xs text-sage-dark">Generated assets ready</p>
              </div>
            </div>
          </RailCard>
          <RailCard>
            <p className="mb-2 text-sm font-bold text-foreground">What&apos;s included</p>
            <ul className="space-y-1.5">
              {OUTPUT_MENU.filter((m) => m.id !== "summary").map((m) => (
                <CheckRow key={m.id} label={m.id === "page" ? "Landing page (you're here)" : m.label} />
              ))}
            </ul>
          </RailCard>
          <RailCard className="bg-sage-tint/30">
            <p className="text-sm font-bold text-foreground">Tip</p>
            <p className="mt-1 text-sm text-slate-600">Customize your landing page message and visuals to match your audience.</p>
          </RailCard>
        </div>
      }
    />
  );
}

function OutputView({ opp, view }: { opp: Opportunity; view: string }) {
  const o = opp.output;
  if (view === "summary") {
    return (
      <div className="rounded-xl border border-sage/40 bg-sage-tint/20 p-6">
        <p className="text-xs font-bold uppercase tracking-wide text-sage-dark">Opportunity summary</p>
        <p className="mt-3 text-lg leading-relaxed text-foreground">{o.summary}</p>
      </div>
    );
  }
  if (view === "page") return <LandingPreview opp={opp} />;
  if (view === "outreach") return <Outreach outreach={o.outreach} />;
  if (view === "testplan") {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-slate-200 p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Testable hypothesis</p>
          <p className="mt-2 text-foreground">{o.testPlan.hypothesis}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">First test</p>
            <p className="mt-2 text-sm text-foreground">{o.testPlan.firstTest}</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">What we measure</p>
            <ul className="mt-2 space-y-1">{o.testPlan.metrics.map((m) => <li key={m} className="flex items-center gap-1.5 text-sm text-slate-600"><Icon name="check" className="h-3.5 w-3.5 text-sage" />{m}</li>)}</ul>
          </div>
        </div>
        <div className="rounded-xl bg-sage-tint/30 p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-sage-dark">Decision rule</p>
          <p className="mt-2 text-foreground">{o.testPlan.decisionRule}</p>
        </div>
      </div>
    );
  }
  // deck
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {o.deck.map((s, i) => (
        <div key={s.title} className="rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-bold text-slate-400">Slide {i + 1}</p>
          <p className="mt-1 font-bold text-foreground">{s.title}</p>
          <p className="mt-1 text-sm text-slate-600">{s.body}</p>
        </div>
      ))}
    </div>
  );
}

function LandingPreview({ opp }: { opp: Opportunity }) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const o = opp.output.page;
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500">Landing page preview</p>
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
          <DeviceBtn active={device === "desktop"} onClick={() => setDevice("desktop")} icon="laptop" label="Desktop" />
          <DeviceBtn active={device === "mobile"} onClick={() => setDevice("mobile")} icon="doc" label="Mobile" />
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className={`mx-auto ${device === "mobile" ? "max-w-sm" : "max-w-full"}`}>
          <div className="mb-6 flex items-center justify-between">
            <span className="flex items-center gap-2"><svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-sage"><path d="M13 2 4.5 13.5H11l-1.5 8.5L20 9.5h-6.5L13 2Z" /></svg><span className="font-bold text-foreground">Flash Company</span></span>
            {device === "desktop" && <span className="flex gap-4 text-xs text-slate-500">{o.nav.map((n) => <span key={n}>{n}</span>)}</span>}
          </div>
          <div className={`grid items-center gap-6 ${device === "mobile" ? "" : "md:grid-cols-2"}`}>
            <div>
              <h2 className="text-3xl font-bold leading-tight tracking-tight text-foreground">{o.headline}</h2>
              <p className="mt-3 text-sm text-slate-600">{o.subhead}</p>
              <span className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-sage px-5 text-sm font-bold text-white"><svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M13 2 4.5 13.5H11l-1.5 8.5L20 9.5h-6.5L13 2Z" /></svg>{o.cta}</span>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex -space-x-2">{MEMBERS.map((m) => <Avatar key={m.id} m={m} size="h-7 w-7 text-[9px]" />)}</div>
                <p className="text-xs text-slate-500"><span className="font-bold text-foreground">{o.proofCount}</span> · {o.proofAudience}<br />{o.proofNote}</p>
              </div>
            </div>
            <Image src="/venn.png" alt="Opportunity venn diagram" width={1254} height={1254} className="h-auto w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DeviceBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: IconName; label: string }) {
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors ${active ? "bg-sage text-white" : "text-slate-500"}`}>
      <Icon name={icon} className="h-3.5 w-3.5" />{label}
    </button>
  );
}

const CHANNELS = [
  { key: "linkedin", label: "LinkedIn" },
  { key: "dm", label: "DM" },
  { key: "email", label: "Email" },
  { key: "whatsapp", label: "WhatsApp" },
] as const;

function Outreach({ outreach }: { outreach: Opportunity["output"]["outreach"] }) {
  const [active, setActive] = useState<(typeof CHANNELS)[number]["key"]>("linkedin");
  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {CHANNELS.map((c) => (
          <button key={c.key} onClick={() => setActive(c.key)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${active === c.key ? "bg-sage text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>{c.label}</button>
        ))}
      </div>
      <p className="whitespace-pre-line rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed text-slate-700">{outreach[active]}</p>
    </div>
  );
}
