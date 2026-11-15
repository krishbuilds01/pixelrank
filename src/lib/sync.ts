import db, { type ProfileRow } from "./db";
import { fetchCodeforces } from "./platforms/codeforces";
import { fetchLeetcode } from "./platforms/leetcode";
import { fetchCodechef } from "./platforms/codechef";
import { unifiedScore, xpFor, levelFor } from "./scoring";

export function getProfile(userId: string): ProfileRow | null {
  return (db.prepare("SELECT * FROM profiles WHERE user_id = ?").get(userId) as ProfileRow | undefined) ?? null;
}
export function ensureProfile(userId: string) {
  if (!getProfile(userId)) db.prepare("INSERT INTO profiles (user_id, updated_at) VALUES (?, ?)").run(userId, new Date().toISOString());
}

export async function syncUser(userId: string) {
  ensureProfile(userId);
  const p = getProfile(userId)!;
  const errors: string[] = [];
  let cf = p.cf_rating, cfMax = p.cf_max_rating, lc = p.lc_rating, lcSolved = p.lc_solved, cc = p.cc_rating, ccStars = p.cc_stars;
  let solvedTotal = lcSolved ?? 0;
  const jobs: Promise<void>[] = [];
  if (p.cf_handle) jobs.push((async () => { try { const d = await fetchCodeforces(p.cf_handle!); cf = d.rating; cfMax = d.maxRating; } catch (e) { errors.push(`Codeforces: ${e instanceof Error ? e.message : "sync failed"}`); } })());
  if (p.lc_handle) jobs.push((async () => { try { const d = await fetchLeetcode(p.lc_handle!); lc = d.rating; lcSolved = d.solved; solvedTotal = d.solved ?? solvedTotal; } catch (e) { errors.push(`LeetCode: ${e instanceof Error ? e.message : "sync failed"}`); } })());
  if (p.cc_handle) jobs.push((async () => { try { const d = await fetchCodechef(p.cc_handle!); cc = d.rating; ccStars = d.stars; } catch (e) { errors.push(`CodeChef: ${e instanceof Error ? e.message : "sync failed"}`); } })());
  await Promise.all(jobs);
  const hasAny = p.cf_handle || p.lc_handle || p.cc_handle;
  const score = unifiedScore(cf, lc, cc);
  const xp = xpFor(score, solvedTotal);
  const now = new Date().toISOString();
  const status = !hasAny ? "no-handles" : errors.length === 0 ? "ok" : (cf == null && lc == null && cc == null ? "failed" : "partial");
  db.prepare(`UPDATE profiles SET cf_rating=?, cf_max_rating=?, lc_rating=?, lc_solved=?, cc_rating=?, cc_stars=?, score=?, xp=?, level=?, sync_status=?, sync_error=?, last_synced_at=?, updated_at=? WHERE user_id=?`)
    .run(cf, cfMax, lc, lcSolved, cc, ccStars, score, xp, levelFor(xp), status, errors.join(" · ") || null, now, now, userId);
  return getProfile(userId);
}
