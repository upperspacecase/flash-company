import Anthropic from "@anthropic-ai/sdk";
import {
  INTAKE,
  SKILLS,
  type IntakeField,
  type SynthesisData,
} from "@/app/demo/data";

// Lazy so a missing ANTHROPIC_API_KEY only fails when synthesis actually runs,
// not at build/import. The SDK reads ANTHROPIC_API_KEY from the environment.
function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set — cannot run synthesis.");
  }
  return new Anthropic();
}

export type IntakeRecord = { memberId: string; answers: Record<string, unknown> };

const ICONS = ["group", "alert", "minus", "sparkle", "chart", "heart", "target", "bolt", "link", "scale", "star", "thumb"] as const;

// JSON schema for structured output. Members are referenced by short stable keys
// (m0, m1, ...) rather than the long UUIDs, then mapped back to real ids below.
const SYNTH_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    convergence: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          icon: { type: "string", enum: [...ICONS] },
          kind: { type: "string" },
          tone: { type: "string", enum: ["good", "warn"] },
          text: { type: "string" },
        },
        required: ["icon", "kind", "tone", "text"],
      },
    },
    skillEnergy: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          memberKey: { type: "string" },
          scores: { type: "array", items: { type: "integer" } },
        },
        required: ["memberKey", "scores"],
      },
    },
    network: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          kind: { type: "string", enum: ["industry", "location"] },
          memberKeys: { type: "array", items: { type: "string" } },
          opportunity: { type: "string" },
        },
        required: ["name", "kind", "memberKeys", "opportunity"],
      },
    },
    roles: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          memberKey: { type: "string" },
          role: { type: "string" },
          tasks: { type: "string" },
        },
        required: ["memberKey", "role", "tasks"],
      },
    },
    problems: { type: "array", items: { type: "string" } },
    obsessions: { type: "array", items: { type: "string" } },
    markets: { type: "array", items: { type: "string" } },
  },
  required: ["convergence", "skillEnergy", "network", "roles", "problems", "obsessions", "markets"],
} as const;

type RawSynth = {
  convergence: { icon: string; kind: string; tone: string; text: string }[];
  skillEnergy: { memberKey: string; scores: number[] }[];
  network: { name: string; kind: string; memberKeys: string[]; opportunity: string }[];
  roles: { memberKey: string; role: string; tasks: string }[];
  problems: string[];
  obsessions: string[];
  markets: string[];
};

function formatAnswer(field: IntakeField, v: unknown): string {
  switch (field.kind) {
    case "short":
    case "long":
    case "location":
      return typeof v === "string" ? v : "";
    case "slider":
      return `${typeof v === "number" ? v : field.min} ${field.unit ?? ""}`.trim();
    case "multiSelect": {
      const m = v as { sel?: string[]; other?: string } | undefined;
      if (!m?.sel) return "";
      const sel = m.sel.filter((x) => x !== "Other");
      if (m.sel.includes("Other") && m.other) sel.push(m.other);
      return sel.join(", ");
    }
    case "ranked": {
      const r = v as { ranked?: string[]; note?: string } | undefined;
      if (!r) return "";
      return [r.ranked?.join(" > "), r.note].filter(Boolean).join(" — ");
    }
  }
  return "";
}

function renderIntake(answers: Record<string, unknown>): string {
  const lines: string[] = [];
  for (const section of INTAKE) {
    lines.push(`## ${section.title}`);
    for (const q of section.questions) {
      const a = formatAnswer(q.field, answers[q.id]);
      if (a) lines.push(`- ${q.q}\n  ${a}`);
    }
  }
  return lines.join("\n");
}

const SYSTEM = `You are Flash, an agent that synthesises a small founding team (2-3 people) into the raw material for a venture. You have just read each member's private intake. Your job is to find what's true ABOUT THE TEAM TOGETHER — the overlaps, tensions, and complementary strengths no single member could see — and turn it into a structured synthesis the team will vote on.

Be specific and grounded in what they actually wrote. No generic startup platitudes. Name real things from their answers. The convergence signals are the most important output: surface genuine overlaps (the same theme appearing independently across members), real tensions, gaps, and hidden complementarity.`;

const clampScore = (n: number) => Math.max(0, Math.min(5, Math.round(Number.isFinite(n) ? n : 3)));

/**
 * Generate the Synthesis bundle from the team's completed intakes via Claude.
 * Returns the same shape the Synthesis UI renders, keyed by real member ids.
 */
export async function synthesizeTeam(intakes: IntakeRecord[]): Promise<SynthesisData> {
  const client = getClient();

  // Short keys for the model; map back to real ids afterwards.
  const labelled = intakes.map((rec, i) => {
    const name = (rec.answers?.["name"] as string) || `Member ${i + 1}`;
    return { key: `m${i}`, id: rec.memberId, name, text: renderIntake(rec.answers ?? {}) };
  });
  const keyToId = new Map(labelled.map((m) => [m.key, m.id]));
  const idSet = new Set(intakes.map((r) => r.memberId));

  const userContent = [
    `The team has ${labelled.length} members. Here is each member's intake.`,
    ``,
    ...labelled.map((m) => `### ${m.name} (memberKey: ${m.key})\n${m.text}`),
    ``,
    `The eight skills, IN THIS EXACT ORDER, for the skillEnergy "scores" arrays (one integer 0-5 per skill, where 5 = strongly energised/expert, 0 = drains them): ${SKILLS.join(", ")}.`,
    ``,
    `Produce the synthesis:`,
    `- convergence: 4-6 signals (overlaps, tensions, gaps, hidden complementarity, market signal). Pick the icon that fits (group=overlap, alert=tension, minus=gap, sparkle=complementarity, chart=market signal).`,
    `- skillEnergy: one entry per member (use their memberKey) with exactly ${SKILLS.length} integer scores in the skills order above.`,
    `- network: industries and locations the team can reach, each tagged with the memberKeys it belongs to and the concrete opportunity it unlocks.`,
    `- roles: a proposed role + key tasks for each member (use their memberKey).`,
    `- problems: 4-6 lived problems the team keeps noticing (short, punchy).`,
    `- obsessions: 3-5 obsessions/moonshots that drive them.`,
    `- markets: 4-6 candidate target markets.`,
  ].join("\n");

  const body = {
    model: "claude-opus-4-8",
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    output_config: {
      effort: "high",
      format: { type: "json_schema", schema: SYNTH_SCHEMA },
    },
    system: SYSTEM,
    messages: [{ role: "user", content: userContent }],
  };

  // output_config / adaptive thinking may be ahead of the installed SDK types;
  // cast the request and read text from the returned content blocks.
  const message = (await client.messages.create(body as never)) as {
    content: { type: string; text?: string }[];
  };
  const raw = message.content
    .filter((b) => b.type === "text" && b.text)
    .map((b) => b.text as string)
    .join("");
  const parsed = JSON.parse(raw) as RawSynth;

  // Map short keys back to real member ids; clamp/normalise everything.
  const skillEnergy: Record<string, number[]> = {};
  for (const e of parsed.skillEnergy ?? []) {
    const id = keyToId.get(e.memberKey);
    if (!id) continue;
    const scores = (e.scores ?? []).slice(0, SKILLS.length).map(clampScore);
    while (scores.length < SKILLS.length) scores.push(3);
    skillEnergy[id] = scores;
  }
  // Ensure every member has a row (fallback to neutral) so the radar renders.
  for (const id of idSet) if (!skillEnergy[id]) skillEnergy[id] = SKILLS.map(() => 3);

  const network = (parsed.network ?? []).map((n) => ({
    name: n.name,
    kind: n.kind === "location" ? ("location" as const) : ("industry" as const),
    members: (n.memberKeys ?? []).map((k) => keyToId.get(k)).filter((x): x is string => !!x),
    opportunity: n.opportunity,
  }));

  const roles = (parsed.roles ?? [])
    .map((r) => ({ memberId: keyToId.get(r.memberKey) ?? "", role: r.role, tasks: r.tasks }))
    .filter((r) => r.memberId);

  const toVotable = (arr: string[], prefix: string) =>
    (arr ?? []).filter((t) => t && t.trim()).map((text, i) => ({ id: `${prefix}${i}`, text, votes: 0 }));

  const convergence = (parsed.convergence ?? []).map((s) => ({
    icon: (ICONS as readonly string[]).includes(s.icon) ? (s.icon as SynthesisData["convergence"][number]["icon"]) : "sparkle",
    kind: s.kind,
    tone: s.tone === "warn" ? ("warn" as const) : ("good" as const),
    text: s.text,
  }));

  return {
    convergence,
    skillEnergy,
    network,
    roles,
    problems: toVotable(parsed.problems, "p"),
    obsessions: toVotable(parsed.obsessions, "o"),
    markets: toVotable(parsed.markets, "k"),
  };
}
