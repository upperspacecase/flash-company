import { Resend } from "resend";

// Email is optional: without RESEND_API_KEY everything no-ops, so the live flow
// keeps working. Mirrors the Stripe/Anthropic "configured?" pattern.
export function emailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

const FROM = process.env.RESEND_FROM_EMAIL || "Flash Company <hello@flashco.org>";
const BASE = "https://flashco.org";

// Best-effort: a missing key, bad address, or send failure never blocks the
// flow it's notifying about.
export async function sendEmail(to: string | null | undefined, subject: string, html: string): Promise<void> {
  if (!process.env.RESEND_API_KEY || !to) return;
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch {
    /* notifications are best-effort */
  }
}

// A member's personal resume link — drops them back into the workspace as
// themselves on any device.
export function resumeUrl(token: string, memberId: string): string {
  return `${BASE}/s/${token}/r/${memberId}`;
}

function shell(body: string, cta: { href: string; label: string }): string {
  return `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#1e293b">
    <p style="font-weight:800;font-size:18px;margin:0 0 16px">⚡ Flash Company</p>
    ${body}
    <p style="margin:24px 0 0"><a href="${cta.href}" style="display:inline-block;background:#5b8266;color:#fff;text-decoration:none;font-weight:700;padding:12px 20px;border-radius:10px">${cta.label}</a></p>
  </div>`;
}

export function synthesisReadyEmail(token: string, memberId: string): { subject: string; html: string } {
  return {
    subject: "Your Flash synthesis is ready",
    html: shell(
      `<p>Your team's input is all in, and Flash has mapped the three of you — your overlaps, tensions, and the problems and markets you keep circling.</p>
       <p>Jump back in to confirm your synthesis and move on to the opportunities only your team can build.</p>`,
      { href: resumeUrl(token, memberId), label: "See your synthesis" },
    ),
  };
}

// Sent to both members the moment the first other person accepts — the team has
// formed, so invite each of them to start their input.
export function invitedToStartInputEmail(token: string, memberId: string): { subject: string; html: string } {
  return {
    subject: "Your Flash team is forming — start your input",
    html: shell(
      `<p>Someone just accepted your invite — your Flash is live.</p>
       <p>Add your input now. It takes about 90 minutes, and synthesis runs the moment everyone's input is in.</p>`,
      { href: resumeUrl(token, memberId), label: "Start your input" },
    ),
  };
}

export function teammateFinishedEmail(token: string, memberId: string, name: string, done: number, total: number): { subject: string; html: string } {
  const left = total - done;
  return {
    subject: `${name} finished their Flash input`,
    html: shell(
      `<p><strong>${name}</strong> just finished their input — ${done} of ${total} of you are in${left > 0 ? `, ${left} to go` : ""}.</p>
       <p>Synthesis runs the moment everyone's input is in.</p>`,
      { href: resumeUrl(token, memberId), label: "Add your input" },
    ),
  };
}
