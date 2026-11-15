import { starsForCc } from "../scoring";
export type CcData = { rating: number | null; stars: number };
async function fetchOnce(handle: string) {
  try {
    return await fetch(`https://www.codechef.com/users/${encodeURIComponent(handle)}`, { headers: { "User-Agent": "Mozilla/5.0 (PixelRank)" }, signal: AbortSignal.timeout(25000) });
  } catch { throw new Error("CodeChef took too long to respond, try syncing again"); }
}
export async function fetchCodechef(handle: string): Promise<CcData> {
  let res = await fetchOnce(handle).catch(() => null);
  if (!res) res = await fetchOnce(handle);
  if (res.status === 404) throw new Error("CodeChef handle not found");
  if (!res.ok) throw new Error("CodeChef is not responding right now");
  const html = await res.text();
  const m = html.match(/class="rating-number"[^>]*>\s*(\d{3,5})\s*</);
  if (!m) throw new Error("CodeChef handle not found");
  const rating = parseInt(m[1], 10);
  return { rating, stars: starsForCc(rating) };
}
