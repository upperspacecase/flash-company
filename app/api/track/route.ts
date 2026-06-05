import { ensureSchema, getSql } from "@/lib/db";

export async function POST() {
  await ensureSchema();
  const sql = getSql();
  await sql`INSERT INTO visits DEFAULT VALUES`;
  return Response.json({ ok: true });
}
