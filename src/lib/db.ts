import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";

const dir = path.join(process.cwd(), "data");
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
const db = new DatabaseSync(path.join(dir, "pixelrank.db"));
db.exec("PRAGMA journal_mode = WAL;");
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL, college TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT 'India', branch TEXT NOT NULL DEFAULT '',
  batch INTEGER, is_public INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS profiles (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  cf_handle TEXT, lc_handle TEXT, cc_handle TEXT,
  cf_rating INTEGER, cf_max_rating INTEGER, lc_rating INTEGER, lc_solved INTEGER,
  cc_rating INTEGER, cc_stars INTEGER,
  score INTEGER NOT NULL DEFAULT 0, xp INTEGER NOT NULL DEFAULT 0, level INTEGER NOT NULL DEFAULT 1,
  sync_status TEXT NOT NULL DEFAULT 'never', sync_error TEXT, last_synced_at TEXT,
  updated_at TEXT NOT NULL
);
`);
export default db;

export type UserRow = {
  id: string; name: string; email: string; password_hash: string;
  college: string; country: string; branch: string; batch: number | null;
  is_public: number; created_at: string;
};
export type ProfileRow = {
  user_id: string; cf_handle: string | null; lc_handle: string | null; cc_handle: string | null;
  cf_rating: number | null; cf_max_rating: number | null; lc_rating: number | null; lc_solved: number | null;
  cc_rating: number | null; cc_stars: number | null;
  score: number; xp: number; level: number; sync_status: string; sync_error: string | null;
  last_synced_at: string | null; updated_at: string;
};
