"use client";

import { useState } from "react";
import type { PromptView } from "@/lib/prompts";

// Admin tabs: the existing signups analytics, plus an editor for every LLM
// step's system prompt — edited live, saved to the DB, used on the next run.
export function DashboardTabs({ analytics, prompts }: { analytics: React.ReactNode; prompts: PromptView[] }) {
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
      {tab === "signups" ? <div className="mt-6">{analytics}</div> : <Prompts initial={prompts} />}
    </div>
  );
}

type SaveState = "idle" | "saving" | "saved" | "error";

function Prompts({ initial }: { initial: PromptView[] }) {
  const [items, setItems] = useState(initial);
  const [drafts, setDrafts] = useState<Record<string, string>>(() => Object.fromEntries(initial.map((p) => [p.key, p.system])));
  const [status, setStatus] = useState<Record<string, SaveState>>({});

  const post = (body: object) =>
    fetch("/api/prompts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

  const save = async (p: PromptView) => {
    setStatus((s) => ({ ...s, [p.key]: "saving" }));
    try {
      const res = await post({ key: p.key, system: drafts[p.key] });
      if (!res.ok) throw new Error();
      setItems((it) => it.map((x) => (x.key === p.key ? { ...x, system: drafts[p.key], overridden: drafts[p.key].trim() !== x.defaultSystem.trim() } : x)));
      setStatus((s) => ({ ...s, [p.key]: "saved" }));
    } catch {
      setStatus((s) => ({ ...s, [p.key]: "error" }));
    }
  };

  const reset = async (p: PromptView) => {
    setStatus((s) => ({ ...s, [p.key]: "saving" }));
    try {
      const res = await post({ key: p.key, reset: true });
      if (!res.ok) throw new Error();
      setDrafts((d) => ({ ...d, [p.key]: p.defaultSystem }));
      setItems((it) => it.map((x) => (x.key === p.key ? { ...x, system: p.defaultSystem, overridden: false } : x)));
      setStatus((s) => ({ ...s, [p.key]: "saved" }));
    } catch {
      setStatus((s) => ({ ...s, [p.key]: "error" }));
    }
  };

  return (
    <div className="mt-6 space-y-3">
      <p className="text-sm text-white/50">Edit the system prompt each step runs — this is the AI behind the scenes. Saved changes take effect on the next generation, no deploy needed. Reset returns a step to the code default.</p>
      {items.map((p) => {
        const draft = drafts[p.key] ?? "";
        const dirty = draft.trim() !== p.system.trim();
        const st = status[p.key] ?? "idle";
        return (
          <details key={p.key} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <summary className="flex cursor-pointer list-none items-center gap-3">
              <span className="text-sm font-bold text-white">{p.title}</span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white/60">{p.model}</span>
              {p.overridden && <span className="rounded-full bg-orange px-2 py-0.5 text-[11px] font-bold text-white">edited</span>}
              <span className="ml-auto truncate text-[11px] text-white/40">{p.when}</span>
            </summary>
            <div className="mt-4 space-y-3">
              <textarea
                value={draft}
                onChange={(e) => setDrafts((d) => ({ ...d, [p.key]: e.target.value }))}
                rows={8}
                spellCheck={false}
                className="w-full resize-y rounded-lg border border-white/10 bg-black/40 p-3 font-mono text-xs leading-relaxed text-white/80 focus:border-orange focus:outline-none [field-sizing:content]"
              />
              <div className="flex flex-wrap items-center gap-3">
                <button onClick={() => save(p)} disabled={!dirty || st === "saving"} className="inline-flex items-center gap-1.5 rounded-lg bg-orange px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-orange-dark disabled:opacity-40">{st === "saving" ? "Saving…" : "Save"}</button>
                {(p.overridden || dirty) && <button onClick={() => reset(p)} disabled={st === "saving"} className="text-xs font-semibold text-white/50 transition-colors hover:text-white/80">Reset to default</button>}
                {st === "saved" && !dirty && <span className="text-xs text-emerald-400">Saved</span>}
                {st === "error" && <span className="text-xs text-red-400">Failed — try again</span>}
                {dirty && st !== "saving" && <span className="text-xs text-white/40">Unsaved changes</span>}
              </div>
            </div>
          </details>
        );
      })}
    </div>
  );
}
