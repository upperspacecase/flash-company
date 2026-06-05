"use client";

import { useEffect, useRef, useState } from "react";

const BOLT = "M13 2 4.5 13.5H11l-1.5 8.5L20 9.5h-6.5L13 2Z";

const SECTIONS = [
  { id: "hero", label: "Start" },
  { id: "problem", label: "The problem" },
  { id: "beats", label: "Convergence" },
  { id: "worries", label: "How it works" },
  { id: "pricing", label: "Pricing" },
  { id: "fund", label: "Flash Fund" },
  { id: "start", label: "Get started" },
];

const HOW = [
  { n: "01", title: "Form your trio", text: "Pick two people. Any two — friends, colleagues, strangers who should meet. You each pay €10 and get access to a shared AI agent tuned for venture design." },
  { n: "02", title: "48-hour ideation sprint", text: "Your agent interviews all three of you, maps your overlapping skills, and guides you through a structured ideation process. At the end: one venture concept worth testing." },
  { n: "03", title: "30-day validation plan", text: "Add €40 per person to unlock a detailed validation roadmap — experiments, metrics, and a go/no-go decision framework. Run it. Prove it. Or kill it fast." },
];

type Tier = { name: string; price: string; period: string; desc: string; featured?: boolean };

const PRICING: Tier[] = [
  { name: "Ideation Sprint", price: "€10", period: "/ person", desc: "Your trio plus a shared AI agent. A 48-hour sprint down to one venture concept worth testing.", featured: true },
  { name: "Validation Plan", price: "+€40", period: "/ person", desc: "Unlock the 30-day validation roadmap — experiments, metrics, and a go/no-go decision framework." },
  { name: "Enterprise", price: "€2,000", period: "/ month", desc: "Run Flash Company across your organisation — up to 100 teams." },
];

const NOTE = [
  "We've watched too many good group chats die in the \"we should build something\" phase.",
  "The people are right. The ideas are there. What's missing is a way to turn that energy into one clear thing to test — before the momentum fades and the chat goes quiet.",
  "So we built Flash Company: a short, structured window where a small group adds what they know, an agent finds the venture you're best placed to build, and you leave with something real to put in front of people.",
];

function EmailCapture({ note }: { note?: string }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  if (done) {
    return <p className="text-sm font-semibold text-accent">Thanks — we&rsquo;ll email you when the next window opens.</p>;
  }
  return (
    <div>
      <form onSubmit={(e) => { e.preventDefault(); setDone(true); }} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          aria-label="Email address"
          className="h-12 flex-1 rounded-md border border-white/20 bg-white/5 px-4 text-sm text-white placeholder:text-white/35 focus:border-accent focus:outline-none"
        />
        <button type="submit" className="inline-flex h-12 items-center justify-center rounded-md bg-accent px-6 text-sm font-semibold text-black transition-colors hover:bg-accent/90">
          Get early access
        </button>
      </form>
      {note && <p className="mt-3 text-xs text-white/35">{note}</p>}
    </div>
  );
}

function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="relative z-10 flex min-h-screen w-full snap-start items-center py-24">
      <div className="w-full px-6 sm:px-12 lg:px-24">
        <div className="max-w-6xl">{children}</div>
      </div>
    </section>
  );
}

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="text-5xl font-extrabold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">{children}</h2>;
}

function Convergence() {
  const c = { r: 52, fill: "rgba(255,255,255,0.03)", stroke: "rgba(255,255,255,0.35)", strokeWidth: 1.3 };
  return (
    <svg viewBox="0 0 240 252" className="w-96 max-w-full sm:w-[28rem]" role="img" aria-label="Skills, Networks and Insights converge">
      <circle cx={120} cy={92} {...c} />
      <circle cx={88} cy={150} {...c} />
      <circle cx={152} cy={150} {...c} />
      <circle cx={120} cy={131} r={4} fill="var(--accent)" />
      <g stroke="rgba(255,255,255,0.18)" strokeWidth={1}>
        <path d="M58 228 L78 192" />
        <path d="M182 228 L166 192" />
      </g>
      <text x={120} y={24} textAnchor="middle" fill="rgba(255,255,255,0.72)" style={{ fontSize: 13, fontWeight: 700 }}>Skills</text>
      <text x={120} y={37} textAnchor="middle" fill="rgba(255,255,255,0.3)" style={{ fontSize: 9 }}>what we can do</text>
      <text x={46} y={236} textAnchor="middle" fill="rgba(255,255,255,0.72)" style={{ fontSize: 13, fontWeight: 700 }}>Networks</text>
      <text x={46} y={249} textAnchor="middle" fill="rgba(255,255,255,0.3)" style={{ fontSize: 9 }}>who we know</text>
      <text x={194} y={236} textAnchor="middle" fill="rgba(255,255,255,0.72)" style={{ fontSize: 13, fontWeight: 700 }}>Insights</text>
      <text x={194} y={249} textAnchor="middle" fill="rgba(255,255,255,0.3)" style={{ fontSize: 9 }}>what we know</text>
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 64 24" className="w-20 shrink-0 rotate-90 xl:rotate-0" aria-hidden="true">
      <path d="M4 12h50 M46 5l9 7-9 7" fill="none" stroke="var(--accent)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Wireframe() {
  const line = "rgba(255,255,255,0.4)";
  return (
    <svg viewBox="0 0 300 270" className="w-[30rem] max-w-full sm:w-[36rem]" role="img" aria-label="A landing page that is actionable, shareable and testable">
      <rect x={44} y={48} width={168} height={172} rx={10} fill="rgba(255,255,255,0.03)" stroke={line} strokeWidth={1.4} />
      <path d="M44 66 H212" stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
      <circle cx={56} cy={57} r={2.4} fill="rgba(255,255,255,0.3)" />
      <circle cx={66} cy={57} r={2.4} fill="rgba(255,255,255,0.3)" />
      <circle cx={76} cy={57} r={2.4} fill="rgba(255,255,255,0.3)" />
      <rect x={58} y={82} width={104} height={14} rx={3} fill="rgba(255,255,255,0.16)" />
      <rect x={172} y={82} width={40} height={40} rx={4} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
      <rect x={58} y={106} width={120} height={5} rx={2.5} fill="rgba(255,255,255,0.1)" />
      <rect x={58} y={116} width={90} height={5} rx={2.5} fill="rgba(255,255,255,0.1)" />
      <rect x={58} y={132} width={68} height={21} rx={5} fill="none" stroke="var(--accent)" strokeWidth={1.5} />
      <rect x={58} y={170} width={104} height={19} rx={4} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.25)" strokeWidth={1} />
      <rect x={166} y={170} width={32} height={19} rx={4} fill="var(--accent)" opacity={0.85} />
      <g stroke="rgba(255,119,0,0.45)" strokeWidth={1}>
        <path d="M128 32 V46" />
        <path d="M222 116 H214" />
        <path d="M128 244 V222" />
      </g>
      <text x={128} y={26} textAnchor="middle" fill="var(--accent)" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em" }}>ACTIONABLE</text>
      <text x={226} y={120} textAnchor="start" fill="var(--accent)" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em" }}>SHAREABLE</text>
      <text x={128} y={258} textAnchor="middle" fill="var(--accent)" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em" }}>TESTABLE</text>
    </svg>
  );
}

export default function Home() {
  const scrollRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const i = SECTIONS.findIndex((s) => s.id === e.target.id);
            if (i >= 0) setActive(i);
          }
        }
      },
      { root, threshold: 0.55 },
    );
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  }, []);

  const go = (i: number) => document.getElementById(SECTIONS[i].id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <main ref={scrollRef} className="relative h-screen snap-y snap-mandatory overflow-y-scroll scroll-smooth bg-black text-white">
      <div className="pointer-events-none fixed inset-0 z-0 bg-grid" />

      <a href="#hero" onClick={(e) => { e.preventDefault(); go(0); }} className="fixed left-6 top-6 z-30 flex items-center gap-2 sm:left-10">
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-accent" aria-hidden="true"><path d={BOLT} /></svg>
        <span className="text-sm font-bold tracking-tight text-white">Flash Company</span>
      </a>

      <nav aria-label="Sections" className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 sm:flex">
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => go(i)}
            aria-label={s.label}
            aria-current={active === i ? "true" : undefined}
            className={`h-2.5 w-2.5 rounded-full transition-all ${active === i ? "scale-125 bg-white" : "bg-white/30 hover:bg-white/60"}`}
          />
        ))}
      </nav>

      {/* HERO */}
      <Section id="hero">
        <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">What if 48 hours from now you had a company idea worth sharing?</h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-white/60">
          A guided ideation process that maps your skills, stories, and curiosities into one venture concept worth growing.
        </p>
        <div className="mt-9">
          <EmailCapture note="Early access — no spam, just a note when the next window opens." />
        </div>
      </Section>

      {/* PROBLEM */}
      <Section id="problem">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">The problem</p>
        <div className="mt-7 max-w-3xl space-y-5">
          <p className="text-2xl font-medium leading-snug text-white/80 sm:text-3xl">Most people have the skills, the network, and the curiosity to start something.</p>
          <p className="text-2xl font-medium leading-snug text-white/80 sm:text-3xl">What they don&rsquo;t have is the trigger — a forcing function that turns &ldquo;we should do something together&rdquo; into an actual company.</p>
          <p className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">Flash Company is that trigger.</p>
        </div>
      </Section>

      {/* CONVERGENCE → OUTPUT */}
      <section id="beats" className="relative z-10 flex min-h-screen w-full snap-start items-center justify-center px-6 py-24">
        <div className="w-full max-w-7xl">
          <div className="flex flex-col items-center justify-center gap-8 xl:flex-row xl:gap-12">
            <Convergence />
            <ArrowRight />
            <Wireframe />
          </div>
          <p className="mx-auto mt-12 max-w-xl text-center text-lg text-white/55">
            What your group already knows, turned into one venture you can put in front of people.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <Section id="worries">
        <H>How it works.</H>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {HOW.map((s) => (
            <div key={s.n}>
              <p className="text-3xl font-extrabold tracking-tight text-accent">{s.n}</p>
              <h3 className="mt-3 text-lg font-bold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{s.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <EmailCapture />
        </div>
      </Section>

      {/* PRICING */}
      <Section id="pricing">
        <H>What it costs.</H>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {PRICING.map((t) => (
            <div key={t.name} className={`flex flex-col rounded-xl border p-6 ${t.featured ? "border-accent bg-accent/5" : "border-white/15 bg-white/5"}`}>
              {t.featured && <span className="mb-3 w-fit rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-black">Start here</span>}
              <p className="text-sm font-semibold text-white">{t.name}</p>
              <p className="mt-2"><span className="text-3xl font-extrabold text-white">{t.price}</span> <span className="text-xs text-white/40">{t.period}</span></p>
              <p className="mt-3 text-sm leading-relaxed text-white/55">{t.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-white/60">No subscriptions. No lock-in. Pay for the sprint, keep the company.</p>
      </Section>

      {/* FLASH FUND */}
      <Section id="fund">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Flash Fund</p>
        <h2 className="mt-7 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl">Every Flash Company contributes to the Flash Fund.</h2>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-white/60">
          A percentage of all revenue goes into a fast seed fund. Ventures that complete the 30-day validation with strong signals get fast, non-dilutive seed funding — no pitch decks, no 6-month raises. Just proof, then capital.
        </p>
        <p className="mt-7 max-w-2xl text-2xl font-bold leading-snug text-white">You don&rsquo;t just start a company. You fund the next one.</p>
      </Section>

      {/* GET STARTED */}
      <Section id="start">
        <h2 className="text-6xl font-extrabold leading-[0.9] tracking-tight text-white sm:text-7xl lg:text-8xl">Get started.</h2>
        <p className="mt-7 max-w-xl text-lg text-white/60">Stop saying &ldquo;we should build something.&rdquo; Give your group 48 hours and a structure — and leave with one venture worth testing, and a plan to prove it.</p>
        <div className="mt-9">
          <EmailCapture />
        </div>
        <div className="mt-16 max-w-xl space-y-3 border-t border-white/10 pt-8 text-sm leading-relaxed text-white/45">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">A note from Ty &amp; River</p>
          {NOTE.map((p) => <p key={p}>{p}</p>)}
        </div>
        <p className="mt-12 text-xs text-white/30">Flash Company · A 48-hour sprint to turn a group into a venture.</p>
      </Section>
    </main>
  );
}
