import Link from "next/link";
import SectionHead from "@/components/SectionHead";
import BoardTable from "@/components/BoardTable";
import { boardRows, collegeRows } from "@/lib/board";
export const dynamic = "force-dynamic";

export default async function LeaderboardPage({ searchParams }: { searchParams: Promise<{ scope?: string; college?: string; country?: string; branch?: string; batch?: string }> }) {
  const sp = await searchParams;
  const scope = sp.scope ?? "global";
  let rows = boardRows();
  const colleges = [...new Set(rows.map((r) => r.college).filter(Boolean))];
  const countries = [...new Set(rows.map((r) => r.country).filter(Boolean))];
  if (scope === "college" && sp.college) rows = rows.filter((r) => r.college === sp.college);
  if (scope === "country" && sp.country) rows = rows.filter((r) => r.country === sp.country);
  if (sp.branch) rows = rows.filter((r) => r.branch === sp.branch);
  if (sp.batch) rows = rows.filter((r) => String(r.batch) === sp.batch);
  const vs = collegeRows();
  const tab = (href: string, label: string, active: boolean) => <Link key={label} href={href} className={`px-btn px-3 py-1.5 font-mono text-[13px] ${active ? "bg-sun text-black" : "bg-panel2 text-cream"}`}>{label}</Link>;
  return (
    <main className="dotgrid flex-1">
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHead no="01" label="High scores" title="LEADERBOARD" sub="Real players, real synced ratings. One score from LeetCode, Codeforces and CodeChef." />
        <div className="mb-4 flex flex-wrap gap-3">
          {tab("/leaderboard", "Global", scope === "global")}
          {colleges.map((c) => tab(`/leaderboard?scope=college&college=${encodeURIComponent(c)}`, c, scope === "college" && sp.college === c))}
          {countries.map((c) => tab(`/leaderboard?scope=country&country=${encodeURIComponent(c)}`, c, scope === "country" && sp.country === c))}
        </div>
        <div className="mb-6 flex flex-wrap gap-3">
          {["CSE", "ECE", "IT"].map((b) => tab(`/leaderboard?${new URLSearchParams({ ...(scope !== "global" ? { scope } : {}), ...(sp.college ? { college: sp.college } : {}), ...(sp.country ? { country: sp.country } : {}), branch: b }).toString()}`, b, sp.branch === b))}
          {[2026, 2027, 2028].map((y) => tab(`/leaderboard?${new URLSearchParams({ ...(scope !== "global" ? { scope } : {}), ...(sp.college ? { college: sp.college } : {}), batch: String(y) }).toString()}`, String(y), sp.batch === String(y)))}
          {(sp.branch || sp.batch) ? tab("/leaderboard", "Clear filters", false) : null}
        </div>
        <BoardTable rows={rows.slice(0, 100)} />
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <SectionHead no="02" label="College vs college" title="TOP COLLEGES" sub="Ranked by average score of their synced players." />
        <div className="grid gap-5 md:grid-cols-3">
          {vs.length === 0 ? <p className="text-sm text-dim">No college has synced players yet.</p> : vs.map((c, i) => (
            <div key={c.college} className="px-card p-5"><p className="font-pixel text-sm text-sun">#{i + 1}</p><h3 className="mt-3 font-semibold text-cream">{c.college}</h3><p className="mt-2 font-mono text-[13px] text-dim">{c.players} players · avg {c.avgScore} · top {c.topScore}</p></div>
          ))}
        </div>
      </section>
    </main>
  );
}
