import { neon } from "@neondatabase/serverless";

// Lazy so a missing POSTGRES_URL only fails at request time, not at build/import.
// POSTGRES_URL is the pooled connection string injected by the Vercel + Neon integration.
export function getSql() {
  return neon(process.env.POSTGRES_URL!);
}
