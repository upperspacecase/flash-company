import { neon } from "@neondatabase/serverless";

const url = process.env.POSTGRES_URL;
if (!url) {
  console.error("POSTGRES_URL not set. Run: vercel env pull .env.local --environment=production");
  process.exit(1);
}

const sql = neon(url);

await sql`CREATE TABLE IF NOT EXISTS signups (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
)`;

await sql`CREATE TABLE IF NOT EXISTS visits (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
)`;

console.log("Tables ready: signups, visits");
