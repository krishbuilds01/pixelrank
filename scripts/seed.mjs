// Seeds demo players so the boards are not empty. Local: SQLite file. With DATABASE_URL set: Postgres (Supabase).
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";

const players = [
  ["Aarav Mehta", "aarav", "LPU", "CSE", 2027, 2145, 1682, 2362],
  ["Sana Iqbal", "sana", "LPU", "CSE", 2026, 2080, 1710, 2193],
  ["Rohan Verma", "rohan", "LPU", "ECE", 2027, 1995, 1590, 2275],
  ["Meera Nair", "meera", "VIT", "CSE", 2028, 1810, 1480, 2056],
  ["Kabir Singh", "kabir", "SRM", "CSE", 2027, 1725, 1520, 1980],
  ["Isha Rao", "isha", "LPU", "CSE", 2028, 1650, 1410, 1875],
];
const scoreOf = (lc, cf, cc) => Math.round(cf * 0.4 + lc * 0.35 + cc * 0.8 * 0.25);
const xpOf = (score, solved) => score * 4 + solved * 10;
const levelFor = (xp) => Math.floor(Math.sqrt(xp / 250)) + 1;
const stars = (r) => (r >= 2500 ? 7 : r >= 2200 ? 6 : r >= 2000 ? 5 : r >= 1800 ? 4 : r >= 1600 ? 3 : r >= 1400 ? 2 : 1);
const hash = bcrypt.hashSync("demo1234", 10);
const now = new Date().toISOString();

const usePg = Boolean(process.env.DATABASE_URL);
let query;
if (usePg) {
  const { default: pg } = await import("pg");
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  query = async (sql, params) => { let i = 0; const r = await pool.query(sql.replace(/\?/g, () => `$${++i}`), params); return r.rows; };
  process.on("exit", () => pool.end());
} else {
  const { DatabaseSync } = await import("node:sqlite");
  const fs = await import("node:fs");
  const path = await import("node:path");
  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const db = new DatabaseSync(path.join(dir, "pixelrank.db"));
  query = async (sql, params) => db.prepare(sql).all(...params);
  var runSql = (sql, params) => db.prepare(sql).run(...params);
  query.run = runSql;
}
const run = query.run ?? (async (sql, params) => { await query(sql, params); });

for (const [name, handle, college, branch, batch, lc, cf, cc] of players) {
  const email = `${handle}@demo.pixelrank`;
  await run(`INSERT INTO users (id,name,email,password_hash,college,country,branch,batch,created_at) VALUES (?,?,?,?,?,?,?,?,?) ON CONFLICT (email) DO NOTHING`,
    [randomUUID(), name, email, hash, college, "India", branch, batch, now]);
  const rows = await query("SELECT id FROM users WHERE email=?", [email]);
  const id = rows[0].id;
  const score = scoreOf(lc, cf, cc); const solved = 180 + (lc % 120); const xp = xpOf(score, solved);
  await run(`INSERT INTO profiles (user_id,cf_handle,lc_handle,cc_handle,cf_rating,cf_max_rating,lc_rating,lc_solved,cc_rating,cc_stars,score,xp,level,sync_status,last_synced_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    ON CONFLICT (user_id) DO UPDATE SET cf_rating=EXCLUDED.cf_rating, lc_rating=EXCLUDED.lc_rating, cc_rating=EXCLUDED.cc_rating, score=EXCLUDED.score, xp=EXCLUDED.xp, level=EXCLUDED.level, updated_at=EXCLUDED.updated_at`,
    [id, handle, handle, handle, cf, cf + 120, lc, solved, cc, stars(cc), score, xp, levelFor(xp), "ok", now, now]);
  console.log("seeded", name, "score", score);
}
console.log("done - demo login: aarav@demo.pixelrank / demo1234");
process.exit(0);
