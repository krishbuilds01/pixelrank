import { cookies } from "next/headers";
import { randomUUID, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import db, { type UserRow } from "./db";

export const SESSION_COOKIE = "pr_session";
export async function hashPassword(pw: string) { return bcrypt.hash(pw, 10); }
export async function checkPassword(pw: string, hash: string) { return bcrypt.compare(pw, hash); }

export async function createSession(userId: string) {
  const id = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 30 * 24 * 3600 * 1000);
  db.prepare("INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)")
    .run(id, userId, expires.toISOString(), new Date().toISOString());
  const store = await cookies();
  store.set(SESSION_COOKIE, id, { httpOnly: true, sameSite: "lax", path: "/", expires, secure: process.env.NODE_ENV === "production" });
  return id;
}
export async function destroySession() {
  const store = await cookies();
  const id = store.get(SESSION_COOKIE)?.value;
  if (id) db.prepare("DELETE FROM sessions WHERE id = ?").run(id);
  store.delete(SESSION_COOKIE);
}
export async function currentUser(): Promise<UserRow | null> {
  const store = await cookies();
  const id = store.get(SESSION_COOKIE)?.value;
  if (!id) return null;
  const row = db.prepare("SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.id = ? AND s.expires_at > ?")
    .get(id, new Date().toISOString()) as UserRow | undefined;
  return row ?? null;
}
export function newId() { return randomUUID(); }
