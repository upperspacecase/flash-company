"use client";

import { useEffect, useRef, useState } from "react";

export const ROLES = ["friends", "colleagues", "classmates", "mentors", "siblings", "grandmas", "entrepreneurs"];
const LONGEST = ROLES.reduce((a, b) => (b.length > a.length ? b : a));

// The hero word that rotates through ROLES. `className` sets the accent colour
// so each surface can use its own (text-accent on the dark landing, text-orange
// in the workspace) — both resolve to the same #ff5500.
export function CyclingWord({ className = "text-accent" }: { className?: string }) {
  const [i, setI] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % ROLES.length), 2000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    ref.current?.animate(
      [
        { opacity: 0, transform: "translateY(0.35em)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 380, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" },
    );
  }, [i]);
  return (
    <span className={`relative inline-block ${className}`}>
      <span aria-hidden="true" className="invisible">{LONGEST}</span>
      <span ref={ref} className="absolute inset-x-0 top-0 text-left">{ROLES[i]}</span>
    </span>
  );
}
