import { saveFeedback } from "@/lib/db";

// Public: anyone in the workspace can send feedback from the in-app widget.
// (Not under the protected matchers in proxy.ts — submission needs no login.)
const KINDS = ["idea", "request", "bug", "feedback"] as const;

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    kind?: string;
    message?: string;
    screen?: string;
    path?: string;
    token?: string;
    memberId?: string;
    image?: string;
  } | null;

  const kind = body?.kind;
  if (!kind || !(KINDS as readonly string[]).includes(kind)) {
    return Response.json({ error: "Invalid type" }, { status: 400 });
  }
  const message = typeof body?.message === "string" ? body.message.trim() : "";
  if (!message) return Response.json({ error: "Empty message" }, { status: 400 });
  if (message.length > 5000) return Response.json({ error: "Message too long" }, { status: 400 });

  const image = typeof body?.image === "string" ? body.image : null;
  if (image && (!image.startsWith("data:image/") || image.length > 3_000_000)) {
    return Response.json({ error: "Invalid image" }, { status: 400 });
  }

  await saveFeedback({
    kind,
    message,
    screen: typeof body?.screen === "string" ? body.screen.slice(0, 120) : null,
    path: typeof body?.path === "string" ? body.path.slice(0, 200) : null,
    teamToken: typeof body?.token === "string" ? body.token : null,
    memberId: typeof body?.memberId === "string" ? body.memberId : null,
    image,
  });
  return Response.json({ ok: true });
}
