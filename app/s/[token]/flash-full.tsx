// Shown when a Flash already holds three people and a fourth, different person
// tries to join. Existing members reclaim their seat by email, so they never
// see this.
export function FlashFull() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-center text-white">
      <div className="max-w-sm">
        <p className="text-lg font-bold">This Flash is full</p>
        <p className="mt-2 text-sm text-white/60">A Flash is capped at three people and this one&rsquo;s complete. Ask whoever invited you to start another.</p>
      </div>
    </main>
  );
}
