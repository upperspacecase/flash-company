"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { joinTeam } from "../actions";

// First visit to an invite link with no member cookie: join (sets the cookie
// server-side), then refresh so the page renders the live workspace.
export function JoinGate({ token }: { token: string }) {
  const router = useRouter();
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    (async () => {
      await joinTeam(token);
      router.refresh();
    })();
  }, [token, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="flex items-center gap-3 text-sm text-white/70">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        Joining your team…
      </div>
    </div>
  );
}
