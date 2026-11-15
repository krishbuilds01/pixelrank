import type { BoardRow } from "@/lib/board";
export default function BoardTable({ rows }: { rows: BoardRow[] }) {
  if (rows.length === 0) return <div className="px-card p-6 text-sm text-dim">No synced players here yet. Sign up, link your handles and sync - the first rank on this board is free.</div>;
  return (
    <div className="px-card overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead><tr className="border-b-2 border-line font-mono text-[12px] uppercase tracking-wider text-dim">
          <th className="px-4 py-3">Rank</th><th className="px-4 py-3">Player</th><th className="px-4 py-3">College</th><th className="px-4 py-3">Level</th><th className="px-4 py-3">LC</th><th className="px-4 py-3">CF</th><th className="px-4 py-3">CC</th><th className="px-4 py-3">Score</th>
        </tr></thead>
        <tbody>
          {rows.map((p, i) => (
            <tr key={p.name + i} className="border-b border-line/60 last:border-0">
              <td className="px-4 py-3 font-pixel text-[12px]">{i === 0 ? <span className="text-sun">01</span> : String(i + 1).padStart(2, "0")}</td>
              <td className="px-4 py-3"><span className="block font-semibold text-cream">{p.name}</span><span className="font-mono text-[12px] text-dim">{p.branch} {p.batch ?? ""}</span></td>
              <td className="px-4 py-3 text-dim">{p.college || "-"}</td>
              <td className="px-4 py-3 font-mono text-mint">Lv {p.level}</td>
              <td className="px-4 py-3 font-mono">{p.lc ?? "-"}</td><td className="px-4 py-3 font-mono">{p.cf ?? "-"}</td><td className="px-4 py-3 font-mono">{p.cc ?? "-"}</td>
              <td className="px-4 py-3 font-mono font-bold text-sun">{p.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
