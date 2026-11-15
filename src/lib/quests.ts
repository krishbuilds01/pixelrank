export type Quest = { title: string; detail: string; xp: number };
const byTopic: Record<string, Quest> = {
  "dynamic programming": { title: "DP week", detail: "4 problems - start with 1D DP, then knapsack patterns", xp: 400 },
  "graph": { title: "Graphs week", detail: "5 problems - BFS, DFS, shortest path", xp: 300 },
  "binary search": { title: "Binary search week", detail: "4 problems - answer-space search included", xp: 250 },
  "tree": { title: "Trees week", detail: "4 problems - traversals and LCA basics", xp: 300 },
  "greedy": { title: "Greedy week", detail: "4 problems - sorting based greedy first", xp: 250 },
  "hash table": { title: "Hashing week", detail: "4 problems - frequency maps and prefix sums", xp: 200 },
};
export function questsFor(weakTopics: string[], hasHandles: boolean): Quest[] {
  if (!hasHandles) return [
    { title: "First quest", detail: "Link your handles and sync once to unlock your plan", xp: 100 },
    { title: "Warm up", detail: "2 easy problems on any platform", xp: 150 },
  ];
  const picked: Quest[] = [];
  for (const t of weakTopics) {
    const q = byTopic[t.toLowerCase()] ?? { title: `${t} week`, detail: `4 problems focused on ${t.toLowerCase()} - your least practised topic on LeetCode`, xp: 300 };
    if (!picked.some((x) => x.title === q.title)) picked.push(q);
  }
  picked.push({ title: "Speed run", detail: "2 easy problems under 30 minutes", xp: 150 });
  picked.push({ title: "Boss prep", detail: "1 past contest, virtual participation", xp: 350 });
  return picked.slice(0, 3);
}
