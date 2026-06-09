import Stripe from "stripe";

// Live payments are optional: until both keys are set the app falls back to a
// no-charge accept, so the live flow keeps working.
export function paymentConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY && !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
}

// Lazy so a missing key only fails when a checkout is actually created.
// Uses the SDK's pinned API version (no override) to avoid drift.
export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set — cannot take payment.");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}
