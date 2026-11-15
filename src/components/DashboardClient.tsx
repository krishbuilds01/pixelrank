"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SectionHead from "@/components/SectionHead";

type User = { name: string; email: string; college: string; country: string; branch: string; batch: number | null; isPublic: boolean };
type Profile = { cf_handle: string | null; lc_handle: string | null; cc_handle: string | null; cf_rating: number | null; lc_rating: number | null; lc_solved: number | null; cc_rating: number | null; cc_stars: number | null; score: number; xp: number; level: number; sync_status: string; sync_error: string | null; last_synced_at: string | null };
type Quest = { title: string; detail: string; xp: number };
type Contest = { platform: string; name: string; start: string; boss: boolean };
const input = "w-full border-2 border-line bg-panel2 px-3 py-2.5 text-sm text-cream placeholder:text-dim focus:border-mint focus:outline-none";
const fmt = (iso: string) => new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

export default function DashboardClient() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);
  const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false); const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/me");
      if (!res.ok) { router.push("/login"); return; }
      const d = await res.json();
      if (cancelled) return;
      setUser(d.user); setProfile(d.profile); setLoading(false);
      fetch("/api/quests").then((r) => r.json()).then((q) => { if (!cancelled) setQuests(q.quests ?? []); }).catch(() => {});
      fetch("/api/contests").then((r) => r.json()).then((c) => { if (!cancelled) setContests((c.contests ?? []).slice(0, 3)); }).catch(() => {});
    })();
    return () => { cancelled = true; };
  }, [router]);

  async function saveHandles(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setMsg("");
    const f = new FormData(e.currentTarget);
    const res = await fetch("/api/me", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cfHandle: f.get("cf") || null, lcHandle: f.get("lc") || null, ccHandle: f.get("cc") || null }) });
    const d = await res.json().catch(() => ({})); setBusy(false);
    if (!res.ok) { setMsg(d.error ?? "Could not save handles"); return; }
    setProfile(d.profile); setMsg("Handles saved. Now hit Sync ratings.");
  }
  async function sync() {
    setBusy(true); setMsg("");
    const res = await fetch("/api/sync", { method: "POST" });
    const d = await res.json().catch(() => ({})); setBusy(false);
    if (!res.ok) { setMsg(d.error ?? "Sync failed"); return; }
    setProfile(d.profile);
    setMsg(d.profile.sync_status === "ok" ? "Synced. Your score is updated." : d.profile.sync_error ?? "Synced with some platforms failing - check the handles.");
    fetch("/api/quests").then((r) => r.json()).then((q) => setQuests(q.quests ?? [])).catch(() => {});
  }
  if (loading || !user || !profile) return <main className="dotgrid flex-1 px-4 py-16"><p className="mx-auto max-w-6xl font-mono text-sm text-dim">Loading your profile...</p></main>;
  const xpPct = Math.min(100, Math.round(((profile.xp % 1000) / 1000) * 100));
  return (
    <main className="dotgrid flex-1">
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHead no="01" label="Player profile" title="YOUR DASHBOARD" />
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="px-card p-6">
            <div className="flex items-center gap-4">
              <div className="grid size-14 shrink-0 place-items-center border-2 border-black bg-grape font-pixel text-sm text-black shadow-[3px_3px_0_#000]">{user.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
              <div><p className="font-semibold text-cream">{user.name}</p><p className="font-mono text-[13px] text-dim">{user.college || "No college set"} {user.branch ? `· ${user.branch}` : ""} {user.batch ?? ""}</p></div>
            </div>
            <div className="mt-6 flex items-end justify-between"><span className="font-pixel text-sm text-mint">LEVEL {profile.level}</span><span className="font-mono text-[12px] text-dim">{profile.xp} XP</span></div>
            <div className="mt-3 h-4 border-2 border-black bg-panel2"><div className="h-full bg-mint" style={{ width: `${xpPct}%` }} /></div>
            <div className="mt-6 grid grid-cols-2 gap-3 font-mono text-[13px]">
              <div className="border border-line bg-panel2 p-3">Unified score<br /><span className="text-base font-bold text-sun">{profile.score || "-"}</span></div>
              <div className="border border-line bg-panel2 p-3">Last synced<br /><span className="text-[13px] font-bold text-cream">{profile.last_synced_at ? fmt(profile.last_synced_at) : "Never"}</span></div>
            </div>
            {profile.sync_error ? <p className="mt-4 border border-coral bg-coral/10 px-3 py-2 text-[13px] text-coral">{profile.sync_error}</p> : null}
          </div>
          <div className="px-card p-6 lg:col-span-2">
            <p className="font-mono text-[12px] uppercase tracking-widest text-dim">Your handles - public usernames only, no passwords</p>
            <form onSubmit={saveHandles} className="mt-4 grid gap-4 sm:grid-cols-3">
              <label className="block"><span className="mb-1 block font-mono text-[12px] text-sun">Codeforces</span><input name="cf" defaultValue={profile.cf_handle ?? ""} placeholder="cf handle" className={input} /></label>
              <label className="block"><span className="mb-1 block font-mono text-[12px] text-sky2">LeetCode</span><input name="lc" defaultValue={profile.lc_handle ?? ""} placeholder="leetcode username" className={input} /></label>
              <label className="block"><span className="mb-1 block font-mono text-[12px] text-grape">CodeChef</span><input name="cc" defaultValue={profile.cc_handle ?? ""} placeholder="codechef handle" className={input} /></label>
              <div className="flex flex-wrap gap-3 sm:col-span-3">
                <button disabled={busy} className="px-btn bg-panel2 px-4 py-2.5 font-mono text-[13px] font-bold text-cream disabled:opacity-50">Save handles</button>
                <button type="button" onClick={sync} disabled={busy} className="px-btn bg-mint px-4 py-2.5 font-mono text-[13px] font-bold text-black disabled:opacity-50">{busy ? "WORKING..." : "Sync ratings"}</button>
              </div>
            </form>
            {msg ? <p className="mt-4 text-sm text-dim">{msg}</p> : null}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[["Codeforces", profile.cf_rating, "text-sun"], ["LeetCode", profile.lc_rating, "text-sky2"], ["CodeChef", profile.cc_rating, "text-grape"]].map(([name, rating, cls]) => (
                <div key={name as string} className="border border-line bg-panel2 p-4"><p className="font-mono text-[13px] text-dim">{name}{name === "CodeChef" && profile.cc_stars ? ` · ${profile.cc_stars} star` : ""}{name === "LeetCode" && profile.lc_solved ? ` · ${profile.lc_solved} solved` : ""}</p><p className={`mt-2 font-pixel text-lg ${cls}`}>{rating ?? "-"}</p></div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHead no="02" label="This week" title="YOUR QUESTS" />
            <div className="space-y-4">{quests.map((q) => (<div key={q.title} className="px-card p-5"><div className="flex justify-between"><h3 className="font-semibold text-cream">{q.title}</h3><span className="font-mono text-[12px] text-sun">+{q.xp} XP</span></div><p className="mt-2 text-sm text-dim">{q.detail}</p></div>))}</div>
          </div>
          <div>
            <SectionHead no="03" label="Boss fights" title="NEXT CONTESTS" />
            <div className="space-y-4">{contests.map((c) => (<div key={c.name + c.start} className="px-card p-5"><div className="flex justify-between"><span className="font-mono text-[12px] uppercase text-sky2">{c.platform}</span>{c.boss ? <span className="border border-coral px-2 py-0.5 font-mono text-[11px] text-coral">BOSS</span> : null}</div><h3 className="mt-2 font-semibold text-cream">{c.name}</h3><p className="mt-1 font-mono text-[13px] text-dim">{fmt(c.start)} IST</p></div>))}</div>
          </div>
        </div>
      </section>
    </main>
  );
}
