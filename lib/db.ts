import { neon } from "@neondatabase/serverless";

// Lazy so a missing DATABASE_URL only fails at request time, not at build/import.
export function getSql() {
  return neon(process.env.DATABASE_URL!);
}
