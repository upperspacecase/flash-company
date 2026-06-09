import Link from "next/link";
import { createTeam } from "@/app/s/actions";

export const metadata = { title: "Start a Flash · Flash Company" };

// Real entry point: creates a team + your (host) member and drops you into the
// live workspace with a shareable invite link. No login — just a link.
export default function StartPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-black px-5 text-center">
      <div className="pointer-events-none fixed inset-0 z-0 bg-grid" />
      <div className="relative z-10 mx-auto max-w-xl">
        <Link href="/" className="mb-8 inline-flex items-center gap-2.5">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 text-sage"><path d="M13 2 4.5 13.5H11l-1.5 8.5L20 9.5h-6.5L13 2Z" /></svg>
          <span className="text-xl font-bold tracking-tight text-white">Flash Company</span>
        </Link>
        <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl">
          What could you and up to two others build together?
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-white/60">
          Start a Flash, invite up to two people with a link, and the agent synthesises the three of you into ventures worth building. No app, no account.
        </p>
        <form action={createTeam} className="mt-8">
          <button
            type="submit"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-sage px-7 text-sm font-bold text-white transition-colors hover:bg-sage-dark"
          >
            Start a Flash
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M13 2 4.5 13.5H11l-1.5 8.5L20 9.5h-6.5L13 2Z" /></svg>
          </button>
        </form>
        <p className="mt-4 text-xs text-white/40">Prototype — no payment is taken. Want a guided walkthrough first? <Link href="/demo" className="font-semibold text-sage hover:underline">See the demo</Link>.</p>
      </div>
    </main>
  );
}
