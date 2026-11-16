import { NextResponse } from "next/server";
import { z } from "zod";
import { q1, type UserRow } from "@/lib/db";
import { checkPassword, createSession } from "@/lib/auth";
import { rateLimit } from "@/lib/ratelimit";
const Body = z.object({ email: z.string().email(), password: z.string().min(1) });
export async function POST(req: Request) {
  if (!rateLimit(`login:${req.headers.get("x-forwarded-for") ?? "local"}`, 20, 900000)) return NextResponse.json({ error: "Too many tries, wait a bit" }, { status: 429 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email and password" }, { status: 400 });
  const user = await q1<UserRow>("SELECT * FROM users WHERE email = ?", [parsed.data.email.toLowerCase()]);
  if (!user || !(await checkPassword(parsed.data.password, user.password_hash))) return NextResponse.json({ error: "Email or password is wrong" }, { status: 401 });
  await createSession(user.id);
  return NextResponse.json({ ok: true });
}
