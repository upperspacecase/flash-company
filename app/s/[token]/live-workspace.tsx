"use client";

import { DemoWorkspace, type LiveCtx } from "@/app/demo/workspace";
import type { SynthesisData } from "@/app/demo/data";
import { acceptInvite, runSynthesis, saveIntake } from "../actions";

export type LiveProps = {
  token: string;
  plan: "free" | "full";
  meId: string;
  accepted: boolean;
  initialAnswers: Record<string, unknown>;
  teamIntakeComplete: boolean;
  status: { id: string; name: string | null; accepted: boolean; intakeComplete: boolean }[];
  synthesis: SynthesisData | null;
};

export function LiveWorkspace(props: LiveProps) {
  const live: LiveCtx = {
    token: props.token,
    meId: props.meId,
    accepted: props.accepted,
    initialAnswers: props.initialAnswers,
    teamIntakeComplete: props.teamIntakeComplete,
    status: props.status,
    synthesis: props.synthesis,
    onAccept: async () => { await acceptInvite(); },
    onSaveIntake: async (answers, complete) => { await saveIntake(answers, complete); },
    onRunSynthesis: async () => runSynthesis(),
  };
  return <DemoWorkspace plan={props.plan} live={live} />;
}
