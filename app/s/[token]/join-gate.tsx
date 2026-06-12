"use client";

import { useEffect, useRef } from "react";
import { joinTeam } from "../actions";

// First visit to an invite link with no member cookie: join (sets the cookie
// server-side), then HARD-navigate so the new cookie is sent on the next request
// and the page renders the live workspace. router.refresh() is unreliable here —
// it doesn't consistently pick up a cookie set inside a server action, leaving a
// teammate stuck on "Joining…".
export function JoinGate({ token }: { token: string }) {
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    (async () => {
      try {
        await joinTeam(token);
      } finally {
        window.location.replace(`/s/${token}`);
      }
    })();
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="flex items-center gap-3 text-sm text-white/70">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        Joining your team…
      </div>
    </div>
  );
}
