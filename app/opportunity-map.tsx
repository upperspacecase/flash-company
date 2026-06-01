type Path = string;

function Svg({ d, className = "h-5 w-5" }: { d: Path; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {d.split("|").map((seg, i) => <path key={i} d={seg} />)}
    </svg>
  );
}

const ICONS = {
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2|M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
  alert: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18|M12 8v5|M12 16h.01",
  bolt: "M13 2 4.5 13.5H11l-1.5 8.5L20 9.5h-6.5L13 2Z",
  rocket: "M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2 0-2.8a2 2 0 0 0-3 0|M12 15l-3-3a22 22 0 0 1 8-10c2.5 0 4 .5 4 .5s.5 1.5.5 4a22 22 0 0 1-10 8|M9 12H4s.5-2.8 2-4c1.7-1.3 5-1 5-1|M12 15v5s2.8-.5 4-2c1.5-1.3 1-5 1-5",
  laptop: "M3 5a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v11H3z|M2 20h20|M9 20l.5-2h5l.5 2",
  store: "M3 9l1.5-5h15L21 9|M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9|M3 9h18|M9 20v-6h6v6",
  building: "M3 21h18|M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16|M15 21V9h2a2 2 0 0 1 2 2v10|M8 7h2|M8 11h2|M8 15h2",
  target: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18|M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10|M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2",
  monitor: "M3 4h18a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z|M8 21h8|M12 17v4",
  check: "m5 12 5 5L20 7",
  share: "M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7|M16 6l-4-4-4 4|M12 2v13",
} as const;

const ROWS = [
  { icon: ICONS.user, title: "Customer", text: "Small groups of 2–5 people who want to build something together." },
  { icon: ICONS.alert, title: "Problem", text: "They have energy and ideas, but lack clarity on the customer, problem, and best path forward." },
  { icon: ICONS.bolt, title: "Why this is different", text: "Multiple humans contribute to one shared AI workflow instead of using fragmented individual tools." },
];

const APPROACHES = [
  { icon: ICONS.rocket, title: "Service", text: "Run a 2-day sprint for groups.", strongest: true },
  { icon: ICONS.laptop, title: "Software", text: "SaaS platform to guide sprints." },
  { icon: ICONS.store, title: "Marketplace", text: "Marketplace for sprint facilitators." },
  { icon: ICONS.building, title: "Acquire a small business", text: "Buy and build together." },
];

export function OpportunityMap() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-sage/5 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Opportunity Map</h2>
          <p className="mt-1 text-sm text-slate-500">Turning our collaboration into clarity.</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-sage px-3 py-1.5 text-xs font-semibold text-white">
          <Svg d={ICONS.share} className="h-3.5 w-3.5" /> Export / Share
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {ROWS.map((r) => (
          <div key={r.title} className="flex gap-3 rounded-2xl border border-slate-200 p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sage-tint text-sage-dark">
              <Svg d={r.icon} />
            </span>
            <div>
              <p className="font-bold text-foreground">{r.title}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-slate-600">{r.text}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-sm font-semibold text-slate-700">Approaches we could take</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {APPROACHES.map((a) => (
          <div
            key={a.title}
            className={`rounded-2xl border p-4 ${a.strongest ? "border-sage bg-sage-tint/30 ring-1 ring-sage" : "border-slate-200"}`}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sage-tint text-sage-dark">
              <Svg d={a.icon} className="h-4 w-4" />
            </span>
            <p className="mt-2.5 font-bold text-foreground">{a.title}</p>
            <p className="mt-0.5 text-xs leading-snug text-slate-500">{a.text}</p>
            {a.strongest && (
              <span className="mt-2 inline-block rounded-full bg-sage px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                Strongest path
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-sage-tint/40 p-5">
        <p className="flex items-center gap-2 font-bold text-foreground">
          <Svg d={ICONS.target} className="h-5 w-5 text-sage" /> Output
        </p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {[
            { icon: ICONS.check, title: "Clear testable hypothesis", text: "A focused statement we can test with real people." },
            { icon: ICONS.monitor, title: "Simple validation landing page", text: "One-page test to validate interest and value." },
          ].map((o) => (
            <div key={o.title} className="flex gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-sage">
                <Svg d={o.icon} className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-bold text-foreground">{o.title}</p>
                <p className="mt-0.5 text-xs leading-snug text-slate-500">{o.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
