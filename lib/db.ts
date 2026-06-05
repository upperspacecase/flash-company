import { neon } from "@neondatabase/serverless";

// Lazy so a missing POSTGRES_URL only fails at request time, not at build/import.
// POSTGRES_URL is the pooled connection string injected by the Vercel + Neon integration.
export function getSql() {
  return neon(process.env.POSTGRES_URL!);
}

let schemaReady: Promise<void> | null = null;

// Self-provisioning: creates the tables on first use so the DB never needs a
// manual setup step. Memoized per process; resets on failure so it retries.
export function ensureSchema() {
  if (!schemaReady) {
    const sql = getSql();
    schemaReady = (async () => {
      await sql`CREATE TABLE IF NOT EXISTS signups (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
      await sql`CREATE TABLE IF NOT EXISTS visits (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
    })().catch((e) => {
      schemaReady = null;
      throw e;
    });
  }
  return schemaReady;
}
