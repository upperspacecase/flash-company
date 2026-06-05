import { ensureSchema, getSql } from "@/lib/db";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (typeof email !== "string" || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }
  await ensureSchema();
  const sql = getSql();
  await sql`INSERT INTO signups (email) VALUES (${email.toLowerCase().trim()}) ON CONFLICT (email) DO NOTHING`;
  return Response.json({ ok: true });
}
