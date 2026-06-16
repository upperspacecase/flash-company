import { savePromptOverride, deletePromptOverride } from "@/lib/db";
import { PROMPT_KEYS, getAllPrompts } from "@/lib/prompts";

export const dynamic = "force-dynamic";

// Admin-only (gated by clerkMiddleware in proxy.ts). Edit the system prompts the
// generators run — saved overrides take effect on the next generation.
export async function GET() {
  return Response.json({ prompts: await getAllPrompts() });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { key?: string; system?: string; reset?: boolean } | null;
  const key = body?.key;
  if (!key || !PROMPT_KEYS.includes(key)) {
    return Response.json({ error: "Unknown prompt key" }, { status: 400 });
  }
  if (body?.reset) {
    await deletePromptOverride(key);
    return Response.json({ ok: true, reset: true });
  }
  if (typeof body?.system !== "string" || !body.system.trim()) {
    return Response.json({ error: "Empty prompt" }, { status: 400 });
  }
  await savePromptOverride(key, body.system);
  return Response.json({ ok: true });
}
