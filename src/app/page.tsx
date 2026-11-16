import Link from "next/link";
import SectionHead from "@/components/SectionHead";
import BoardTable from "@/components/BoardTable";
import { boardRows, type BoardRow } from "@/lib/board";
import { getContests } from "@/lib/contests";
import { questsFor } from "@/lib/quests";
export const dynamic = "force-dynamic";

const sample: BoardRow[] = [
  { name: "Sample Player 1", college: "LPU", country: "India", branch: "CSE", batch: 2027, level: 28, xp: 9420, score: 1907, cf: 1682, lc: 2145, cc: 2362 },
  { name: "Sample Player 2", college: "LPU", country: "India", branch: "CSE", batch: 2026, level: 27, xp: 9105, score: 1871, cf: 1710, lc: 2080, cc: 2193 },
  { name: "Sample Player 3", college: "LPU", country: "India", branch: "ECE", batch: 2027, level: 26, xp: 8760, score: 1798, cf: 1590, lc: 1995, cc: 2275 },
];
const steps = [
  { n: "1", t: "Create your player", d: "Sign up with your college, branch and batch. That is what puts you on the right board." },
  { n: "2", t: "Link your handles", d: "Add your public LeetCode, Codeforces and CodeChef usernames. No passwords, just handles." },
  { n: "3", t: "Sync and get one score", d: "Your ratings are pulled into one place and turned into a single score, XP and a level." },
  { n: "4", t: "Climb the board", d: "College board first, then country and global. Same score, bigger board, no redesign." },
];

export default async function Home() {
  const real = await boardRows();
  const rows = real.length > 0 ? real.slice(0, 5) : sample;
  const contests = await getContests().catch(() => []);
  const quests = questsFor(["graph", "dynamic programming"], true);
  return (
    <main className="dotgrid flex-1">
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
        <p className="mb-5 inline-block border-2 border-line bg-panel px-3 py-1.5 font-mono text-[12px] uppercase tracking-widest text-dim">Campus first · Global later</p>
        <h1 className="font-pixel text-[32px] leading-[1.35] text-cream sm:text-5xl sm:leading-[1.3]">SEE WHERE<br />YOU <span className="text-sun">STAND.</span></h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-dim">Link your LeetCode, Codeforces and CodeChef handles. Get one dashboard, one score, and a leaderboard for your college - then the world.</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/register" className="px-btn bg-sun px-5 py-3 font-pixel text-[12px] text-black">PRESS START</Link>
          <Link href="/leaderboard" className="px-btn bg-panel2 px-5 py-3 font-pixel text-[12px] text-cream">VIEW BOARD</Link>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[["3", "Platforms"], ["1", "Score"], [String(real.length), "Players synced"], ["7 days", "New quests"]].map(([v, l]) => (
            <div key={l} className="px-card px-4 py-4"><p className="font-pixel text-lg text-mint">{v}</p><p className="mt-2 font-mono text-[12px] uppercase tracking-wider text-dim">{l}</p></div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHead no="01" label="How a round is played" title="HOW IT WORKS" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (<div key={s.n} className="px-card p-5"><p className="font-pixel text-sm text-sun">{s.n}.</p><h3 className="mt-4 font-semibold text-cream">{s.t}</h3><p className="mt-2 text-sm leading-relaxed text-dim">{s.d}</p></div>))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHead no="02" label="High scores" title="LEADERBOARD" sub={real.length > 0 ? "Top synced players right now." : "Sample rows shown until the first players sync. Real boards are live at the full leaderboard."} />
          <Link href="/leaderboard" className="mb-8 font-mono text-sm text-mint underline underline-offset-4">Full board</Link>
        </div>
        <BoardTable rows={rows} />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHead no="03" label="Boss fights" title="UPCOMING CONTESTS" />
        <div className="grid gap-5 md:grid-cols-3">
          {contests.slice(0, 3).map((c) => (
            <a key={c.name + c.start} href={c.url} target="_blank" rel="noreferrer" className="px-card block p-5 hover:border-mint">
              <div className="flex items-center justify-between"><span className="font-mono text-[12px] uppercase tracking-wider text-sky2">{c.platform}</span>{c.boss ? <span className="border border-coral px-2 py-0.5 font-mono text-[11px] text-coral">BOSS</span> : null}</div>
              <h3 className="mt-3 font-semibold leading-snug text-cream">{c.name}</h3>
              <p className="mt-3 font-mono text-[13px] text-dim">{new Date(c.start).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })} IST</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHead no="04" label="Weekly quests" title="PRACTICE PLAN" sub="Quests are picked from your weak LeetCode topics after you sync. This is the default set." />
        <div className="grid gap-5 md:grid-cols-3">
          {quests.map((q) => (<div key={q.title} className="px-card p-5"><div className="flex items-center justify-between"><h3 className="font-semibold text-cream">{q.title}</h3><span className="font-mono text-[12px] text-sun">+{q.xp} XP</span></div><p className="mt-2 text-sm text-dim">{q.detail}</p></div>))}
        </div>
      </section>

      <footer className="border-t-2 border-line"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-8 font-mono text-[13px] text-dim sm:px-6"><span>PIXELRANK - built for CP grinders</span><span>Your college is not on the board yet? Add it by signing up.</span></div></footer>
    </main>
  );
}
