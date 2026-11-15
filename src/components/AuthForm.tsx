"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const input = "w-full border-2 border-line bg-panel2 px-3 py-2.5 text-sm text-cream placeholder:text-dim focus:border-mint focus:outline-none";
export function LoginForm() {
  const router = useRouter(); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setError("");
    const f = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: f.get("email"), password: f.get("password") }) });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setError(d.error ?? "Login failed"); return; }
    router.push("/dashboard"); router.refresh();
  }
  return (
    <form onSubmit={submit} className="px-card mx-auto w-full max-w-md p-6">
      <h1 className="font-pixel text-lg text-cream">LOG IN</h1>
      <div className="mt-6 space-y-4">
        <input name="email" type="email" required placeholder="Email" className={input} />
        <input name="password" type="password" required placeholder="Password" className={input} />
      </div>
      {error ? <p className="mt-4 border border-coral bg-coral/10 px-3 py-2 text-sm text-coral">{error}</p> : null}
      <button disabled={busy} className="px-btn mt-6 w-full bg-mint px-4 py-3 font-pixel text-[12px] text-black disabled:opacity-50">{busy ? "LOGGING IN..." : "ENTER"}</button>
      <p className="mt-4 text-center font-mono text-[13px] text-dim">New player? <Link href="/register" className="text-mint underline">Create an account</Link></p>
      <p className="mt-2 text-center font-mono text-[12px] text-dim">Demo: aarav@demo.pixelrank / demo1234</p>
    </form>
  );
}
export function RegisterForm() {
  const router = useRouter(); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setError("");
    const f = new FormData(e.currentTarget);
    const body: Record<string, unknown> = { name: f.get("name"), email: f.get("email"), password: f.get("password"), college: f.get("college") || undefined, branch: f.get("branch") || undefined, country: f.get("country") || undefined };
    const batch = f.get("batch"); if (batch) body.batch = Number(batch);
    const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setError(d.error ?? "Sign up failed"); return; }
    router.push("/dashboard"); router.refresh();
  }
  return (
    <form onSubmit={submit} className="px-card mx-auto w-full max-w-md p-6">
      <h1 className="font-pixel text-lg text-cream">SIGN UP</h1>
      <div className="mt-6 space-y-4">
        <input name="name" required minLength={2} placeholder="Your name" className={input} />
        <input name="email" type="email" required placeholder="Email" className={input} />
        <input name="password" type="password" required minLength={8} placeholder="Password (8+ characters)" className={input} />
        <input name="college" placeholder="College (example: LPU)" className={input} />
        <div className="grid grid-cols-3 gap-3">
          <input name="branch" placeholder="Branch" className={input} />
          <input name="batch" type="number" min={2020} max={2035} placeholder="Batch" className={input} />
          <input name="country" placeholder="Country" defaultValue="India" className={input} />
        </div>
      </div>
      {error ? <p className="mt-4 border border-coral bg-coral/10 px-3 py-2 text-sm text-coral">{error}</p> : null}
      <button disabled={busy} className="px-btn mt-6 w-full bg-sun px-4 py-3 font-pixel text-[12px] text-black disabled:opacity-50">{busy ? "CREATING..." : "PRESS START"}</button>
      <p className="mt-4 text-center font-mono text-[13px] text-dim">Already playing? <Link href="/login" className="text-mint underline">Log in</Link></p>
    </form>
  );
}
