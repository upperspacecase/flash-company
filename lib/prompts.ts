import { LLM_STEPS } from "@/lib/llm-spec";
import { getPromptOverride, getPromptOverrides } from "@/lib/db";

// The code defaults, keyed by LLM step id. The dashboard can override any of
// these in the DB; the generators read the effective value at run time.
const DEFAULTS: Record<string, string> = Object.fromEntries(LLM_STEPS.map((s) => [s.id, s.system]));

export const PROMPT_KEYS = LLM_STEPS.map((s) => s.id);

// Effective system prompt for a step: the saved override if present, else the
// code default. Falls back to the default if the DB is unreachable so a prompt
// edit can never break generation.
export async function getPrompt(key: string): Promise<string> {
  const fallback = DEFAULTS[key] ?? "";
  try {
    const override = await getPromptOverride(key);
    return override && override.trim() ? override : fallback;
  } catch {
    return fallback;
  }
}

export type PromptView = {
  key: string;
  title: string;
  when: string;
  model: string;
  defaultSystem: string;
  system: string;
  overridden: boolean;
};

// Every step with its default, its effective prompt, and whether it's been
// overridden — for the dashboard editor.
export async function getAllPrompts(): Promise<PromptView[]> {
  let overrides: Record<string, string> = {};
  try {
    overrides = await getPromptOverrides();
  } catch {
    overrides = {};
  }
  return LLM_STEPS.map((s) => {
    const ov = overrides[s.id];
    const has = !!(ov && ov.trim());
    return { key: s.id, title: s.title, when: s.when, model: s.model, defaultSystem: s.system, system: has ? ov : s.system, overridden: has };
  });
}
