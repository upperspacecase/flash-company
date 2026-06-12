"use client";

import { useState, type FormEvent } from "react";
import type { LandingCopy } from "@/app/demo/data";

// The live, public venture landing page — served when the team publishes. The
// CTA captures real signups into the venture_signups table.
export function PublicLanding({ token, name, landing }: { token: string; name: string; landing: LandingCopy }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setState("loading");
    try {
      await fetch(`/api/v/${token}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch { /* still thank them; we'll retry capture another time */ }
    setState("done");
  };

  return (
    <main className="relative min-h-screen bg-black text-white">
      <div className="pointer-events-none fixed inset-0 z-0 bg-grid" />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
        <span className="mb-8 flex items-center gap-2 text-sm font-bold tracking-tight text-white/70">
          <span className="h-2.5 w-2.5 rounded-full bg-orange" /> {name}
        </span>
        <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">{landing.headline}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60">{landing.subhead}</p>

        <div className="mt-10 w-full max-w-md">
          {state === "done" ? (
            <p className="rounded-xl border border-orange/40 bg-orange/10 px-5 py-4 text-sm font-semibold text-orange">You&rsquo;re on the list — we&rsquo;ll be in touch.</p>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="h-12 flex-1 rounded-xl border border-white/15 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 focus:border-orange focus:outline-none" />
              <button disabled={state === "loading"} className="h-12 shrink-0 rounded-xl bg-orange px-6 text-sm font-bold text-white transition-colors hover:bg-orange-dark disabled:opacity-50">{state === "loading" ? "…" : landing.cta}</button>
            </form>
          )}
        </div>

        {landing.proof.stat && (
          <p className="mt-10 text-sm text-white/50"><span className="font-semibold text-white/80">{landing.proof.stat}</span>{landing.proof.detail ? ` — ${landing.proof.detail}` : ""}</p>
        )}
        <p className="mt-16 text-xs text-white/30">Built with Flash Company</p>
      </div>
    </main>
  );
}
