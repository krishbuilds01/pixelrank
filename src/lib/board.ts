import db from "./db";
export type BoardRow = { name: string; college: string; country: string; branch: string; batch: number | null; level: number; xp: number; score: number; cf: number | null; lc: number | null; cc: number | null };
export function boardRows(): BoardRow[] {
  return db.prepare(`SELECT u.name, u.college, u.country, u.branch, u.batch, p.level, p.xp, p.score, p.cf_rating AS cf, p.lc_rating AS lc, p.cc_rating AS cc
    FROM users u JOIN profiles p ON p.user_id = u.id WHERE u.is_public = 1 AND p.score > 0 ORDER BY p.score DESC, p.xp DESC LIMIT 500`).all() as unknown as BoardRow[];
}
export type CollegeRow = { college: string; players: number; avgScore: number; topScore: number };
export function collegeRows(): CollegeRow[] {
  return db.prepare(`SELECT u.college AS college, COUNT(*) AS players, ROUND(AVG(p.score)) AS avgScore, MAX(p.score) AS topScore
    FROM users u JOIN profiles p ON p.user_id = u.id WHERE u.is_public = 1 AND u.college != '' AND p.score > 0 GROUP BY u.college ORDER BY avgScore DESC`).all() as unknown as CollegeRow[];
}
