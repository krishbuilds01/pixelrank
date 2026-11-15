import { players, totalScore } from "@/lib/data";

function Change({ v }: { v: number }) {
  if (v > 0) return <span className="text-mint">▲ {v}</span>;
  if (v < 0) return <span className="text-coral">▼ {Math.abs(v)}</span>;
  return <span className="text-dim">- 0</span>;
}

export default function LeaderboardTable({ limit = 8 }: { limit?: number }) {
  const rows = players.slice(0, limit);
  return (
    <div className="px-card overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b-2 border-line font-mono text-[12px] uppercase tracking-wider text-dim">
            <th className="px-4 py-3">Rank</th><th className="px-4 py-3">Player</th>
            <th className="px-4 py-3">Level</th><th className="px-4 py-3">LC</th>
            <th className="px-4 py-3">CF</th><th className="px-4 py-3">CC</th>
            <th className="px-4 py-3">Score</th><th className="px-4 py-3">Move</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.rank} className={`border-b border-line/60 last:border-0 ${p.handle === "krishbuilds01" ? "bg-sun/10" : ""}`}>
              <td className="px-4 py-3 font-pixel text-[12px]">{p.rank === 1 ? <span className="text-sun">01</span> : String(p.rank).padStart(2, "0")}</td>
              <td className="px-4 py-3"><span className="block font-semibold text-cream">{p.name}</span><span className="font-mono text-[12px] text-dim">@{p.handle} · {p.branch} {p.batch}</span></td>
              <td className="px-4 py-3 font-mono text-mint">Lv {p.level}</td>
              <td className="px-4 py-3 font-mono">{p.leetcode}</td><td className="px-4 py-3 font-mono">{p.codeforces}</td><td className="px-4 py-3 font-mono">{p.codechef}</td>
              <td className="px-4 py-3 font-mono font-bold text-sun">{totalScore(p)}</td>
              <td className="px-4 py-3 font-mono"><Change v={p.change} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
