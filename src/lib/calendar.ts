import { fetchCfContests } from "./platforms/codeforces";
export type CalEvent = { platform: string; name: string; start: string; url: string; dateKey: string };

export function istDateKey(iso: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}
function istInstant(y: number, m: number, d: number, hh: number, mm: number): string {
  return new Date(Date.UTC(y, m - 1, d, hh - 5, mm - 30)).toISOString();
}
const BIWEEKLY_ANCHOR = Date.UTC(2026, 10, 21); // a known Biweekly Saturday (IST)

export async function eventsForMonth(year: number, month: number): Promise<CalEvent[]> {
  const out: CalEvent[] = [];
  try {
    const cf = await fetchCfContests();
    for (const c of cf) { const key = istDateKey(c.start); if (key.startsWith(`${year}-${String(month).padStart(2, "0")}`)) out.push({ platform: "Codeforces", name: c.name, start: c.start, url: c.url, dateKey: key }); }
  } catch { /* CF down - calendar still shows the weekly schedule */ }
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  for (let d = 1; d <= days; d++) {
    const weekday = new Date(Date.UTC(year, month - 1, d, 12)).getUTCDay(); // noon UTC is 5:30 PM IST, same day
    const key = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    if (weekday === 0) out.push({ platform: "LeetCode", name: "Weekly Contest", start: istInstant(year, month, d, 8, 0), url: "https://leetcode.com/contest/", dateKey: key });
    if (weekday === 3) out.push({ platform: "CodeChef", name: "Starters", start: istInstant(year, month, d, 20, 0), url: "https://www.codechef.com/contests", dateKey: key });
    if (weekday === 6) {
      const diffDays = Math.round((Date.UTC(year, month - 1, d) - BIWEEKLY_ANCHOR) / 86400000);
      if (((diffDays % 14) + 14) % 14 === 0) out.push({ platform: "LeetCode", name: "Biweekly Contest", start: istInstant(year, month, d, 20, 0), url: "https://leetcode.com/contest/", dateKey: key });
    }
  }
  return out.sort((a, b) => a.start.localeCompare(b.start));
}
