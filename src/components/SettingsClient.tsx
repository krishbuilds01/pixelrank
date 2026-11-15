"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SectionHead from "@/components/SectionHead";
const input = "w-full border-2 border-line bg-panel2 px-3 py-2.5 text-sm text-cream placeholder:text-dim focus:border-mint focus:outline-none";
type User = { name: string; email: string; college: string; country: string; branch: string; batch: number | null; isPublic: boolean };
export default function SettingsClient() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  useEffect(() => { fetch("/api/me").then(async (r) => { if (!r.ok) { router.push("/login"); return; } const d = await r.json(); setUser(d.user); }).catch(() => {}); }, [router]);
  if (!user) return <main className="dotgrid flex-1 px-4 py-16"><p className="mx-auto max-w-3xl font-mono text-sm text-dim">Loading settings...</p></main>;
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setMsg("");
    const f = new FormData(e.currentTarget);
    const body: Record<string, unknown> = { name: f.get("name"), college: f.get("college") || "", branch: f.get("branch") || "", country: f.get("country") || "India", isPublic: f.get("isPublic") === "on" };
    const batch = f.get("batch"); body.batch = batch ? Number(batch) : null;
    const res = await fetch("/api/me", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const d = await res.json().catch(() => ({})); setBusy(false);
    if (!res.ok) { setMsg(d.error ?? "Could not save"); return; }
    setUser(d.user); setMsg("Saved."); router.refresh();
  }
  async function del() {
    if (!confirm("Delete your account and all your data? This cannot be undone.")) return;
    await fetch("/api/me", { method: "DELETE" });
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/"); router.refresh();
  }
  return (
    <main className="dotgrid flex-1"><section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <SectionHead no="01" label="Player settings" title="SETTINGS" />
      <form onSubmit={save} className="px-card p-6">
        <div className="space-y-4">
          <label className="block"><span className="mb-1 block font-mono text-[12px] text-dim">Name</span><input name="name" defaultValue={user.name} required className={input} /></label>
          <label className="block"><span className="mb-1 block font-mono text-[12px] text-dim">Email (cannot change)</span><input value={user.email} disabled className={`${input} opacity-60`} /></label>
          <label className="block"><span className="mb-1 block font-mono text-[12px] text-dim">College</span><input name="college" defaultValue={user.college} className={input} /></label>
          <div className="grid grid-cols-3 gap-3">
            <label className="block"><span className="mb-1 block font-mono text-[12px] text-dim">Branch</span><input name="branch" defaultValue={user.branch} className={input} /></label>
            <label className="block"><span className="mb-1 block font-mono text-[12px] text-dim">Batch</span><input name="batch" type="number" defaultValue={user.batch ?? ""} className={input} /></label>
            <label className="block"><span className="mb-1 block font-mono text-[12px] text-dim">Country</span><input name="country" defaultValue={user.country} className={input} /></label>
          </div>
          <label className="flex items-center gap-3 text-sm text-cream"><input type="checkbox" name="isPublic" defaultChecked={user.isPublic} className="size-4 accent-emerald-400" /> Show me on public leaderboards</label>
        </div>
        {msg ? <p className="mt-4 text-sm text-dim">{msg}</p> : null}
        <button disabled={busy} className="px-btn mt-6 bg-mint px-4 py-2.5 font-mono text-[13px] font-bold text-black disabled:opacity-50">Save changes</button>
      </form>
      <div className="px-card mt-8 border-coral/60 p-6">
        <h3 className="font-semibold text-coral">Delete account</h3>
        <p className="mt-2 text-sm text-dim">Removes your account, handles, ratings and sessions. Nothing is kept.</p>
        <button onClick={del} className="px-btn mt-4 bg-coral px-4 py-2.5 font-mono text-[13px] font-bold text-black">Delete my data</button>
      </div>
    </section></main>
  );
}
