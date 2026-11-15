import SectionHead from "@/components/SectionHead";
import LeaderboardTable from "@/components/LeaderboardTable";

const filters = ["All branches", "CSE", "ECE", "IT", "2026", "2027", "2028"];

export default function LeaderboardPage() {
  return (
    <main className="dotgrid flex-1">
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHead no="01" label="High scores - LPU" title="COLLEGE BOARD" sub="Which branch ranks highest this week? Filters are visual for now, they wire up with real data next." />
        <div className="mb-6 flex flex-wrap gap-3">
          {filters.map((f, i) => (
            <span key={f} className={`px-btn px-3 py-1.5 font-mono text-[13px] ${i === 0 ? "bg-sun text-black" : "bg-panel2 text-cream"}`}>{f}</span>
          ))}
        </div>
        <LeaderboardTable />
        <p className="mt-6 font-mono text-[13px] text-dim">Global and college vs college boards come from this same table later. No redesign, just a wider filter.</p>
      </section>
    </main>
  );
}
