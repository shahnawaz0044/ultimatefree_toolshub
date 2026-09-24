"use client";
import { useState } from "react";
export default function Page() {
  const [f, setF] = useState({ name: "", email: "", message: "" });
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [err, setErr] = useState("");
  async function submit() {
    setErr(""); setState("sending");
    const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    if (r.ok) setState("sent"); else { setState("idle"); setErr((await r.json().catch(() => null))?.error || "Could not send your message."); }
  }
  return (
    <main className="mx-auto max-w-xl px-4 py-6"><h1 className="mb-4 text-3xl font-bold">Contact</h1>
      {state === "sent" ? <p role="status">Thanks. Your message was sent.</p> : (
        <div className="space-y-3">
          <input className="input" placeholder="Your name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <input className="input" type="email" placeholder="Email address" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
          <textarea className="input min-h-[140px]" placeholder="How can we help?" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />
          {err && <p role="alert" className="text-red-500">{err}</p>}
          <button className="btn" disabled={state === "sending"} onClick={submit}>{state === "sending" ? "Sending…" : "Send message"}</button>
        </div>)}
    </main>
  );
}
