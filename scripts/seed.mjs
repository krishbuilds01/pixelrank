// Demo data for local development. Run: npm run db:seed
import { DatabaseSync } from "node:sqlite";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
fs.mkdirSync("data", { recursive: true });
const db = new DatabaseSync("data/pixelrank.db");
db.exec(`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, college TEXT NOT NULL DEFAULT '', country TEXT NOT NULL DEFAULT 'India', branch TEXT NOT NULL DEFAULT '', batch INTEGER, is_public INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, expires_at TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS profiles (user_id TEXT PRIMARY KEY, cf_handle TEXT, lc_handle TEXT, cc_handle TEXT, cf_rating INTEGER, cf_max_rating INTEGER, lc_rating INTEGER, lc_solved INTEGER, cc_rating INTEGER, cc_stars INTEGER, score INTEGER NOT NULL DEFAULT 0, xp INTEGER NOT NULL DEFAULT 0, level INTEGER NOT NULL DEFAULT 1, sync_status TEXT NOT NULL DEFAULT 'never', sync_error TEXT, last_synced_at TEXT, updated_at TEXT NOT NULL);`);
const demo = [
  ["Aarav Mehta", "aarav", "LPU", "CSE", 2027, 1682, 2145, 2362],
  ["Sana Iqbal", "sana", "LPU", "CSE", 2026, 1710, 2080, 2193],
  ["Rohan Verma", "rohan", "LPU", "ECE", 2027, 1590, 1995, 2275],
  ["Meera Nair", "meera", "VIT", "CSE", 2028, 1480, 1810, 2056],
  ["Dev Patel", "dev", "VIT", "IT", 2026, 1425, 1740, 1975],
  ["Isha Singh", "isha", "SRM", "ECE", 2027, 1390, 1690, 1887],
];
const hash = bcrypt.hashSync("demo1234", 10);
const score = (cf, lc, cc) => Math.round((cf * 0.4 + lc * 0.35 + cc * 0.8 * 0.25) / 1);
for (const [name, handle, college, branch, batch, cf, lc, cc] of demo) {
  const id = randomUUID(); const now = new Date().toISOString();
  db.prepare("INSERT OR IGNORE INTO users (id,name,email,password_hash,college,country,branch,batch,created_at) VALUES (?,?,?,?,?,?,?, ?,?)").run(id, name, `${handle}@demo.pixelrank`, hash, college, "India", branch, batch, now);
  const u = db.prepare("SELECT id FROM users WHERE email=?").get(`${handle}@demo.pixelrank`);
  const s = score(cf, lc, cc); const xp = s * 4 + 1200; const level = Math.max(1, Math.floor(Math.sqrt(xp / 250)) + 1);
  db.prepare("INSERT OR REPLACE INTO profiles (user_id,cf_handle,lc_handle,cc_handle,cf_rating,cf_max_rating,lc_rating,lc_solved,cc_rating,cc_stars,score,xp,level,sync_status,last_synced_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)")
    .run(u.id, handle, handle, handle, cf, cf + 60, lc, 320, cc, 4, s, xp, level, "ok", now, now);
}
console.log("seeded", demo.length, "demo users (password: demo1234)");
