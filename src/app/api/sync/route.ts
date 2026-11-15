import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { syncUser } from "@/lib/sync";
import { rateLimit } from "@/lib/ratelimit";
export async function POST() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  if (!rateLimit(`sync:${user.id}`, 10, 600000)) return NextResponse.json({ error: "Syncing too often - ratings do not change that fast, try again in a few minutes" }, { status: 429 });
  const profile = await syncUser(user.id);
  return NextResponse.json({ profile });
}
