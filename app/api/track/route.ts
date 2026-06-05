import { getSql } from "@/lib/db";

export async function POST() {
  const sql = getSql();
  await sql`INSERT INTO visits DEFAULT VALUES`;
  return Response.json({ ok: true });
}
