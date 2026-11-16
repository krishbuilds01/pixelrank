import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { getProfile } from "@/lib/sync";
import { fetchLeetcode } from "@/lib/platforms/leetcode";
import { questsFor } from "@/lib/quests";
export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ quests: questsFor([], false) });
  const p = await getProfile(user.id);
  let weak: string[] = [];
  if (p?.lc_handle) { try { weak = (await fetchLeetcode(p.lc_handle)).weakTopics; } catch { weak = []; } }
  return NextResponse.json({ quests: questsFor(weak, !!(p?.cf_handle || p?.lc_handle || p?.cc_handle)), weakTopics: weak });
}
