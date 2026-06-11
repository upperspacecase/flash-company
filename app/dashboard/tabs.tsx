"use client";

import { useState } from "react";
import { LLM_STEPS } from "@/lib/llm-spec";

// Admin tabs: the existing signups analytics, plus full visibility into every
// LLM step's instructions, inputs, and outputs.
export function DashboardTabs({ analytics }: { analytics: React.ReactNode }) {
  const [tab, setTab] = useState<"signups" | "prompts">("signups");
  const tabs: [typeof tab, string][] = [["signups", "Signups"], ["prompts", "LLM prompts"]];
  return (
    <div className="mt-8">
      <div className="flex gap-1 border-b border-white/10">
        {tabs.map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-semibold transition-colors ${tab === k ? "border-orange text-white" : "border-transparent text-white/40 hover:text-white/70"}`}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "signups" ? <div className="mt-6">{analytics}</div> : <Prompts />}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wide text-white/40">{label}</p>
      <p className="mt-0.5 text-white/70">{value}</p>
    </div>
  );
}

function Prompts() {
  return (
    <div className="mt-6 space-y-3">
      <p className="text-sm text-white/50">The exact instructions, inputs, and outputs for every LLM step — the live source the generators import, so there&rsquo;s no drift between what&rsquo;s shown here and what runs.</p>
      {LLM_STEPS.map((s) => (
        <details key={s.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
          <summary className="flex cursor-pointer list-none items-center gap-3">
            <span className="text-sm font-bold text-white">{s.title}</span>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white/60">{s.model}</span>
            <span className="ml-auto text-[11px] text-white/40">{s.tools === "none" ? "no tools" : s.tools}</span>
          </summary>
          <div className="mt-4 space-y-4 text-sm">
            <Meta label="When it runs" value={s.when} />
            <Meta label="Thinking / effort" value={`${s.thinking} · effort ${s.effort}`} />
            <Meta label="Inputs" value={s.inputs} />
            <Meta label="Outputs" value={s.outputs} />
            <div>
              <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-white/40">System prompt</p>
              <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg border border-white/10 bg-black/40 p-3 text-xs leading-relaxed text-white/80">{s.system}</pre>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
