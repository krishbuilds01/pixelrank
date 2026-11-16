import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";
import type { Pool } from "pg";

// Postgres (Supabase) when DATABASE_URL is set, local SQLite file otherwise.
// Call sites write SQL with ? placeholders; they are converted to $1, $2 for Postgres.
const SCHEMA = `
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
`;

type Row = Record<string, unknown>;
const clean = (params: unknown[]) => params.map((v) => (v === undefined ? null : v));
const toPg = (sql: string) => { let i = 0; return sql.replace(/\?/g, () => `$${++i}`); };

let sqlite: DatabaseSync | null = null;
function getSqlite(): DatabaseSync {
  if (!sqlite) {
    const dir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    sqlite = new DatabaseSync(path.join(dir, "pixelrank.db"));
    sqlite.exec("PRAGMA journal_mode = WAL;");
    sqlite.exec(SCHEMA);
  }
  return sqlite;
}

let pool: Pool | null = null;
let pgReady: Promise<void> | null = null;
async function getPool(): Promise<Pool> {
  if (!pool) {
    const { Pool: PgPool } = await import("pg");
    pool = new PgPool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }, max: 5 });
    pgReady = pool.query(SCHEMA).then(() => undefined);
  }
  await pgReady;
  return pool;
}

const usePg = () => Boolean(process.env.DATABASE_URL);

export async function q(sql: string, params: unknown[] = []): Promise<Row[]> {
  if (usePg()) { const p = await getPool(); const r = await p.query(toPg(sql), clean(params) as never[]); return r.rows as Row[]; }
  return getSqlite().prepare(sql).all(...(clean(params) as never[])) as unknown as Row[];
}
export async function q1<T = Row>(sql: string, params: unknown[] = []): Promise<T | null> {
  const rows = await q(sql, params);
  return (rows[0] as T) ?? null;
}
export async function run(sql: string, params: unknown[] = []): Promise<void> {
  if (usePg()) { const p = await getPool(); await p.query(toPg(sql), clean(params) as never[]); return; }
  getSqlite().prepare(sql).run(...(clean(params) as never[]));
}

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
