const NAV = [
  { label: "How it works", href: "#how" },
  { label: "What you get", href: "#deliverables" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const AVATARS = [
  { initials: "MA", cls: "bg-emerald-100 text-emerald-700" },
  { initials: "AL", cls: "bg-sky-100 text-sky-700" },
  { initials: "PR", cls: "bg-amber-100 text-amber-700" },
  { initials: "JO", cls: "bg-violet-100 text-violet-700" },
  { initials: "SA", cls: "bg-rose-100 text-rose-700" },
];

const FEATURES = [
  { icon: "M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z", title: "Cheap: anyone can name an idea", text: "Your group chat is the proof. Thinking of something was never the hard part — turning one into a thing you can move on is." },
  { icon: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18|M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10|M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2", title: "Actionable: a plan you can run", text: "Roles, a 30-day path, and a hypothesis with a clear pass or fail. You leave knowing the first move and who makes it." },
  { icon: "M22 2 11 13|M22 2l-7 20-4-9-9-4z", title: "Shareable: links you can send", text: "A validation page, a pitch deck, and outreach copy — the things you put in front of customers and backers, not another message in the chat." },
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

const PRICING = [
  { name: "Free", price: "$0", period: "", tagline: "See what you're sitting on.", cta: "Start free", href: "/demo/free", features: ["Invite up to 3 people", "Agent access for 24 hours", "Basic venture outline", "Up to 5 potential ventures"] },
  { name: "Seed", price: "$50", period: "/ person", tagline: "Part goes to the Flash Fund for fast seed funding.", cta: "Run a sprint", href: "/demo", featured: true, features: ["Up to 3-person team", "Agent access for 48 hours", "7-day validation roadmap", "3–5 venture outlines + venture building"] },
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

function Glyph({ d, className = "h-5 w-5" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {d.split("|").map((seg, i) => <path key={i} d={seg} />)}
    </svg>
  );
}

const BOLT = "M13 2 4.5 13.5H11l-1.5 8.5L20 9.5h-6.5L13 2Z";

function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-sage" aria-hidden="true"><path d={BOLT} /></svg>
      <span className="text-lg font-bold tracking-tight text-foreground">Flash Company</span>
    </span>
  );
}

function CtaButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <a href="/demo" className={`group inline-flex h-14 items-center gap-3 rounded-2xl bg-sage px-8 text-lg font-bold text-white shadow-lg shadow-sage/30 transition-colors hover:bg-sage-dark ${className}`}>
      {children}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
    </a>
  );
}

function Avatars() {
  return (
    <div className="flex -space-x-2">
      {AVATARS.map((a) => (
        <span key={a.initials} className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ring-2 ring-white ${a.cls}`}>{a.initials}</span>
      ))}
    </div>
  );
}

function HeroVenn() {
  const circle = { r: 96, fill: "var(--sage)", fillOpacity: 0.12, stroke: "var(--sage)", strokeOpacity: 0.6, strokeWidth: 1.5 };
  const cap = { textAnchor: "middle" as const, fill: "var(--sage-dark)", className: "font-serif italic", style: { fontWeight: 700 } };
  const sub = { textAnchor: "middle" as const, fill: "#475569", style: { fontSize: 9.5, fontWeight: 500 } };
  const iconBox = { fill: "none", stroke: "var(--sage-dark)", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 360 308" role="img" aria-label="Skills, Networks, and Insights overlap to reveal your best venture opportunity" className="h-auto w-full">
      <circle cx={180} cy={112} {...circle} />
      <circle cx={132} cy={196} {...circle} />
      <circle cx={228} cy={196} {...circle} />

      {/* Skills */}
      <svg x={168} y={50} width={24} height={24} viewBox="0 0 24 24" {...iconBox}>
        <path d="M12 3a6 6 0 0 0-3.7 10.8c.5.4.9 1 .9 1.7v.5h5.6v-.5c0-.7.4-1.3.9-1.7A6 6 0 0 0 12 3z" />
        <path d="M9.5 18.5h5" /><path d="M10.5 21h3" />
      </svg>
      <text x={180} y={92} {...cap} style={{ ...cap.style, fontSize: 16, letterSpacing: "0.06em" }}>SKILLS</text>
      <text x={180} y={108} {...sub}>What we can do</text>

      {/* Networks */}
      <text x={96} y={186} {...cap} style={{ ...cap.style, fontSize: 15, letterSpacing: "0.04em" }}>NETWORKS</text>
      <svg x={84} y={194} width={24} height={24} viewBox="0 0 24 24" {...iconBox}>
        <path d="M17 21v-2a4 4 0 0 0-3-3.87" /><path d="M7 21v-2a4 4 0 0 1 3-3.87" /><path d="M12 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" /><path d="M5 11a2.5 2.5 0 1 0 0-5" /><path d="M19 11a2.5 2.5 0 1 0 0-5" />
      </svg>
      <text x={96} y={226} {...sub}>Who we know</text>

      {/* Insights */}
      <text x={264} y={186} {...cap} style={{ ...cap.style, fontSize: 15, letterSpacing: "0.04em" }}>INSIGHTS</text>
      <svg x={252} y={194} width={24} height={24} viewBox="0 0 24 24" {...iconBox}>
        <path d="M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13z" /><path d="M15.5 15.5l4.5 4.5" />
      </svg>
      <text x={264} y={226} {...sub}>What we know</text>

      {/* Center — triple overlap */}
      <svg x={171} y={138} width={18} height={18} viewBox="0 0 24 24" fill="var(--sage-dark)" stroke="none">
        <path d="M12 4l1.6 4.8L18 10l-4.4 1.2L12 16l-1.6-4.8L6 10l4.4-1.2L12 4z" />
      </svg>
      <text x={180} y={170} {...cap} style={{ ...cap.style, fontSize: 10.5, letterSpacing: "0.02em" }}>Best Venture</text>
      <text x={180} y={183} {...cap} style={{ ...cap.style, fontSize: 10.5, letterSpacing: "0.02em" }}>Opportunity</text>
    </svg>
  );
}

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <header className="border-b border-slate-100">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 sm:px-10">
          <a href="/"><Logo /></a>
          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((n) => <a key={n.href} href={n.href} className="text-sm font-semibold text-slate-600 hover:text-foreground">{n.label}</a>)}
          </nav>
          <a href="/demo" className="inline-flex h-10 items-center rounded-xl bg-sage px-4 text-sm font-bold text-white transition-colors hover:bg-sage-dark">Start the sprint</a>
        </div>
      </header>

      {/* ABOVE THE FOLD */}
      <section className="mx-auto grid w-full max-w-7xl items-center gap-12 px-6 py-16 sm:px-10 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <div className="flex flex-col items-start">
          {/* 1 — Title */}
          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
            Ideas are cheap. Making one <span className="text-sage">actionable</span> is the whole game.
          </h1>
          {/* 2 — Subtitle */}
          <p className="mt-7 max-w-lg text-lg leading-8 text-slate-600">
            Your group has no shortage of &ldquo;we should build something.&rdquo; Flash Company takes what each of you knows — solo, on your own time — and turns it into one venture you can act on by Monday and share by Friday.
          </p>
          {/* 5 — CTA */}
          <CtaButton className="mt-10">Start the sprint</CtaButton>
          <p className="mt-3 text-sm font-medium text-slate-500">Up to 3 people · one 72-hour window · no group chat.</p>
          {/* 4 — Social proof (above the fold) */}
          <div className="mt-8 flex items-center gap-3">
            <Avatars />
            <p className="text-sm font-medium text-slate-600">Made for small teams of founders, operators, and creators.</p>
          </div>
        </div>
        {/* 3 — Visual */}
        <div className="w-full">
          <HeroVenn />
        </div>
      </section>

      {/* 6 — FEATURES (make the value concrete) */}
      <section id="how" className="border-y border-slate-100 bg-slate-50/60">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10">
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">The idea was never the bottleneck. The structure was.</h2>
          <p className="mt-3 max-w-xl text-lg text-slate-600">Flash Company makes one of your group&rsquo;s ideas actionable enough to run and sharp enough to send.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-3xl border border-slate-200 bg-white p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-tint text-sage-dark"><Glyph d={f.icon} className="h-6 w-6" /></span>
                <h3 className="mt-5 text-xl font-bold text-foreground">{f.title}</h3>
                <p className="mt-2 text-slate-600">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 — OBJECTIONS (handle them) */}
      <section className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10">
        <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">What teams worry about — handled.</h2>
        <div className="mt-10 grid gap-x-12 gap-y-8 sm:grid-cols-2">
          {OBJECTIONS.map((o) => (
            <div key={o.q} className="border-l-2 border-sage pl-5">
              <p className="text-lg font-bold text-foreground">&ldquo;{o.q}&rdquo;</p>
              <p className="mt-1.5 text-slate-600">{o.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7 — SOCIAL PROOF: deliverables + testimonials */}
      <section id="deliverables" className="border-y border-slate-100 bg-sage-tint/30">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10">
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">What you walk away with on day 3.</h2>
          <p className="mt-3 max-w-xl text-lg text-slate-600">One venture birth certificate — the whole thing, ready to share.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {DELIVERABLES.map((d) => (
              <div key={d} className="flex items-start gap-2.5 rounded-2xl border border-slate-200 bg-white p-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 h-4 w-4 shrink-0 text-sage" aria-hidden="true"><path d="m5 12 5 5L20 7" /></svg>
                <span className="text-sm font-medium text-slate-700">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="border-y border-slate-100 bg-slate-50/60">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10">
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Pricing that runs on buy-in.</h2>
          <p className="mt-3 max-w-xl text-lg text-slate-600">Everyone chips into the kitty, so everyone has skin in the game.</p>
          <div className="mt-10 grid gap-6 lg:grid-cols-4">
            {PRICING.map((t) => (
              <div key={t.name} className={`relative flex flex-col rounded-3xl border bg-white p-7 ${t.featured ? "border-sage ring-1 ring-sage" : "border-slate-200"}`}>
                {t.featured && <span className="absolute -top-3 left-7 rounded-full bg-sage px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">Most popular</span>}
                <p className="font-bold text-foreground">{t.name}</p>
                <p className="mt-3"><span className="text-3xl font-bold text-foreground">{t.price}</span> <span className="text-sm text-slate-500">{t.period}</span></p>
                <p className="mt-1 text-sm text-slate-500">{t.tagline}</p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 h-4 w-4 shrink-0 text-sage" aria-hidden="true"><path d="m5 12 5 5L20 7" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href={t.href} className={`mt-6 inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-bold transition-colors ${t.featured ? "bg-sage text-white hover:bg-sage-dark" : "border border-slate-200 text-foreground hover:bg-slate-50"}`}>{t.cta}</a>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-slate-400">Draft pricing from the working session — not final.</p>
        </div>
      </section>

      {/* 8 — FAQ */}
      <section id="faq" className="mx-auto w-full max-w-3xl px-6 py-20 sm:px-10">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Questions, answered.</h2>
        <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-lg font-semibold text-foreground marker:content-['']">
                {f.q}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0 text-sage transition-transform group-open:rotate-45" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
              </summary>
              <p className="mt-3 text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 9 — SECOND CTA */}
      <section className="bg-foreground">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 text-center sm:px-10">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">Stop saying &ldquo;we should build something.&rdquo;</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">Give your group 72 hours and a structure. Leave with one idea made actionable — and the page, deck, and copy to share it.</p>
          <CtaButton className="mt-9">Start the sprint</CtaButton>
          <p className="mt-3 text-sm font-medium text-white/50">Up to 3 people · one window · no group chat.</p>
        </div>
      </section>

      {/* 10 — FOUNDER'S NOTE */}
      <section className="mx-auto w-full max-w-3xl px-6 py-20 sm:px-10">
        <h2 className="text-sm font-bold uppercase tracking-wide text-sage">A note from the team</h2>
        <div className="mt-5 space-y-4 text-lg leading-relaxed text-slate-700">
          <p>We&rsquo;ve watched too many good group chats die in the &ldquo;we should build something&rdquo; phase.</p>
          <p>The people are right. The ideas are there. What&rsquo;s missing is a way to turn that energy into one clear thing to test — before the momentum fades and the chat goes quiet.</p>
          <p>So we built Flash Company: a short, structured window where a small group adds what they know, an agent finds the venture you&rsquo;re best placed to build, and you leave with something real to put in front of people.</p>
          <p>If you&rsquo;ve got a chat full of potential, give it 72 hours. See what you&rsquo;re sitting on.</p>
          <p className="font-semibold text-foreground">— The Flash Company team</p>
        </div>
      </section>

      <footer className="border-t border-slate-100">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row sm:px-10">
          <Logo />
          <p className="text-sm text-slate-400">A 72-hour sprint to turn a group into a venture.</p>
        </div>
      </footer>
    </div>
  );
}
