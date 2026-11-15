"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Nav() {
  const [name, setName] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => { fetch("/api/me").then((r) => r.ok ? r.json() : null).then((d) => setName(d?.user?.name ?? null)).catch(() => {}); }, []);
  async function logout() { await fetch("/api/auth/logout", { method: "POST" }); setName(null); router.push("/"); router.refresh(); }
  return (
    <header className="sticky top-0 z-40 border-b-2 border-line bg-ink/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-9 place-items-center border-2 border-black bg-sun font-pixel text-[11px] text-black shadow-[3px_3px_0_#000]">P</span>
          <span className="font-pixel text-[13px] tracking-tight text-cream">PIXEL<span className="text-mint">RANK</span></span>
        </Link>
        <nav className="hidden items-center gap-6 font-mono text-[13px] text-dim sm:flex">
          <Link href="/leaderboard" className="hover:text-cream">Leaderboard</Link>
          <Link href="/contests" className="hover:text-cream">Contests</Link>
          <Link href="/dashboard" className="hover:text-cream">Dashboard</Link>
          <Link href="/settings" className="hover:text-cream">Settings</Link>
        </nav>
        {name ? (
          <span className="flex items-center gap-3"><span className="hidden font-mono text-[13px] text-dim md:inline">{name.split(" ")[0]}</span><button onClick={logout} className="px-btn bg-panel2 px-3 py-2 font-mono text-[13px] font-bold text-cream">Log out</button></span>
        ) : (
          <span className="flex gap-3"><Link href="/login" className="px-btn bg-panel2 px-3 py-2 font-mono text-[13px] font-bold text-cream">Log in</Link><Link href="/register" className="px-btn bg-mint px-3 py-2 font-mono text-[13px] font-bold text-black">Sign up</Link></span>
        )}
      </div>
    </header>
  );
}
