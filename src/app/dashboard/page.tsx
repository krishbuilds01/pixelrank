import SectionHead from "@/components/SectionHead";
import { contests, players, quests, totalScore } from "@/lib/data";

const me = players[3];

export default function DashboardPage() {
  const xpPct = Math.round(((me.xp % 1000) / 1000) * 100);
  return (
    <main className="dotgrid flex-1">
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHead no="01" label="Player profile" title="YOUR DASHBOARD" />
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="px-card p-6">
            <div className="flex items-center gap-4">
              <div className="grid size-14 place-items-center border-2 border-black bg-grape font-pixel text-sm text-black shadow-[3px_3px_0_#000]">KP</div>
              <div><p className="font-semibold text-cream">{me.name}</p><p className="font-mono text-[13px] text-dim">@{me.handle}</p></div>
            </div>
            <div className="mt-6 flex items-end justify-between"><span className="font-pixel text-sm text-mint">LEVEL {me.level}</span><span className="font-mono text-[12px] text-dim">{me.xp} XP</span></div>
            <div className="mt-3 h-4 border-2 border-black bg-panel2"><div className="h-full bg-mint" style={{ width: `${xpPct}%` }} /></div>
            <div className="mt-6 grid grid-cols-2 gap-3 font-mono text-[13px]">
              <div className="border border-line bg-panel2 p-3">College rank<br /><span className="text-base font-bold text-sun">#{me.rank}</span></div>
              <div className="border border-line bg-panel2 p-3">Unified score<br /><span className="text-base font-bold text-sun">{totalScore(me)}</span></div>
            </div>
          </div>
          <div className="px-card p-6 lg:col-span-2">
            <p className="font-mono text-[12px] uppercase tracking-widest text-dim">Linked handles - sample data</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {[["LeetCode", me.leetcode, "text-sun"], ["Codeforces", me.codeforces, "text-sky2"], ["CodeChef", me.codechef, "text-grape"]].map(([name, rating, cls]) => (
                <div key={name as string} className="border border-line bg-panel2 p-4">
                  <p className="font-mono text-[13px] text-dim">{name}</p>
                  <p className={`mt-2 font-pixel text-lg ${cls}`}>{rating}</p>
                  <p className="mt-2 font-mono text-[12px] text-dim">Last synced 2h ago</p>
                </div>
              ))}
            </div>
            <div className="mt-6 border border-dashed border-line p-4">
              <p className="text-sm text-dim">Handle linking and live sync are next. Codeforces first, since it has a proper public API.</p>
            </div>
            <div className="mt-6">
              <p className="mb-3 font-mono text-[12px] uppercase tracking-widest text-dim">Next boss contest</p>
              <p className="font-semibold text-cream">{contests[0].name}</p>
              <p className="font-mono text-[13px] text-dim">{contests[0].date} · {contests[0].time}</p>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <SectionHead no="02" label="This week" title="YOUR QUESTS" />
          <div className="grid gap-5 md:grid-cols-3">
            {quests.map((q) => (
              <div key={q.title} className="px-card p-5"><h3 className="font-semibold text-cream">{q.title}</h3><p className="mt-2 text-sm text-dim">{q.detail}</p><p className="mt-3 font-mono text-[12px] text-sun">+{q.xp} XP · {q.done}/{q.total} done</p></div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
