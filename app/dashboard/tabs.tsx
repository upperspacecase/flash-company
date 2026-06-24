"use client";

import { useState } from "react";
import type { PromptView } from "@/lib/prompts";
import type { FeedbackRow, FlashRow } from "@/lib/db";

// Admin tabs: the Flashes started (teams + stage), the existing signups analytics,
// an editor for every LLM step's system prompt (edited live, saved to the DB, used
// on the next run), and the in-app feedback users have submitted.
export function DashboardTabs({ analytics, prompts, feedback, flashes }: { analytics: React.ReactNode; prompts: PromptView[]; feedback: FeedbackRow[]; flashes: FlashRow[] }) {
  const [tab, setTab] = useState<"flashes" | "signups" | "prompts" | "feedback">("flashes");
  const tabs: [typeof tab, string][] = [["flashes", `Flashes${flashes.length ? ` (${flashes.length})` : ""}`], ["signups", "Signups"], ["feedback", `Feedback${feedback.length ? ` (${feedback.length})` : ""}`], ["prompts", "LLM prompts"]];
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
      {tab === "flashes" && <FlashesTable items={flashes} />}
      {tab === "signups" && <div className="mt-6">{analytics}</div>}
      {tab === "feedback" && <FeedbackList items={feedback} />}
      {tab === "prompts" && <Prompts initial={prompts} />}
    </div>
  );
}

// The six pipeline stages, mirroring the product's STEPS (app/demo/data.ts).
const STAGES = ["Invite", "Input", "Synthesis", "Opportunities", "Idea", "Validation"] as const;

// Furthest stage a Flash has reached, derived from which artifacts exist. The
// venture build is an intermediate of the Idea step, so it counts as Idea.
function flashStage(f: FlashRow): number {
  if (f.signups > 0) return 5; // Validation — landing live, capturing signups
  if (f.has_ventures || f.has_build) return 4; // Idea (done or generating)
  if (f.has_opportunity) return 3;
  if (f.has_synthesis) return 2;
  if (f.accepted >= 2) return 1; // Input — team formed, intake underway
  return 0; // Invite — still forming
}

function FlashesTable({ items }: { items: FlashRow[] }) {
  if (items.length === 0) {
    return <p className="mt-6 rounded-xl border border-white/10 bg-white/5 px-5 py-8 text-sm text-white/40">No Flashes started yet.</p>;
  }
  return (
    <section className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-white/5">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-white/40">
            <th className="px-5 py-3 font-medium">Flash</th>
            <th className="px-5 py-3 font-medium">Team</th>
            <th className="px-5 py-3 font-medium">Progress</th>
          </tr>
        </thead>
        <tbody>
          {items.map((f) => {
            const stage = flashStage(f);
            const pending = f.members - f.accepted;
            return (
              <tr key={f.token} className="border-t border-white/5 align-top">
                <td className="px-5 py-3">
                  <a href={`/s/${f.token}`} target="_blank" rel="noreferrer" className="font-mono text-white/80 transition-colors hover:text-orange">/s/{f.token}</a>
                  <p className="mt-1 text-xs text-white/40">{new Date(f.created_at).toLocaleDateString()}{f.plan === "free" ? " · free" : ""}</p>
                </td>
                <td className="px-5 py-3">
                  <span className="font-semibold tabular-nums text-white/80">{f.accepted}</span>
                  <span className="text-white/40"> in</span>
                  {pending > 0 && <span className="text-white/30"> · {pending} pending</span>}
                </td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-orange px-2 py-0.5 text-[11px] font-bold text-white">{STAGES[stage]}</span>
                    <span className="text-[11px] text-white/40">step {stage + 1}/{STAGES.length}</span>
                    {f.signups > 0 && <span className="text-[11px] text-emerald-400">{f.signups} signup{f.signups === 1 ? "" : "s"}</span>}
                  </div>
                  <div className="mt-2 flex gap-1">
                    {STAGES.map((label, i) => (
                      <span key={label} className={`h-1.5 w-6 rounded-full ${i <= stage ? "bg-orange" : "bg-white/10"}`} />
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

const KIND_STYLE: Record<string, string> = {
  idea: "bg-sky-500/15 text-sky-300",
  request: "bg-violet-500/15 text-violet-300",
  bug: "bg-red-500/15 text-red-300",
  feedback: "bg-emerald-500/15 text-emerald-300",
};

function FeedbackList({ items }: { items: FeedbackRow[] }) {
  if (items.length === 0) {
    return <p className="mt-6 rounded-xl border border-white/10 bg-white/5 px-5 py-8 text-sm text-white/40">No feedback yet.</p>;
  }
  return (
    <div className="mt-6 space-y-3">
      {items.map((f) => (
        <div key={f.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className={`rounded-full px-2 py-0.5 font-bold capitalize ${KIND_STYLE[f.kind] ?? "bg-white/10 text-white/70"}`}>{f.kind}</span>
            {f.screen && <span className="rounded-full bg-white/10 px-2 py-0.5 font-medium text-white/60">{f.screen}</span>}
            {f.path && <span className="font-mono text-white/30">{f.path}</span>}
            <span className="ml-auto text-white/40">{new Date(f.created_at).toLocaleString()}</span>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm text-white/85">{f.message}</p>
          {f.image && (
            <a href={f.image} target="_blank" rel="noreferrer" className="mt-3 inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.image} alt="Feedback screenshot" className="max-h-48 rounded-lg border border-white/10" />
            </a>
          )}
          {f.member_id && <p className="mt-3 font-mono text-[11px] text-white/30">member {f.member_id}{f.team_token ? ` · team ${f.team_token}` : ""}</p>}
        </div>
      ))}
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
