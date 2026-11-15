import SectionHead from "@/components/SectionHead";
import { getContests } from "@/lib/contests";
import ContestCalendar from "@/components/ContestCalendar";
export const dynamic = "force-dynamic";
export default async function ContestsPage() {
  const contests = await getContests().catch(() => []);
  return (
    <main className="dotgrid flex-1"><section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <SectionHead no="01" label="Boss fights" title="CONTEST CALENDAR" sub="Codeforces rounds are live from their API. LeetCode Weekly runs every Sunday, Biweekly every second Saturday, and CodeChef Starters every Wednesday - those are placed from their fixed schedules. Times in IST. Click any day to see its contests." />
      <ContestCalendar />
      <div className="mt-14"><SectionHead no="02" label="Coming up" title="NEXT CONTESTS" /></div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {contests.map((c) => (
          <a key={c.name + c.start} href={c.url} target="_blank" rel="noreferrer" className="px-card block p-5 hover:border-mint">
            <div className="flex items-center justify-between"><span className="font-mono text-[12px] uppercase tracking-wider text-sky2">{c.platform}</span>{c.boss ? <span className="border border-coral px-2 py-0.5 font-mono text-[11px] text-coral">BOSS</span> : null}</div>
            <h3 className="mt-3 font-semibold leading-snug text-cream">{c.name}</h3>
            <p className="mt-3 font-mono text-[13px] text-dim">{new Date(c.start).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })} IST</p>
          </a>
        ))}
      </div>
      <p className="mt-8 text-sm text-dim">Reminders: sign in and keep your handles synced - email reminders are the next improvement, the contest list itself is live now.</p>
    </section></main>
  );
}
