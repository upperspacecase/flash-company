"use client";

import { useEffect, useRef, useState } from "react";

const BOLT = "M13 2 4.5 13.5H11l-1.5 8.5L20 9.5h-6.5L13 2Z";

const SECTIONS = [
  { id: "hero", label: "Start" },
  { id: "beats", label: "The idea" },
  { id: "worries", label: "Worries" },
  { id: "deliverables", label: "What you get" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "Questions" },
  { id: "start", label: "Get started" },
];

const BEATS = [
  { k: "Cheap", title: "Anyone can name an idea", text: "Your group chat is the proof. Thinking of something was never the hard part — turning one into a thing you can move on is." },
  { k: "Actionable", title: "A plan you can run", text: "Roles, a 30-day path, and a hypothesis with a clear pass or fail. You leave knowing the first move and who makes it." },
  { k: "Shareable", title: "Links you can send", text: "A validation page, a pitch deck, and outreach copy — the things you put in front of customers and backers, not another message in the chat." },
];

const OBJECTIONS = [
  { q: "We'll talk in circles.", a: "Everyone contributes separately into one agent. It does the synthesis — no thread to argue in." },
  { q: "We can't get everyone in a room.", a: "Input is async across three days. A few minutes each is enough to move things forward." },
  { q: "What if we pick the wrong idea?", a: "The sprint ranks your options and ends in a test you can run before building anything." },
  { q: "Another tool to babysit?", a: "No. The agent runs for 72 hours, then goes quiet until the day-7 check-in." },
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

function OrangeButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="inline-flex items-center rounded-md border border-accent px-6 py-3 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-black">
      {children}
    </a>
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
        <span className="inline-flex items-center rounded-full border border-white/25 px-3 py-1 text-xs font-medium tracking-wide text-white/70">Up to 3 people · 72 hours · no group chat</span>
        <h1 className="mt-6 text-6xl font-extrabold leading-[0.9] tracking-tight text-white sm:text-7xl lg:text-8xl">Ideas are cheap.</h1>
        <p className="mt-7 max-w-xl text-lg leading-8 text-white/60">
          Making one actionable is the whole game. Flash Company takes what your group knows — solo, on your own time — and turns it into one venture you can act on by Monday and share by Friday.
        </p>
        <div className="mt-9">
          <OrangeButton href="/demo">Start the sprint</OrangeButton>
        </div>
      </Section>

      {/* BEATS */}
      <Section id="beats">
        <H>The idea was never the bottleneck.</H>
        <p className="mt-6 max-w-xl text-lg text-white/60">Flash Company makes one of your group&rsquo;s ideas actionable enough to run and sharp enough to send.</p>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {BEATS.map((b) => (
            <div key={b.k}>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">{b.k}</p>
              <h3 className="mt-3 text-xl font-bold text-white">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{b.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* WORRIES */}
      <Section id="worries">
        <H>What teams worry about.</H>
        <div className="mt-12 grid gap-x-12 gap-y-8 sm:grid-cols-2">
          {OBJECTIONS.map((o) => (
            <div key={o.q} className="border-l-2 border-accent pl-5">
              <p className="text-lg font-bold text-white">&ldquo;{o.q}&rdquo;</p>
              <p className="mt-1.5 text-white/55">{o.a}</p>
            </div>
          ))}
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
          <OrangeButton href="/demo">Start the sprint</OrangeButton>
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
