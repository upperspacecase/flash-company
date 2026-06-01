"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CONSTRAINTS,
  CONTEXT,
  DIMENSIONS,
  INPUT_CARDS,
  MEMBERS,
  OPPORTUNITIES,
  PATTERNS,
  SHARED_INPUTS,
  SHARED_PROMPTS,
  STAGES,
  type Member,
  type Opportunity,
  type Rating,
} from "./data";

const memberById = (id: string) => MEMBERS.find((m) => m.id === id) as Member;

export default function Demo() {
  const [step, setStep] = useState(0);
  const [oppId, setOppId] = useState(OPPORTUNITIES[0].id);
  const selected = OPPORTUNITIES.find((o) => o.id === oppId)!;

  const atStart = step === 0;
  const atEnd = step === STAGES.length - 1;

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-white">
      <header className="border-b border-slate-100">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-sage" aria-hidden="true">
              <path d="M13 2 4.5 13.5H11l-1.5 8.5L20 9.5h-6.5L13 2Z" />
            </svg>
            <span className="text-lg font-bold tracking-tight text-foreground">Flash Company</span>
          </Link>
          <span className="rounded-full bg-sage-tint px-3 py-1 text-xs font-semibold text-sage-dark">
            Sprint demo
          </span>
        </div>
      </header>

      <Stepper step={step} onJump={setStep} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 sm:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {step + 1}. {STAGES[step].label}
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">{STAGES[step].blurb}</p>
        </div>

        {step === 0 && <Basics />}
        {step === 1 && <SharedInputs />}
        {step === 2 && <OpportunityMap oppId={oppId} onSelect={setOppId} />}
        {step === 3 && <Approaches opp={selected} />}
        {step === 4 && <Output opp={selected} />}
      </main>

      <footer className="sticky bottom-0 border-t border-slate-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={atStart}
            className="inline-flex h-11 items-center rounded-xl px-5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-0"
          >
            Back
          </button>

          <p className="hidden text-sm font-medium text-slate-500 sm:block">
            Carrying forward: <span className="text-foreground">{selected.title}</span>
          </p>

          {atEnd ? (
            <button
              onClick={() => setStep(0)}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-sage px-6 text-sm font-bold text-white transition-colors hover:bg-sage-dark"
            >
              Run it again
            </button>
          ) : (
            <button
              onClick={() => setStep((s) => Math.min(STAGES.length - 1, s + 1))}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-sage px-6 text-sm font-bold text-white transition-colors hover:bg-sage-dark"
            >
              {step === 2 ? "Explore approaches" : step === 3 ? "Generate output" : "Continue"}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

function Stepper({ step, onJump }: { step: number; onJump: (n: number) => void }) {
  return (
    <nav className="border-b border-slate-100 bg-slate-50/60">
      <ol className="mx-auto flex w-full max-w-6xl gap-1 overflow-x-auto px-6 py-3 sm:px-8">
        {STAGES.map((stage, i) => {
          const state = i === step ? "current" : i < step ? "done" : "todo";
          return (
            <li key={stage.id} className="flex-1">
              <button
                onClick={() => onJump(i)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors ${
                  state === "current" ? "bg-sage text-white" : "text-slate-500 hover:bg-white"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    state === "current"
                      ? "bg-white text-sage"
                      : state === "done"
                        ? "bg-sage text-white"
                        : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="hidden whitespace-nowrap text-sm font-semibold sm:block">{stage.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-5 ${className}`}>{children}</div>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t) => (
        <span key={t} className="rounded-lg bg-sage-tint px-3 py-1.5 text-sm font-medium text-sage-dark">
          {t}
        </span>
      ))}
    </div>
  );
}

function Basics() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-400">People</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {MEMBERS.map((m) => (
            <Card key={m.id}>
              <div className="mb-3 flex items-center gap-3">
                <span className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold ${m.chip}`}>
                  {m.initials}
                </span>
                <div>
                  <p className="font-bold text-foreground">{m.name}</p>
                  <p className="text-xs text-slate-500">{m.role}</p>
                </div>
              </div>
              <dl className="space-y-2 text-sm">
                <Row label="Skills" value={m.skills} />
                <Row label="Network" value={m.network} />
                <Row label="Style" value={m.style} />
                <Row label="Time" value={m.time} />
              </dl>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">Context</h2>
          <div className="space-y-4">
            <Group label="Industries they know"><Chips items={CONTEXT.industries} /></Group>
            <Group label="Communities they're in"><Chips items={CONTEXT.communities} /></Group>
            <Group label="Problems they keep seeing"><Chips items={CONTEXT.problems} /></Group>
            <Group label="Assets they can access"><Chips items={CONTEXT.assets} /></Group>
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">Constraints</h2>
          <dl className="space-y-3">
            {CONSTRAINTS.map((c) => (
              <div key={c.label} className="flex gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <dt className="w-20 shrink-0 text-sm font-semibold text-slate-400">{c.label}</dt>
                <dd className="text-sm text-foreground">{c.value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-16 shrink-0 font-semibold text-slate-400">{label}</dt>
      <dd className="text-slate-700">{value}</dd>
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-slate-400">{label}</p>
      {children}
    </div>
  );
}

function SharedInputs() {
  return (
    <div>
      <div className="mb-6 rounded-xl border border-sage/30 bg-sage-tint/50 p-4 text-sm text-sage-dark">
        Each person answers the same prompts on their own. The AI reads across all of them — looking
        for patterns, overlaps, tensions and unfair advantages — before the group converges.
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {MEMBERS.map((m) => (
          <Card key={m.id}>
            <div className="mb-4 flex items-center gap-2.5">
              <span className={`h-2.5 w-2.5 rounded-full ${m.dot}`} />
              <p className="font-bold text-foreground">{m.name}</p>
            </div>
            <ul className="space-y-4">
              {SHARED_PROMPTS.map((prompt, i) => (
                <li key={i}>
                  <p className="text-xs font-semibold text-slate-400">{prompt}</p>
                  <p className="mt-1 text-sm text-slate-700">{SHARED_INPUTS[m.id][i]}</p>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}

function OpportunityMap({ oppId, onSelect }: { oppId: string; onSelect: (id: string) => void }) {
  const selected = OPPORTUNITIES.find((o) => o.id === oppId)!;
  return (
    <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
      <div className="grid gap-4 md:grid-cols-3">
        <Column title="Inputs" sub="Raw contributions">
          {INPUT_CARDS.map((c, i) => {
            const m = memberById(c.memberId);
            return (
              <div key={i} className="rounded-xl border border-slate-200 p-3">
                <div className="mb-1.5 flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${m.dot}`} />
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{c.kind}</span>
                </div>
                <p className="text-sm text-slate-700">{c.text}</p>
              </div>
            );
          })}
        </Column>

        <Column title="Patterns" sub="AI synthesis">
          {PATTERNS.map((p, i) => (
            <div
              key={i}
              className={`rounded-xl border p-3 ${p.tone === "risk" ? "border-amber-200 bg-amber-50" : "border-sage/30 bg-sage-tint/40"}`}
            >
              <span className={`text-[11px] font-semibold uppercase tracking-wide ${p.tone === "risk" ? "text-amber-700" : "text-sage-dark"}`}>
                {p.kind}
              </span>
              <p className="mt-1 text-sm text-slate-700">{p.text}</p>
            </div>
          ))}
        </Column>

        <Column title="Opportunities" sub="Click to inspect">
          {OPPORTUNITIES.map((o) => {
            const active = o.id === oppId;
            return (
              <button
                key={o.id}
                onClick={() => onSelect(o.id)}
                className={`w-full rounded-xl border p-3 text-left transition-colors ${
                  active ? "border-sage bg-sage-tint/60 ring-1 ring-sage" : "border-slate-200 hover:border-sage/50"
                }`}
              >
                <span className="text-[11px] font-semibold uppercase tracking-wide text-sage-dark">{o.tag}</span>
                <p className="mt-1 text-sm font-semibold text-foreground">{o.title}</p>
              </button>
            );
          })}
        </Column>
      </div>

      <div className="xl:sticky xl:top-4 xl:self-start">
        <Card className="border-sage/40 bg-sage-tint/20">
          <p className="text-xs font-bold uppercase tracking-wide text-sage-dark">Selected opportunity</p>
          <h3 className="mt-1 text-xl font-bold text-foreground">{selected.title}</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <Field label="Customer" value={selected.customer} />
            <Field label="Problem" value={selected.problem} />
            <Field label="Current alternative" value={selected.alternative} />
            <Field label="Why this group" value={selected.whyUs} />
            <Field label="Evidence" value={selected.evidence} />
            <Field label="Risk / uncertainty" value={selected.risk} tone="risk" />
          </dl>
        </Card>
      </div>
    </div>
  );
}

function Column({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3">
        <p className="font-bold text-foreground">{title}</p>
        <p className="text-xs text-slate-400">{sub}</p>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, value, tone }: { label: string; value: string; tone?: "risk" }) {
  return (
    <div>
      <dt className={`text-xs font-semibold ${tone === "risk" ? "text-amber-700" : "text-slate-400"}`}>{label}</dt>
      <dd className="mt-0.5 text-foreground">{value}</dd>
    </div>
  );
}

function ratingClass(r: Rating) {
  if (r === "High") return "bg-sage text-white";
  if (r === "Med") return "bg-sage-tint text-sage-dark";
  return "bg-slate-100 text-slate-400";
}

function Approaches({ opp }: { opp: Opportunity }) {
  const recommended = opp.approaches.find((a) => a.recommended);
  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">
        Same customer and problem, different forms. Each is scored so the group picks a first move —
        not a pile of random ideas.
      </p>

      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="p-3 text-left font-semibold text-slate-500">Approach</th>
              {DIMENSIONS.map((d) => (
                <th key={d} className="p-3 text-center text-xs font-semibold text-slate-500">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {opp.approaches.map((a) => (
              <tr
                key={a.name}
                className={`border-b border-slate-100 last:border-0 ${a.recommended ? "bg-sage-tint/40" : ""}`}
              >
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{a.name}</span>
                    {a.recommended && (
                      <span className="rounded-full bg-sage px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 max-w-xs text-xs text-slate-500">{a.desc}</p>
                </td>
                {DIMENSIONS.map((d) => (
                  <td key={d} className="p-3 text-center">
                    <span className={`inline-block min-w-12 rounded-md px-2 py-1 text-xs font-semibold ${ratingClass(a.ratings[d])}`}>
                      {a.ratings[d]}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {recommended && (
        <Card className="border-sage/40 bg-sage-tint/30">
          <p className="text-xs font-bold uppercase tracking-wide text-sage-dark">
            Recommended first test — {recommended.name}
          </p>
          <p className="mt-2 text-foreground">{opp.recommendedNote}</p>
        </Card>
      )}
    </div>
  );
}

function Output({ opp }: { opp: Opportunity }) {
  const o = opp.output;
  return (
    <div className="space-y-5">
      <Card className="border-sage/40 bg-sage-tint/20">
        <p className="text-xs font-bold uppercase tracking-wide text-sage-dark">One-line company description</p>
        <p className="mt-2 text-lg font-semibold text-foreground">{o.oneLiner}</p>
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Customer / problem</p>
          <p className="mt-2 text-foreground">{o.statement}</p>
        </Card>
        <Card>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Testable hypothesis</p>
          <p className="mt-2 text-foreground">{o.hypothesis}</p>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">Validation page</p>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-3 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-foreground">{o.page.title}</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600">{o.page.subtitle}</p>
              <span className="mt-4 inline-flex h-10 items-center rounded-xl bg-sage px-5 text-sm font-bold text-white">
                {o.page.cta}
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">Outreach copy</p>
          <Outreach outreach={o.outreach} />
        </Card>
      </div>

      <Card className="flex items-start gap-3 border-sage/40 bg-sage-tint/30">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage text-white">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
            <path d="m5 12 5 5L20 7" />
          </svg>
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-sage-dark">Decision rule</p>
          <p className="mt-1 text-foreground">{o.decisionRule}</p>
        </div>
      </Card>
    </div>
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
          <button
            key={c.key}
            onClick={() => setActive(c.key)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              active === c.key ? "bg-sage text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <p className="whitespace-pre-line rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
        {outreach[active]}
      </p>
    </div>
  );
}
