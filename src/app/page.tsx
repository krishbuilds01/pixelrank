import Link from "next/link";
import SectionHead from "@/components/SectionHead";
import LeaderboardTable from "@/components/LeaderboardTable";
import { contests, quests } from "@/lib/data";

const steps = [
  { n: "1", t: "Link your handles", d: "Add your public LeetCode, Codeforces and CodeChef usernames. No passwords, just handles." },
  { n: "2", t: "Get one score", d: "Your ratings are pulled into one place and turned into a single score and XP level." },
  { n: "3", t: "Climb your college board", d: "See where you stand in your branch and batch. This is the board people actually check." },
  { n: "4", t: "Go global", d: "Same score, bigger board. Country ranks and college vs college come from the same data." },
];

export default function Home() {
  return (
    <main className="dotgrid flex-1">
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
        <p className="mb-5 inline-block border-2 border-line bg-panel px-3 py-1.5 font-mono text-[12px] uppercase tracking-widest text-dim">Campus first · Global later</p>
        <h1 className="font-pixel text-[32px] leading-[1.35] text-cream sm:text-5xl sm:leading-[1.3]">
          SEE WHERE<br />YOU <span className="text-sun">STAND.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-dim">
          Link your LeetCode, Codeforces and CodeChef handles. Get one dashboard, one score, and a leaderboard for your college - then the world.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/dashboard" className="px-btn bg-sun px-5 py-3 font-pixel text-[12px] text-black">PRESS START</Link>
          <Link href="/leaderboard" className="px-btn bg-panel2 px-5 py-3 font-pixel text-[12px] text-cream">VIEW BOARD</Link>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[["3", "Platforms"], ["1", "Score"], ["50+", "Colleges soon"], ["7 days", "New quests"]].map(([v, l]) => (
            <div key={l} className="px-card px-4 py-4"><p className="font-pixel text-lg text-mint">{v}</p><p className="mt-2 font-mono text-[12px] uppercase tracking-wider text-dim">{l}</p></div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHead no="01" label="How a round is played" title="HOW IT WORKS" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="px-card p-5">
              <p className="font-pixel text-sm text-sun">{s.n}.</p>
              <h3 className="mt-4 font-semibold text-cream">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-dim">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHead no="02" label="High scores" title="COLLEGE LEADERBOARD" sub="Sample data for now. Real handles plug in next, branch and batch filters with it." />
          <Link href="/leaderboard" className="mb-8 font-mono text-sm text-mint underline underline-offset-4">Full board</Link>
        </div>
        <LeaderboardTable limit={5} />
      </section>

      <section id="contests" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHead no="03" label="Boss fights" title="UPCOMING CONTESTS" />
        <div className="grid gap-5 md:grid-cols-3">
          {contests.map((c) => (
            <div key={c.name} className="px-card p-5">
              <div className="flex items-center justify-between"><span className="font-mono text-[12px] uppercase tracking-wider text-sky2">{c.platform}</span>{c.boss ? <span className="border border-coral px-2 py-0.5 font-mono text-[11px] text-coral">BOSS</span> : null}</div>
              <h3 className="mt-3 font-semibold leading-snug text-cream">{c.name}</h3>
              <p className="mt-3 font-mono text-[13px] text-dim">{c.date} · {c.time}</p>
              <button className="px-btn mt-5 w-full bg-panel2 px-3 py-2 font-mono text-[13px] text-cream">Remind me</button>
            </div>
          ))}
        </div>
      </section>

      <section id="quests" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHead no="04" label="Weekly quests" title="PRACTICE PLAN" sub="A small plan every week, based on the topics you are weak at. Finish quests, gain XP, level up." />
        <div className="grid gap-5 md:grid-cols-3">
          {quests.map((q) => (
            <div key={q.title} className="px-card p-5">
              <div className="flex items-center justify-between"><h3 className="font-semibold text-cream">{q.title}</h3><span className="font-mono text-[12px] text-sun">+{q.xp} XP</span></div>
              <p className="mt-2 text-sm text-dim">{q.detail}</p>
              <div className="mt-4 h-3 border-2 border-black bg-panel2"><div className="h-full bg-mint" style={{ width: `${(q.done / q.total) * 100}%` }} /></div>
              <p className="mt-2 font-mono text-[12px] text-dim">{q.done}/{q.total} done</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t-2 border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-8 font-mono text-[13px] text-dim sm:px-6">
          <span>PIXELRANK - built for CP grinders</span><span>Your college is not on the board yet? Add it.</span>
        </div>
      </footer>
    </main>
  );
}
