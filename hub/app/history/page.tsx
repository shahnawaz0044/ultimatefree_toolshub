"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import tools from "@/lib/tools-data.json";

type Row = { id: string; t: number };
export default function Page() {
  const [rows, setRows] = useState<Row[]>([]);
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    (async () => {
      const r = await fetch("/api/history").catch(() => null);
      if (r?.ok) { const d = await r.json(); setSignedIn(true); setRows(d.map((x: { toolId: string; createdAt: string }) => ({ id: x.toolId, t: Date.parse(x.createdAt) }))); return; }
      try { setRows(JSON.parse(localStorage.getItem("th-history") || "[]")); } catch {}
    })();
  }, []);
  async function clear() {
    try { localStorage.removeItem("th-history"); } catch {}
    if (signedIn) await fetch("/api/history", { method: "DELETE" });
    setRows([]);
  }
  return (
    <main className="mx-auto max-w-3xl px-4 py-6"><h1 className="text-3xl font-bold">History</h1>
      <p className="mb-4 text-slate-500">{signedIn ? "Saved to your account." : "Saved on this device only. Log in to keep it across devices."}</p>
      {rows.length === 0 ? <p>No history yet. <Link className="underline" href="/tools">Open a tool</Link> and it will appear here.</p> : (
        <><ul className="space-y-2">{rows.map((r, i) => { const t = tools.find((x) => x.id === r.id); return t ? <li key={i} className="glass flex justify-between p-3"><Link className="font-medium underline" href={`/tools/${t.slug}`}>{t.name}</Link><span className="text-sm text-slate-500">{new Date(r.t).toLocaleString()}</span></li> : null; })}</ul>
        <button className="btn-ghost mt-4" onClick={clear}>Clear history</button></>)}
    </main>
  );
}
