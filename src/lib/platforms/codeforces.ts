export type CfData = { rating: number | null; maxRating: number | null; rank: string | null; solved: number | null };
export async function fetchCodeforces(handle: string): Promise<CfData> {
  const res = await fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`, { signal: AbortSignal.timeout(10000) });
  const json = await res.json().catch(() => null);
  if (!json) throw new Error("Codeforces is not responding right now");
  if (json.status !== "OK" || !json.result?.[0]) throw new Error("Codeforces handle not found");
  const u = json.result[0];
  let solved: number | null = null;
  try {
    const s = await fetch(`https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}&from=1&count=10000`, { signal: AbortSignal.timeout(10000) });
    const sj = await s.json();
    if (sj.status === "OK") {
      const seen = new Set<string>();
      for (const sub of sj.result) if (sub.verdict === "OK") seen.add(`${sub.problem.contestId}-${sub.problem.index}`);
      solved = seen.size;
    }
  } catch { solved = null; }
  return { rating: u.rating ?? null, maxRating: u.maxRating ?? null, rank: u.rank ?? null, solved };
}
export type CfContest = { name: string; start: string; url: string };
export async function fetchCfContests(): Promise<CfContest[]> {
  const res = await fetch("https://codeforces.com/api/contest.list?gym=false", { next: { revalidate: 3600 }, signal: AbortSignal.timeout(10000) });
  const json = await res.json();
  if (json.status !== "OK") throw new Error("contests unavailable");
  return json.result.filter((c: { phase: string }) => c.phase === "BEFORE").slice(0, 6)
    .map((c: { name: string; startTimeSeconds: number; id: number }) => ({ name: c.name, start: new Date(c.startTimeSeconds * 1000).toISOString(), url: `https://codeforces.com/contest/${c.id}` }));
}
