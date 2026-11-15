import { fetchCfContests } from "./platforms/codeforces";
export type Contest = { platform: string; name: string; start: string; url: string; boss: boolean };
function nextWeekday(day: number, hourIST: number, minuteIST: number): Date {
  const now = new Date();
  const ist = new Date(now.getTime() + 5.5 * 3600 * 1000);
  const d = new Date(Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate(), hourIST - 5, minuteIST - 30, 0));
  let add = (day - ist.getUTCDay() + 7) % 7;
  if (add === 0 && d.getTime() <= now.getTime()) add = 7;
  d.setUTCDate(d.getUTCDate() + add);
  return d;
}
export async function getContests(): Promise<Contest[]> {
  const out: Contest[] = [];
  try {
    const cf = await fetchCfContests();
    for (const c of cf) out.push({ platform: "Codeforces", name: c.name, start: c.start, url: c.url, boss: true });
  } catch { /* CF down - others still show */ }
  out.push({ platform: "LeetCode", name: "Weekly Contest (recurring)", start: nextWeekday(0, 8, 0).toISOString(), url: "https://leetcode.com/contest/", boss: false });
  out.push({ platform: "LeetCode", name: "Biweekly Contest (recurring)", start: nextWeekday(6, 20, 0).toISOString(), url: "https://leetcode.com/contest/", boss: false });
  out.push({ platform: "CodeChef", name: "Starters (recurring, weekly)", start: nextWeekday(3, 20, 0).toISOString(), url: "https://www.codechef.com/contests", boss: false });
  return out.sort((a, b) => a.start.localeCompare(b.start)).slice(0, 8);
}
