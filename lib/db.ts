import { neon } from "@neondatabase/serverless";
import { randomInt, randomUUID } from "crypto";

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
      // --- Live sprint tables (real sign-up flow at /s/[token]) ---
      await sql`CREATE TABLE IF NOT EXISTS teams (
        id TEXT PRIMARY KEY,
        token TEXT NOT NULL UNIQUE,
        plan TEXT NOT NULL DEFAULT 'full',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
      await sql`CREATE TABLE IF NOT EXISTS members (
        id TEXT PRIMARY KEY,
        team_id TEXT NOT NULL,
        name TEXT,
        role TEXT,
        brings TEXT,
        accepted BOOLEAN NOT NULL DEFAULT false,
        intake_complete BOOLEAN NOT NULL DEFAULT false,
        is_host BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
      await sql`CREATE TABLE IF NOT EXISTS intakes (
        member_id TEXT PRIMARY KEY,
        team_id TEXT NOT NULL,
        answers JSONB NOT NULL,
        complete BOOLEAN NOT NULL DEFAULT false,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
      await sql`CREATE TABLE IF NOT EXISTS synthesis (
        team_id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
      await sql`CREATE TABLE IF NOT EXISTS opportunity (
        team_id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
      await sql`CREATE TABLE IF NOT EXISTS ventures (
        team_id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
      // The team's editable working draft of the chosen venture (persisted edits).
      await sql`CREATE TABLE IF NOT EXISTS venture_drafts (
        team_id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
      // Accumulating state for the staged venture build (research/core/plan).
      await sql`CREATE TABLE IF NOT EXISTS venture_build (
        team_id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
      // Emails captured on a published venture landing page.
      await sql`CREATE TABLE IF NOT EXISTS venture_signups (
        id BIGSERIAL PRIMARY KEY,
        team_id TEXT NOT NULL,
        email TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
      // Stripe payment fields on members (charged on accept, when keys are set).
      await sql`ALTER TABLE members ADD COLUMN IF NOT EXISTS payment_session_id TEXT`;
      await sql`ALTER TABLE members ADD COLUMN IF NOT EXISTS payment_status TEXT`;
      // Email for notifications (captured in intake; optional).
      await sql`ALTER TABLE members ADD COLUMN IF NOT EXISTS email TEXT`;
    })().catch((e) => {
      schemaReady = null;
      throw e;
    });
  }
  return schemaReady;
}

/* ---------------------------------------------------------------- live data layer
   All DB access for the real sign-up flow goes through these helpers (kept in the
   data layer, not in components/actions). ensureSchema() is awaited up front. */

export type TeamRow = { id: string; token: string; plan: string; created_at: string };
export type MemberRow = {
  id: string;
  team_id: string;
  name: string | null;
  role: string | null;
  brings: string | null;
  accepted: boolean;
  intake_complete: boolean;
  is_host: boolean;
  email: string | null;
};

// Short, shareable invite token: 6 lowercase letters + digits (~2.2B combos).
const TOKEN_CHARS = "0123456789abcdefghijklmnopqrstuvwxyz";
function makeToken(len = 6): string {
  let out = "";
  for (let i = 0; i < len; i++) out += TOKEN_CHARS[randomInt(TOKEN_CHARS.length)];
  return out;
}

export async function createTeamRow(plan: string): Promise<TeamRow> {
  await ensureSchema();
  const sql = getSql();
  const id = randomUUID();
  // Retry on the rare unique-token collision so starting a Flash never 500s.
  let lastErr: unknown;
  for (let attempt = 0; attempt < 5; attempt++) {
    const token = makeToken();
    try {
      const rows = await sql`INSERT INTO teams (id, token, plan) VALUES (${id}, ${token}, ${plan}) RETURNING created_at`;
      return { id, token, plan, created_at: String((rows[0] as { created_at: string }).created_at) };
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

export async function getTeamByToken(token: string): Promise<TeamRow | null> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`SELECT id, token, plan, created_at FROM teams WHERE token = ${token}`;
  if (!rows[0]) return null;
  const r = rows[0] as TeamRow;
  return { id: r.id, token: r.token, plan: r.plan, created_at: String(r.created_at) };
}

export async function createMemberRow(teamId: string, isHost: boolean): Promise<MemberRow> {
  await ensureSchema();
  const sql = getSql();
  const id = randomUUID();
  await sql`INSERT INTO members (id, team_id, is_host) VALUES (${id}, ${teamId}, ${isHost})`;
  return { id, team_id: teamId, name: null, role: null, brings: null, accepted: false, intake_complete: false, is_host: isHost, email: null };
}

export async function getTeamById(teamId: string): Promise<TeamRow | null> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`SELECT id, token, plan, created_at FROM teams WHERE id = ${teamId}`;
  if (!rows[0]) return null;
  const r = rows[0] as TeamRow;
  return { id: r.id, token: r.token, plan: r.plan, created_at: String(r.created_at) };
}

export async function getMemberRow(id: string): Promise<MemberRow | null> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`SELECT id, team_id, name, role, brings, accepted, intake_complete, is_host, email FROM members WHERE id = ${id}`;
  return (rows[0] as MemberRow) ?? null;
}

export async function getTeamMembers(teamId: string): Promise<MemberRow[]> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`SELECT id, team_id, name, role, brings, accepted, intake_complete, is_host, email FROM members WHERE team_id = ${teamId} ORDER BY created_at ASC`;
  return rows as MemberRow[];
}

export async function setMemberAccepted(memberId: string): Promise<void> {
  await ensureSchema();
  const sql = getSql();
  await sql`UPDATE members SET accepted = true WHERE id = ${memberId}`;
}

export async function upsertIntake(
  memberId: string,
  teamId: string,
  answers: unknown,
  complete: boolean,
  identity: { name?: string; role?: string; brings?: string; email?: string },
): Promise<void> {
  await ensureSchema();
  const sql = getSql();
  const json = JSON.stringify(answers ?? {});
  await sql`
    INSERT INTO intakes (member_id, team_id, answers, complete, updated_at)
    VALUES (${memberId}, ${teamId}, ${json}::jsonb, ${complete}, now())
    ON CONFLICT (member_id) DO UPDATE SET answers = EXCLUDED.answers, complete = EXCLUDED.complete, updated_at = now()`;
  await sql`UPDATE members
    SET intake_complete = ${complete},
        name = COALESCE(${identity.name ?? null}, name),
        role = COALESCE(${identity.role ?? null}, role),
        brings = COALESCE(${identity.brings ?? null}, brings),
        email = COALESCE(${identity.email ?? null}, email)
    WHERE id = ${memberId}`;
}

export async function getIntake(memberId: string): Promise<{ answers: unknown; complete: boolean } | null> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`SELECT answers, complete FROM intakes WHERE member_id = ${memberId}`;
  return (rows[0] as { answers: unknown; complete: boolean }) ?? null;
}

export async function getTeamIntakes(teamId: string): Promise<{ member_id: string; answers: unknown }[]> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`SELECT member_id, answers FROM intakes WHERE team_id = ${teamId} AND complete = true`;
  return rows as { member_id: string; answers: unknown }[];
}

export async function getSynthesis(teamId: string): Promise<unknown | null> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`SELECT data FROM synthesis WHERE team_id = ${teamId}`;
  return rows[0] ? (rows[0] as { data: unknown }).data : null;
}

export async function saveSynthesis(teamId: string, data: unknown): Promise<void> {
  await ensureSchema();
  const sql = getSql();
  const json = JSON.stringify(data);
  await sql`
    INSERT INTO synthesis (team_id, data, created_at)
    VALUES (${teamId}, ${json}::jsonb, now())
    ON CONFLICT (team_id) DO UPDATE SET data = EXCLUDED.data, created_at = now()`;
}

export async function getOpportunity(teamId: string): Promise<unknown | null> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`SELECT data FROM opportunity WHERE team_id = ${teamId}`;
  return rows[0] ? (rows[0] as { data: unknown }).data : null;
}

export async function saveOpportunity(teamId: string, data: unknown): Promise<void> {
  await ensureSchema();
  const sql = getSql();
  const json = JSON.stringify(data);
  await sql`
    INSERT INTO opportunity (team_id, data, created_at)
    VALUES (${teamId}, ${json}::jsonb, now())
    ON CONFLICT (team_id) DO UPDATE SET data = EXCLUDED.data, created_at = now()`;
}

export async function getVentures(teamId: string): Promise<unknown | null> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`SELECT data FROM ventures WHERE team_id = ${teamId}`;
  return rows[0] ? (rows[0] as { data: unknown }).data : null;
}

export async function saveVentures(teamId: string, data: unknown): Promise<void> {
  await ensureSchema();
  const sql = getSql();
  const json = JSON.stringify(data);
  await sql`
    INSERT INTO ventures (team_id, data, created_at)
    VALUES (${teamId}, ${json}::jsonb, now())
    ON CONFLICT (team_id) DO UPDATE SET data = EXCLUDED.data, created_at = now()`;
}

export async function getVentureDraft(teamId: string): Promise<unknown | null> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`SELECT data FROM venture_drafts WHERE team_id = ${teamId}`;
  return rows[0] ? (rows[0] as { data: unknown }).data : null;
}

export async function saveVentureDraft(teamId: string, data: unknown): Promise<void> {
  await ensureSchema();
  const sql = getSql();
  const json = JSON.stringify(data);
  await sql`
    INSERT INTO venture_drafts (team_id, data, updated_at)
    VALUES (${teamId}, ${json}::jsonb, now())
    ON CONFLICT (team_id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`;
}

export async function getVentureBuild(teamId: string): Promise<unknown | null> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`SELECT data FROM venture_build WHERE team_id = ${teamId}`;
  return rows[0] ? (rows[0] as { data: unknown }).data : null;
}

export async function saveVentureBuild(teamId: string, data: unknown): Promise<void> {
  await ensureSchema();
  const sql = getSql();
  const json = JSON.stringify(data);
  await sql`
    INSERT INTO venture_build (team_id, data, updated_at)
    VALUES (${teamId}, ${json}::jsonb, now())
    ON CONFLICT (team_id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`;
}

export async function saveVentureSignup(teamId: string, email: string): Promise<void> {
  await ensureSchema();
  const sql = getSql();
  await sql`INSERT INTO venture_signups (team_id, email, created_at) VALUES (${teamId}, ${email}, now())`;
}

export async function getVentureSignupCount(teamId: string): Promise<number> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`SELECT count(*)::int AS n FROM venture_signups WHERE team_id = ${teamId}`;
  return (rows[0] as { n: number } | undefined)?.n ?? 0;
}

// Clear the generated opportunity + venture so the demo can be re-seeded fresh
// (keeps synthesis). Used by /api/seed-demo?reset=1.
export async function resetVentureData(teamId: string): Promise<void> {
  await ensureSchema();
  const sql = getSql();
  await sql`DELETE FROM opportunity WHERE team_id = ${teamId}`;
  await sql`DELETE FROM ventures WHERE team_id = ${teamId}`;
  await sql`DELETE FROM venture_build WHERE team_id = ${teamId}`;
  await sql`DELETE FROM venture_drafts WHERE team_id = ${teamId}`;
}

export async function setMemberPayment(memberId: string, sessionId: string, status: string): Promise<void> {
  await ensureSchema();
  const sql = getSql();
  await sql`UPDATE members SET payment_session_id = ${sessionId}, payment_status = ${status} WHERE id = ${memberId}`;
}
