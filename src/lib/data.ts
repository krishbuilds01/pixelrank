export type Player = {
  rank: number;
  name: string;
  handle: string;
  college: string;
  branch: string;
  batch: number;
  level: number;
  xp: number;
  leetcode: number;
  codeforces: number;
  codechef: number;
  change: number;
};

export const players: Player[] = [
  { rank: 1, name: "Aarav Mehta", handle: "aarav_cp", college: "LPU", branch: "CSE", batch: 2027, level: 28, xp: 9420, leetcode: 2145, codeforces: 1682, codechef: 1890, change: 2 },
  { rank: 2, name: "Sana Iqbal", handle: "sana.codes", college: "LPU", branch: "CSE", batch: 2026, level: 27, xp: 9105, leetcode: 2080, codeforces: 1710, codechef: 1755, change: 0 },
  { rank: 3, name: "Rohan Verma", handle: "rohanv", college: "LPU", branch: "ECE", batch: 2027, level: 26, xp: 8760, leetcode: 1995, codeforces: 1590, codechef: 1820, change: 1 },
  { rank: 4, name: "Krishna Pandey", handle: "krishbuilds01", college: "LPU", branch: "CSE", batch: 2027, level: 24, xp: 8230, leetcode: 1875, codeforces: 1545, codechef: 1690, change: 3 },
  { rank: 5, name: "Meera Nair", handle: "meera_n", college: "LPU", branch: "CSE", batch: 2028, level: 23, xp: 7810, leetcode: 1810, codeforces: 1480, codechef: 1645, change: -1 },
  { rank: 6, name: "Dev Patel", handle: "devpatel", college: "LPU", branch: "IT", batch: 2026, level: 22, xp: 7345, leetcode: 1740, codeforces: 1425, codechef: 1580, change: -2 },
  { rank: 7, name: "Isha Singh", handle: "isha_s", college: "LPU", branch: "ECE", batch: 2027, level: 21, xp: 6980, leetcode: 1690, codeforces: 1390, codechef: 1510, change: 1 },
  { rank: 8, name: "Kabir Shah", handle: "kabirshah", college: "LPU", branch: "CSE", batch: 2028, level: 20, xp: 6520, leetcode: 1625, codeforces: 1310, codechef: 1460, change: 0 },
];

export function totalScore(p: Player) {
  return Math.round((p.leetcode + p.codeforces + p.codechef) / 3);
}

export const contests = [
  { platform: "Codeforces", name: "Round #2140 (Div. 2)", date: "Sun, Nov 16", time: "8:35 PM IST", boss: true },
  { platform: "LeetCode", name: "Weekly Contest 476", date: "Sun, Nov 16", time: "8:00 AM IST", boss: false },
  { platform: "CodeChef", name: "Starters 210", date: "Wed, Nov 19", time: "8:00 PM IST", boss: false },
];

export const quests = [
  { title: "Graphs week", detail: "5 problems - BFS, DFS, shortest path", xp: 300, done: 3, total: 5 },
  { title: "DP basics", detail: "4 problems - knapsack patterns", xp: 400, done: 1, total: 4 },
  { title: "Speed run", detail: "2 easy problems under 30 min", xp: 150, done: 2, total: 2 },
];
