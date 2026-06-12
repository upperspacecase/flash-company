// Aggregating per-member input into a team decision.
//
// Rankings (synthesis): Borda count — in a list of N items, an item a member
// ranks at position i (0-based) scores N-i. Sum across members; the highest
// total is the team's top priority. Ties keep the base order.
//
// Conviction (ventures): sum each venture's 1-10 scores across members; the
// highest total is the venture the team builds.

export function consensusOrder(baseIds: string[], rankings: string[][]): string[] {
  const score = new Map<string, number>(baseIds.map((id) => [id, 0]));
  const baseIndex = new Map(baseIds.map((id, i) => [id, i]));
  for (const ranking of rankings) {
    const n = ranking.length;
    ranking.forEach((id, i) => {
      if (score.has(id)) score.set(id, (score.get(id) ?? 0) + (n - i));
    });
  }
  return [...baseIds].sort((a, b) => {
    const d = (score.get(b) ?? 0) - (score.get(a) ?? 0);
    return d !== 0 ? d : (baseIndex.get(a) ?? 0) - (baseIndex.get(b) ?? 0);
  });
}

// Reorder votable items by the team consensus of members' rankings.
export function consensusItems<T extends { id: string }>(items: T[], rankings: string[][]): T[] {
  const order = consensusOrder(items.map((i) => i.id), rankings);
  const byId = new Map(items.map((i) => [i.id, i]));
  return order.map((id) => byId.get(id)).filter((x): x is T => !!x);
}

// Venture conviction: total each venture's scores across members; winner first.
export function ratingOrder(ventureIds: string[], ratings: Record<string, number>[]): { id: string; total: number }[] {
  return ventureIds
    .map((id) => ({ id, total: ratings.reduce((s, r) => s + (r[id] ?? 0), 0) }))
    .sort((a, b) => b.total - a.total || ventureIds.indexOf(a.id) - ventureIds.indexOf(b.id));
}
