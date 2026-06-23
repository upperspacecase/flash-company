import { UserButton } from "@clerk/nextjs";
import { ensureSchema, getSql, getRecentFeedback, type FeedbackRow } from "@/lib/db";
import { getAllPrompts } from "@/lib/prompts";
import { DashboardTabs } from "./tabs";

export const dynamic = "force-dynamic";

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-white/40">{label}</p>
      <p className="mt-2 text-3xl font-extrabold tabular-nums text-white">{value}</p>
      {sub && <p className="mt-1 text-xs text-white/40">{sub}</p>}
    </div>
  );
}

export default async function Dashboard() {
  let dbError = false;
  let signups = 0;
  let visits = 0;
  let signups30 = 0;
  let recent: { email: string; created_at: string }[] = [];
  let feedback: FeedbackRow[] = [];
  try {
    await ensureSchema();
    const sql = getSql();
    const [s, v, s30, r, fb] = await Promise.all([
      sql`SELECT count(*)::int AS count FROM signups`,
      sql`SELECT count(*)::int AS count FROM visits`,
      sql`SELECT count(*)::int AS count FROM signups WHERE created_at > now() - interval '30 days'`,
      sql`SELECT email, created_at FROM signups ORDER BY created_at DESC LIMIT 12`,
      getRecentFeedback(50),
    ]);
    signups = s[0].count;
    visits = v[0].count;
    signups30 = s30[0].count;
    recent = r as { email: string; created_at: string }[];
    feedback = fb;
  } catch {
    dbError = true;
  }
  const rate = visits > 0 ? ((signups / visits) * 100).toFixed(1) : "0.0";
  const prompts = await getAllPrompts();

  return (
    <main className="relative min-h-screen bg-black text-white">
      <div className="pointer-events-none fixed inset-0 z-0 bg-grid" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-10 sm:px-10">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Dashboard</h1>
            <p className="mt-1 text-sm text-white/50">Flash Company — signups and conversions.</p>
          </div>
          <UserButton />
        </header>

        {dbError && (
          <div className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            Couldn&rsquo;t reach the database. Set <code className="font-mono">POSTGRES_URL</code> and create the tables (run <code className="font-mono">db/schema.sql</code>).
          </div>
        )}

        <DashboardTabs
          prompts={prompts}
          feedback={feedback}
          analytics={
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Stat label="Visitors" value={visits.toLocaleString()} sub="sessions tracked" />
                <Stat label="Signups" value={signups.toLocaleString()} sub={`${signups30} in the last 30 days`} />
                <Stat label="Signup rate" value={`${rate}%`} sub="signups ÷ visitors" />
                <Stat label="Customers" value="—" sub="when payments go live" />
              </div>

              <section className="mt-6 rounded-xl border border-white/10 bg-white/5">
                <div className="border-b border-white/10 px-5 py-4">
                  <h2 className="text-sm font-semibold">Recent signups</h2>
                </div>
                {recent.length === 0 ? (
                  <p className="px-5 py-8 text-sm text-white/40">No signups yet.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wide text-white/40">
                        <th className="px-5 py-3 font-medium">Email</th>
                        <th className="px-5 py-3 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recent.map((r) => (
                        <tr key={r.email} className="border-t border-white/5">
                          <td className="px-5 py-3 text-white/80">{r.email}</td>
                          <td className="px-5 py-3 text-white/50">{new Date(r.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </section>
            </>
          }
        />
      </div>
    </main>
  );
}
