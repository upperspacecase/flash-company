"use client";

import { DemoWorkspace, type LiveCtx } from "@/app/demo/workspace";
import type { OpportunityData, SynthesisData, Venture } from "@/app/demo/data";
import { acceptInvite, confirmSynthesis, createAcceptCheckout, confirmAccept, runOpportunity, runSynthesis, runVentures, saveIntake } from "../actions";

export type LiveProps = {
  token: string;
  plan: "free" | "full";
  meId: string;
  accepted: boolean;
  initialAnswers: Record<string, unknown>;
  teamIntakeComplete: boolean;
  status: { id: string; name: string | null; accepted: boolean; intakeComplete: boolean }[];
  synthesis: SynthesisData | null;
  opportunity: OpportunityData | null;
  ventures: Venture[] | null;
  paymentEnabled: boolean;
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
    opportunity: props.opportunity,
    ventures: props.ventures,
    paymentEnabled: props.paymentEnabled,
    payment: {
      onCreateCheckout: async () => createAcceptCheckout(),
      onConfirmPayment: async (sessionId) => confirmAccept(sessionId),
    },
    onAccept: async () => { await acceptInvite(); },
    onSaveIntake: async (answers, complete) => { await saveIntake(answers, complete); },
    onRunSynthesis: async () => runSynthesis(),
    onConfirmSynthesis: async (data) => { await confirmSynthesis(data); },
    onRunOpportunity: async () => runOpportunity(),
    onRunVentures: async () => runVentures(),
  };
  return <DemoWorkspace plan={props.plan} live={live} />;
}
