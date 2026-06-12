import { StartGate } from "./start-gate";

export const dynamic = "force-dynamic";
export const metadata = { title: "Start a Flash · Flash Company" };

// No interstitial — starting a Flash creates the team and drops you straight on
// the invite screen.
export default function StartPage() {
  return <StartGate />;
}
