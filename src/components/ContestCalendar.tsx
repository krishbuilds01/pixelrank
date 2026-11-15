"use client";
import { useEffect, useMemo, useState } from "react";

type CalEvent = { platform: string; name: string; start: string; url: string; dateKey: string };
const dot: Record<string, string> = { Codeforces: "bg-sun", LeetCode: "bg-sky2", CodeChef: "bg-grape" };
const txt: Record<string, string> = { Codeforces: "text-sun", LeetCode: "text-sky2", CodeChef: "text-grape" };
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function istTodayKey(): string {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export default function ContestCalendar() {
  const todayKey = useMemo(() => istTodayKey(), []);
  const [cursor, setCursor] = useState(() => { const [y, m] = todayKey.split("-").map(Number); return { y, m }; });
  const [selected, setSelected] = useState(todayKey);
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const res = await fetch(`/api/calendar?year=${cursor.y}&month=${cursor.m}`).catch(() => null);
      const d = res ? await res.json().catch(() => null) : null;
      if (!cancelled) { setEvents(d?.events ?? []); setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [cursor]);

  const byDay = useMemo(() => { const map = new Map<string, CalEvent[]>(); for (const e of events) { const l = map.get(e.dateKey) ?? []; l.push(e); map.set(e.dateKey, l); } return map; }, [events]);
  const firstDow = new Date(Date.UTC(cursor.y, cursor.m - 1, 1, 12)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(cursor.y, cursor.m, 0)).getUTCDate();
  const cells: Array<number | null> = [...Array(firstDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const keyFor = (d: number) => `${cursor.y}-${String(cursor.m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const move = (delta: number) => { setCursor((c) => { const m = c.m + delta; return m < 1 ? { y: c.y - 1, m: 12 } : m > 12 ? { y: c.y + 1, m: 1 } : { y: c.y, m }; }); };
  const dayEvents = byDay.get(selected) ?? [];

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="px-card p-5 lg:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <button onClick={() => move(-1)} className="px-btn bg-panel2 px-3 py-1.5 font-mono text-[13px] text-cream">{"< Prev"}</button>
          <h3 className="font-pixel text-[13px] text-cream">{MONTHS[cursor.m - 1].toUpperCase()} {cursor.y}</h3>
          <button onClick={() => move(1)} className="px-btn bg-panel2 px-3 py-1.5 font-mono text-[13px] text-cream">{"Next >"}</button>
        </div>
        <div className="grid grid-cols-7 gap-1.5 font-mono text-[11px] uppercase text-dim">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d} className="pb-1 text-center">{d}</div>)}
          {cells.map((d, i) => {
            if (d === null) return <div key={`x${i}`} />;
            const key = keyFor(d); const evs = byDay.get(key) ?? [];
            const isToday = key === todayKey; const isSel = key === selected;
            return (
              <button key={key} onClick={() => setSelected(key)} className={`min-h-14 border-2 p-1.5 text-left align-top ${isSel ? "border-mint bg-panel2" : isToday ? "border-sun bg-panel" : "border-line/50 bg-panel hover:border-line"}`}>
                <span className={`font-mono text-[12px] ${isToday ? "font-bold text-sun" : "text-cream"}`}>{d}</span>
                <span className="mt-1 flex flex-wrap gap-1">{evs.map((e, j) => <span key={j} title={`${e.platform} - ${e.name}`} className={`size-2 ${dot[e.platform] ?? "bg-dim"}`} />)}</span>
                {evs.length > 0 ? <span className="mt-0.5 hidden font-mono text-[9px] leading-tight text-dim sm:block">{evs.length} contest{evs.length > 1 ? "s" : ""}</span> : null}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-4 font-mono text-[12px] text-dim">
          <span><span className="mr-1 inline-block size-2 bg-sun" /> Codeforces</span>
          <span><span className="mr-1 inline-block size-2 bg-sky2" /> LeetCode</span>
          <span><span className="mr-1 inline-block size-2 bg-grape" /> CodeChef</span>
          {loading ? <span>Loading month...</span> : null}
        </div>
      </div>
      <div className="px-card p-5">
        <p className="font-mono text-[12px] uppercase tracking-widest text-dim">{selected === todayKey ? "Today - " : ""}{selected}</p>
        {dayEvents.length === 0 ? (
          <div className="mt-4"><h3 className="font-semibold text-cream">No contests this day</h3><p className="mt-2 text-sm text-dim">Practice day. Pick a quest from your dashboard and gain XP.</p></div>
        ) : (
          <div className="mt-4 space-y-4">
            {dayEvents.map((e) => (
              <a key={e.name + e.start} href={e.url} target="_blank" rel="noreferrer" className="block border border-line bg-panel2 p-4 hover:border-mint">
                <span className={`font-mono text-[12px] uppercase tracking-wider ${txt[e.platform] ?? "text-dim"}`}>{e.platform}</span>
                <h4 className="mt-1 font-semibold leading-snug text-cream">{e.name}</h4>
                <p className="mt-1 font-mono text-[13px] text-dim">{new Date(e.start).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit" })} IST</p>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
