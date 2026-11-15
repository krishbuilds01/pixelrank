export function unifiedScore(cf?: number | null, lc?: number | null, cc?: number | null): number {
  const parts: Array<[number, number]> = [];
  if (cf != null) parts.push([cf, 0.4]);
  if (lc != null) parts.push([lc, 0.35]);
  if (cc != null) parts.push([cc * 0.8, 0.25]);
  if (parts.length === 0) return 0;
  const w = parts.reduce((s, [, weight]) => s + weight, 0);
  return Math.round(parts.reduce((s, [v, weight]) => s + v * weight, 0) / w);
}
export function xpFor(score: number, solved?: number | null): number {
  return score * 4 + (solved ?? 0) * 10;
}
export function levelFor(xp: number): number {
  return Math.max(1, Math.floor(Math.sqrt(xp / 250)) + 1);
}
export function starsForCc(rating?: number | null): number {
  if (rating == null) return 0;
  if (rating < 1400) return 1; if (rating < 1600) return 2; if (rating < 1800) return 3;
  if (rating < 2000) return 4; if (rating < 2200) return 5; if (rating < 2500) return 6;
  return 7;
}
