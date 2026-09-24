"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Page() {
  const r = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function go() {
    setErr(""); setBusy(true);
    const res = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    setBusy(false);
    if (res.ok) { r.push("/dashboard"); r.refresh(); } else setErr((await res.json().catch(() => null))?.error || "Something went wrong.");
  }
  return (
    <main className="mx-auto max-w-md px-4 py-6"><h1 className="mb-1 text-3xl font-bold">{mode === "login" ? "Log in" : "Create account"}</h1>
      <p className="mb-4 text-slate-500">Optional. Every tool works without an account. An account saves your history across devices.</p>
      <div className="space-y-3">
        {mode === "register" && <input className="input" placeholder="Name (optional)" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />}
        <input className="input" type="email" placeholder="Email address" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        <input className="input" type="password" placeholder="Password (8+ characters)" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
        {err && <p role="alert" className="text-red-500">{err}</p>}
        <button className="btn w-full" disabled={busy} onClick={go}>{busy ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}</button>
        <button className="text-sm underline" onClick={() => setMode(mode === "login" ? "register" : "login")}>{mode === "login" ? "Need an account? Register" : "Have an account? Log in"}</button>
      </div></main>
  );
}
