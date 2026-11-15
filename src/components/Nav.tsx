import Link from "next/link";

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-line bg-ink/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-9 place-items-center border-2 border-black bg-sun font-pixel text-[11px] text-black shadow-[3px_3px_0_#000]">P</span>
          <span className="font-pixel text-[13px] tracking-tight text-cream">PIXEL<span className="text-mint">RANK</span></span>
        </Link>
        <nav className="hidden items-center gap-6 font-mono text-[13px] text-dim sm:flex">
          <Link href="/leaderboard" className="hover:text-cream">Leaderboard</Link>
          <Link href="/dashboard" className="hover:text-cream">Dashboard</Link>
          <a href="#contests" className="hover:text-cream">Contests</a>
          <a href="#quests" className="hover:text-cream">Quests</a>
        </nav>
        <Link href="/dashboard" className="px-btn bg-mint px-3 py-2 font-mono text-[13px] font-bold text-black">Link handles</Link>
      </div>
    </header>
  );
}
