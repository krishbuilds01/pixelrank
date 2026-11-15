import { NextResponse } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { hashPassword, createSession, newId } from "@/lib/auth";
import { ensureProfile } from "@/lib/sync";
import { rateLimit } from "@/lib/ratelimit";
const Body = z.object({ name: z.string().min(2).max(60), email: z.string().email(), password: z.string().min(8).max(100), college: z.string().max(80).optional(), country: z.string().max(60).optional(), branch: z.string().max(40).optional(), batch: z.coerce.number().int().min(2020).max(2035).optional() });
export async function POST(req: Request) {
  if (!rateLimit(`register:${req.headers.get("x-forwarded-for") ?? "local"}`, 10, 3600000)) return NextResponse.json({ error: "Too many tries, wait a bit" }, { status: 429 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Check your details - name, a valid email and a password of 8+ characters" }, { status: 400 });
  const d = parsed.data;
  const exists = db.prepare("SELECT id FROM users WHERE email = ?").get(d.email.toLowerCase());
  if (exists) return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
  const id = newId();
  db.prepare("INSERT INTO users (id, name, email, password_hash, college, country, branch, batch, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .run(id, d.name, d.email.toLowerCase(), await hashPassword(d.password), d.college ?? "", d.country ?? "India", d.branch ?? "", d.batch ?? null, new Date().toISOString());
  ensureProfile(id);
  await createSession(id);
  return NextResponse.json({ ok: true });
}
