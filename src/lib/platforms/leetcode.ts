const GQL = "https://leetcode.com/graphql";
async function gql(query: string, variables: Record<string, string>) {
  const res = await fetch(GQL, { method: "POST", headers: { "Content-Type": "application/json", Referer: "https://leetcode.com" }, body: JSON.stringify({ query, variables }), signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error("LeetCode is not responding right now");
  return res.json();
}
export type LcData = { rating: number | null; globalRank: number | null; solved: number | null; weakTopics: string[] };
export async function fetchLeetcode(username: string): Promise<LcData> {
  const json = await gql(`query($username: String!) {
    matchedUser(username: $username) { username submitStats { acSubmissionNum { difficulty count } } }
    userContestRanking(username: $username) { rating globalRanking }
  }`, { username });
  const user = json?.data?.matchedUser;
  if (!user) throw new Error("LeetCode handle not found");
  const solved = user.submitStats?.acSubmissionNum?.find((d: { difficulty: string }) => d.difficulty === "All")?.count ?? null;
  let weakTopics: string[] = [];
  try {
    const tags = await gql(`query($username: String!) { matchedUser(username: $username) { tagProblemCounts { fundamental { tagName problemsSolved } intermediate { tagName problemsSolved } advanced { tagName problemsSolved } } } }`, { username });
    const all = [...(tags?.data?.matchedUser?.tagProblemCounts?.fundamental ?? []), ...(tags?.data?.matchedUser?.tagProblemCounts?.intermediate ?? []), ...(tags?.data?.matchedUser?.tagProblemCounts?.advanced ?? [])];
    weakTopics = [...all].sort((a, b) => a.problemsSolved - b.problemsSolved).slice(0, 3).map((t: { tagName: string }) => t.tagName);
  } catch { weakTopics = []; }
  const r = json?.data?.userContestRanking;
  return { rating: r?.rating ? Math.round(r.rating) : null, globalRank: r?.globalRanking ?? null, solved, weakTopics };
}
