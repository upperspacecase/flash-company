"use client";

import { useEffect, useRef } from "react";
import { createTeam } from "@/app/s/actions";

// Starting a Flash goes straight to the invite screen — no interstitial. This
// creates the team + host member (sets the cookie) and server-redirects to
// /s/{token}. A ref guards the strict-mode double-mount.
export function StartGate() {
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    createTeam();
  }, []);
  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="flex items-center gap-3 text-sm text-white/70">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        Creating your Flash…
      </div>
    </main>
  );
}
