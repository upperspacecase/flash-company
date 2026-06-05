"use client";

import { useEffect, useRef, useState } from "react";

const BOLT = "M13 2 4.5 13.5H11l-1.5 8.5L20 9.5h-6.5L13 2Z";

const SECTIONS = [
  { id: "hero", label: "Start" },
  { id: "beats", label: "Convergence" },
  { id: "worries", label: "How it works" },
  { id: "deliverables", label: "What you get" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "Questions" },
  { id: "start", label: "Get started" },
];

const HOW = [
  { n: "01", title: "Invite your group", text: "One link, up to three people. The 72-hour window starts once everyone's in. No accounts, no app to download." },
  { n: "02", title: "Everyone adds what they know", text: "Solo and async — skills, problems you keep noticing, people you can reach. A few minutes each, by text or voice." },
  { n: "03", title: "The agent finds the venture", text: "It reads across all of you, surfaces the opportunity you're best placed to win, and shapes it into one concrete venture." },
  { n: "04", title: "You leave with proof to test", text: "A validation page, a deck, and outreach copy. Then the agent goes quiet, checking back at day 7, 14, 21 and 30." },
];

const DELIVERABLES = [
  "Thesis — customer, problem, differentiation, chosen approach",
  "Roles & equity framework",
  "30-day roadmap",
  "Pitch deck (YC seed-deck format)",
  "Landing page",
  "Outreach copy",
  "Validation report",
  "Commitment ritual",
];

type Tier = { name: string; price: string; period: string; tagline: string; cta: string; href: string; featured?: boolean; features: string[] };

const PRICING: Tier[] = [
  { name: "Free", price: "$0", period: "", tagline: "See what you're sitting on.", cta: "Start free", href: "/demo/free", features: ["Invite up to 3 people", "Agent access for 24 hours", "Basic venture outline", "Up to 5 potential ventures"] },
  { name: "Seed", price: "$50", period: "/ person", tagline: "Part goes to the Flash Fund for fast seed funding.", cta: "Start the sprint", href: "/demo", featured: true, features: ["Up to 3-person team", "Agent access for 48 hours", "7-day validation roadmap", "3–5 venture outlines + venture building"] },
  { name: "Venture Launch", price: "$250", period: "upfront + $100/mo", tagline: "When you're ready to incorporate.", cta: "Talk to us", href: "/demo", features: ["Legal + financial setup", "Stripe Atlas + Estonia / LLC"] },
  { name: "Venture Grow", price: "$200–5,000", period: "/ month", tagline: "Scale the venture with agents.", cta: "Talk to us", href: "/demo", features: ["Agent orchestration", "Agent swarms"] },
];

const FAQS = [
  { q: "How many people can join a sprint?", a: "Up to three. Small enough to move fast, broad enough to bring a real range of skills and networks." },
  { q: "How long does it take?", a: "One 72-hour window — about three days. The time limit is the point: it forces a decision instead of a drawn-out maybe." },
  { q: "Do we need an idea already?", a: "No. You bring what you know — skills, problems you keep seeing, people you can reach. The agent finds the venture from there." },
  { q: "Isn't this another group chat?", a: "The opposite. Everyone contributes on their own into one shared agent, so there's no thread to keep up with." },
  { q: "What does it cost?", a: "A one-time buy-in for the group — everyone chips into the kitty, so everyone has skin in the game." },
  { q: "What happens after the three days?", a: "The agent goes quiet and checks back at day 7, 14, 21 and 30. The work stays with your team." },
  { q: "Is our input private?", a: "Your sprint is private to your group. Nothing leaves it unless you choose to share it." },
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
    <svg viewBox="0 0 240 252" className="w-48 shrink-0 sm:w-56" role="img" aria-label="Skills, Networks and Insights converge">
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
    <svg viewBox="0 0 64 24" className="w-10 shrink-0 rotate-90 lg:rotate-0" aria-hidden="true">
      <path d="M4 12h50 M46 5l9 7-9 7" fill="none" stroke="var(--accent)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Wireframe() {
  const line = "rgba(255,255,255,0.4)";
  return (
    <svg viewBox="0 0 300 270" className="w-60 shrink-0 sm:w-72" role="img" aria-label="A landing page that is actionable, shareable and testable">
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
        <h1 className="text-6xl font-extrabold leading-[0.9] tracking-tight text-white sm:text-7xl lg:text-8xl">Ideas are cheap.</h1>
        <p className="mt-7 max-w-xl text-lg leading-8 text-white/60">
          Making one actionable is the whole game. Flash Company takes what your group knows — solo, on your own time — and turns it into one venture you can act on by Monday and share by Friday.
        </p>
        <div className="mt-9">
          <EmailCapture note="Early access — no spam, just a note when the next window opens." />
        </div>
      </Section>

      {/* CONVERGENCE → OUTPUT */}
      <section id="beats" className="relative z-10 flex min-h-screen w-full snap-start items-center justify-center px-6 py-24">
        <div className="w-full max-w-5xl">
          <div className="flex flex-col items-center justify-center gap-6 lg:flex-row lg:gap-12">
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
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* DELIVERABLES */}
      <Section id="deliverables">
        <H>What you walk away with.</H>
        <p className="mt-6 max-w-xl text-lg text-white/60">One venture, the whole thing, ready to share on day 3.</p>
        <div className="mt-10 grid gap-x-10 gap-y-px sm:grid-cols-2">
          {DELIVERABLES.map((d) => (
            <div key={d} className="flex items-start gap-3 border-t border-white/10 py-4 text-white/80">
              <span className="text-accent">+</span>
              <span className="text-sm">{d}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* PRICING */}
      <Section id="pricing">
        <H>What it costs.</H>
        <p className="mt-6 max-w-xl text-lg text-white/60">Everyone chips into the kitty, so everyone has skin in the game.</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PRICING.map((t) => (
            <div key={t.name} className={`flex flex-col rounded-xl border p-6 ${t.featured ? "border-accent bg-accent/5" : "border-white/15 bg-white/5"}`}>
              {t.featured && <span className="mb-3 w-fit rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-black">Most popular</span>}
              <p className="text-sm font-semibold text-white">{t.name}</p>
              <p className="mt-2"><span className="text-3xl font-extrabold text-white">{t.price}</span> <span className="text-xs text-white/40">{t.period}</span></p>
              <p className="mt-1 text-xs text-white/40">{t.tagline}</p>
              <ul className="mt-4 flex-1 space-y-2">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2 text-xs text-white/70"><span className="text-accent">+</span><span>{f}</span></li>
                ))}
              </ul>
              <a href={t.href} className={`mt-5 inline-flex h-10 items-center justify-center rounded-md px-4 text-xs font-semibold transition-colors ${t.featured ? "bg-accent text-black hover:bg-accent/90" : "border border-white/20 text-white hover:bg-white/10"}`}>{t.cta}</a>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-white/30">Draft pricing from the working session — not final.</p>
      </Section>

      {/* FAQ */}
      <Section id="faq">
        <H>Questions.</H>
        <div className="mt-10 max-w-3xl divide-y divide-white/10 border-y border-white/10">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-lg font-semibold text-white marker:content-['']">
                {f.q}
                <span className="text-xl leading-none text-accent transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-white/55">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* GET STARTED */}
      <Section id="start">
        <h2 className="text-6xl font-extrabold leading-[0.9] tracking-tight text-white sm:text-7xl lg:text-8xl">Get started.</h2>
        <p className="mt-7 max-w-xl text-lg text-white/60">Stop saying &ldquo;we should build something.&rdquo; Give your group 72 hours and a structure — and leave with one idea made actionable, and the page, deck, and copy to share it.</p>
        <div className="mt-9">
          <EmailCapture />
        </div>
        <div className="mt-16 max-w-xl space-y-3 border-t border-white/10 pt-8 text-sm leading-relaxed text-white/45">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">A note from Ty &amp; River</p>
          {NOTE.map((p) => <p key={p}>{p}</p>)}
        </div>
        <p className="mt-12 text-xs text-white/30">Flash Company · A 72-hour sprint to turn a group into a venture.</p>
      </Section>
    </main>
  );
}
