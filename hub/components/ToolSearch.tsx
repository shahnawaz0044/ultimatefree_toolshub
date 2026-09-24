"use client";
import { useState } from "react";
import ToolCard from "./ToolCard";
type T = { slug: string; name: string; desc: string; cat: string };
export default function ToolSearch({ tools, categories }: { tools: T[]; categories: string[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const list = tools.filter((t) => (cat === "All" || t.cat === cat) && `${t.name} ${t.desc} ${t.cat}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <input className="input !p-4 text-lg" type="search" aria-label="Search tools" placeholder={`Search ${tools.length} tools`} value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="my-4 flex flex-wrap gap-2">
        {["All", ...categories].map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`rounded-full border px-3 py-1 text-sm ${c === cat ? "border-transparent bg-gradient-to-r from-blue-600 to-purple-600 text-white" : "border-slate-300 dark:border-white/20"}`}>{c}</button>
        ))}
      </div>
      {list.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map((t) => <ToolCard key={t.slug} t={t} />)}</div> : <p>No tools match. Try a shorter search or choose All.</p>}
    </div>
  );
}
