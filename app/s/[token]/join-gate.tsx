"use client";

import { useState } from "react";
import { joinTeam, requestResumeLink } from "../actions";
import { FlashFull } from "./flash-full";
import { Icon, emailValid, type Identity } from "@/app/demo/workspace";
import { PRICE, SPRINT } from "@/app/demo/data";

// First screen on an invite link for someone who isn't in this team yet. Capture
// name + email up front — the email is what claims (or reclaims) a seat, so a
// click no longer burns one and the same person on a new device lands back on
// their own row. On the free plan joinTeam also accepts, so this is one screen.
// HARD-navigate after so the new cookie is sent on the next request.
export function JoinGate({ token, plan, inviterName }: { token: string; plan: "free" | "full"; inviterName: string | null }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [full, setFull] = useState(false);
  const [resumeEmail, setResumeEmail] = useState("");
  const [resumeBusy, setResumeBusy] = useState(false);
  const [resumeSent, setResumeSent] = useState(false);
  const isFree = plan === "free";
  const identity: Identity = { name: name.trim(), email: email.trim() };
  const identityValid = identity.name.length > 0 && emailValid(identity.email);

  const submit = async () => {
    if (!identityValid || busy) return;
    setBusy(true);
    const r = await joinTeam(token, identity);
    if (r === "full") { setFull(true); setBusy(false); return; }
    window.location.replace(`/s/${token}`);
  };

  // Returning on a new browser/device: email the link back to whoever joined
  // with this address. Always confirm the same way, whether or not it matched.
  const sendResume = async () => {
    if (!emailValid(resumeEmail) || resumeBusy) return;
    setResumeBusy(true);
    await requestResumeLink(token, resumeEmail.trim());
    setResumeSent(true);
    setResumeBusy(false);
  };

  if (full) return <FlashFull />;

  return (
    <div className="relative flex min-h-screen flex-col bg-black">
      <div className="pointer-events-none fixed inset-0 z-0 bg-grid" />
      <div className="relative z-10 mx-auto w-full max-w-xl flex-1 space-y-8 px-5 py-12">
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange">Kick-off</p>
          <h1 className="mt-3 text-3xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-4xl">{inviterName ? `${inviterName} invited you to Join a Flash` : "You’re invited to a Flash"}</h1>
          <p className="mt-3 text-slate-600">{isFree ? "Add your details to join — free to start." : `Everyone contributes ${PRICE.currency}${PRICE.perPerson} and 90 minutes over a ${SPRINT.windowHours}-hour period.`}</p>
        </section>
        <section className="rounded-2xl border border-orange bg-white/5 p-6">
          {!isFree && <p className="mb-4 text-right"><span className="text-3xl font-extrabold text-foreground">{PRICE.currency}{PRICE.perPerson}</span> <span className="text-xs text-slate-400">/ person</span></p>}
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-400">Your name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="h-12 w-full rounded-xl border border-slate-200 bg-white/5 px-4 text-sm text-foreground placeholder:text-slate-400 focus:border-orange focus:outline-none" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-400">Your email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") submit(); }} placeholder="you@email.com" className="h-12 w-full rounded-xl border border-slate-200 bg-white/5 px-4 text-sm text-foreground placeholder:text-slate-400 focus:border-orange focus:outline-none" />
              <span className="mt-1 block text-xs text-slate-400">We’ll email you the moment your team forms.</span>
            </label>
            <button onClick={submit} disabled={!identityValid || busy} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange px-6 text-sm font-bold text-white transition-colors hover:bg-orange-dark disabled:cursor-not-allowed disabled:opacity-50">
              {busy ? "Joining your team…" : "Accept the Invite"}
              {busy ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : <Icon name="bolt" className="h-4 w-4" />}
            </button>
          </div>
        </section>
        <section className="rounded-2xl border border-slate-200/10 bg-white/5 p-6">
          {resumeSent ? (
            <p className="text-sm text-slate-300">Check your inbox — if <span className="font-semibold text-foreground">{resumeEmail.trim()}</span> is already in this Flash, we’ve sent a link back to your progress.</p>
          ) : (
            <>
              <p className="text-sm font-bold text-foreground">Already in this Flash?</p>
              <p className="mt-1 text-xs text-slate-400">Switched devices, or lost your place? Enter the email you joined with and we’ll send a link straight back to your progress.</p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input type="email" value={resumeEmail} onChange={(e) => setResumeEmail(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") sendResume(); }} placeholder="you@email.com" className="h-12 w-full rounded-xl border border-slate-200 bg-white/5 px-4 text-sm text-foreground placeholder:text-slate-400 focus:border-orange focus:outline-none" />
                <button onClick={sendResume} disabled={!emailValid(resumeEmail) || resumeBusy} className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-orange px-5 text-sm font-bold text-foreground transition-colors hover:bg-orange/10 disabled:cursor-not-allowed disabled:opacity-50">
                  {resumeBusy ? "Sending…" : "Email me my link"}
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
