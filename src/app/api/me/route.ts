import { NextResponse } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { ensureProfile, getProfile } from "@/lib/sync";
function pub(u: NonNullable<Awaited<ReturnType<typeof currentUser>>>) {
  return { id: u.id, name: u.name, email: u.email, college: u.college, country: u.country, branch: u.branch, batch: u.batch, isPublic: u.is_public === 1 };
}
export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ user: null }, { status: 401 });
  ensureProfile(user.id);
  return NextResponse.json({ user: pub(user), profile: getProfile(user.id) });
}
const Patch = z.object({
  name: z.string().min(2).max(60).optional(), college: z.string().max(80).optional(), country: z.string().max(60).optional(),
  branch: z.string().max(40).optional(), batch: z.coerce.number().int().min(2020).max(2035).nullable().optional(), isPublic: z.boolean().optional(),
  cfHandle: z.string().max(60).nullable().optional(), lcHandle: z.string().max(60).nullable().optional(), ccHandle: z.string().max(60).nullable().optional(),
});
export async function PATCH(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const parsed = Patch.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid details" }, { status: 400 });
  const d = parsed.data;
  db.prepare("UPDATE users SET name=?, college=?, country=?, branch=?, batch=?, is_public=? WHERE id=?")
    .run(d.name ?? user.name, d.college ?? user.college, d.country ?? user.country, d.branch ?? user.branch, d.batch !== undefined ? d.batch : user.batch, d.isPublic !== undefined ? (d.isPublic ? 1 : 0) : user.is_public, user.id);
  ensureProfile(user.id);
  const p = getProfile(user.id)!;
  const clean = (v: string | null | undefined, old: string | null) => v === undefined ? old : (v?.trim() ? v.trim() : null);
  db.prepare("UPDATE profiles SET cf_handle=?, lc_handle=?, cc_handle=?, updated_at=? WHERE user_id=?")
    .run(clean(d.cfHandle, p.cf_handle), clean(d.lcHandle, p.lc_handle), clean(d.ccHandle, p.cc_handle), new Date().toISOString(), user.id);
  const fresh = await currentUser();
  return NextResponse.json({ user: fresh ? pub(fresh) : null, profile: getProfile(user.id) });
}
export async function DELETE() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  db.prepare("DELETE FROM sessions WHERE user_id = ?").run(user.id);
  db.prepare("DELETE FROM profiles WHERE user_id = ?").run(user.id);
  db.prepare("DELETE FROM users WHERE id = ?").run(user.id);
  return NextResponse.json({ ok: true });
}
