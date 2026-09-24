"use client";
import { useCallback, useEffect, useState } from "react";

type Tool = { id: string; name: string; cat: string };
type Setting = { toolId: string; enabled: boolean; featured: boolean; seoTitle: string | null; seoDescription: string | null; adText: string | null; adUrl: string | null };
type Data = { users: number; usage: Record<string, { uses: number; downloads: number }>; messages: { id: string; name: string; email: string; message: string; createdAt: string }[]; posts: { id: string; title: string }[]; settings: Setting[]; tools: Tool[] };

const post = (url: string, method: string, body: unknown) => fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

export default function Admin() {
  const [data, setData] = useState<Data | null>(null);
  const [auth, setAuth] = useState<"loading" | "out" | "in">("loading");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  const [edit, setEdit] = useState<Setting | null>(null);
  const [q, setQ] = useState("");
  const [p, setP] = useState({ title: "", excerpt: "", body: "" });

  const load = useCallback(async () => {
    const r = await fetch("/api/admin/data");
    if (r.status === 401) return setAuth("out");
    if (r.ok) { setData(await r.json()); setAuth("in"); } else setMsg("Could not load data. Check DATABASE_URL and that the database schema is pushed.");
  }, []);
  useEffect(() => { load(); }, [load]);

  async function login() {
    const r = await post("/api/admin/login", "POST", { password: pw });
    if (r.ok) { setMsg(""); load(); } else setMsg((await r.json().catch(() => null))?.error || "Login failed.");
  }
  async function save() {
    if (!edit) return;
    const r = await post("/api/admin/data", "PUT", edit);
    setMsg(r.ok ? "Saved." : (await r.json().catch(() => null))?.error || "Could not save."); if (r.ok) { setEdit(null); load(); }
  }
  async function addPost() {
    const r = await post("/api/admin/posts", "POST", p);
    if (r.ok) { setP({ title: "", excerpt: "", body: "" }); setMsg("Post published."); load(); } else setMsg((await r.json().catch(() => null))?.error || "Could not save the post.");
  }
  const open = (t: Tool) => setEdit(data!.settings.find((s) => s.toolId === t.id) ?? { toolId: t.id, enabled: true, featured: false, seoTitle: null, seoDescription: null, adText: null, adUrl: null });

  if (auth === "loading") return <main className="mx-auto max-w-4xl px-4 py-6">Loading…</main>;
  if (auth === "out") return (
    <main className="mx-auto max-w-sm px-4 py-10"><h1 className="mb-4 text-2xl font-bold">Admin</h1>
      <input className="input mb-3" type="password" placeholder="Admin password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && login()} />
      {msg && <p role="alert" className="mb-3 text-red-500">{msg}</p>}<button className="btn w-full" onClick={login}>Log in</button></main>
  );
  const d = data!;
  const totals = Object.values(d.usage).reduce((a, u) => ({ uses: a.uses + u.uses, downloads: a.downloads + u.downloads }), { uses: 0, downloads: 0 });
  const rows = [...d.tools].filter((t) => t.name.toLowerCase().includes(q.toLowerCase())).sort((a, b) => (d.usage[b.id]?.uses ?? 0) - (d.usage[a.id]?.uses ?? 0));
  return (
    <main className="mx-auto max-w-5xl px-4 py-6 space-y-8">
      <div className="flex items-center justify-between"><h1 className="text-3xl font-bold">Admin dashboard</h1><button className="btn-ghost" onClick={async () => { await fetch("/api/admin/login", { method: "DELETE" }); setAuth("out"); }}>Log out</button></div>
      {msg && <p role="status" className="glass p-3">{msg}</p>}
      <section className="grid gap-4 sm:grid-cols-3">{[["Users", d.users], ["Tool uses", totals.uses], ["Downloads", totals.downloads]].map(([l, v]) => <div key={l as string} className="glass p-4"><div className="text-sm text-slate-500">{l}</div><div className="text-3xl font-bold">{v}</div></div>)}</section>
      <section><h2 className="mb-2 text-xl font-semibold">Tools: visibility, SEO and ads</h2>
        <p className="mb-2 text-sm text-slate-500">Tools themselves are code. To add a new tool, add it to the engine and the tool list, then manage it here.</p>
        <input className="input mb-3" placeholder="Filter tools" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="glass overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-2">Tool</th><th>Category</th><th>Uses</th><th>Downloads</th><th>Status</th><th /></tr></thead><tbody>
          {rows.map((t) => { const s = d.settings.find((x) => x.toolId === t.id); return (
            <tr key={t.id} className="border-t dark:border-white/10"><td className="p-2">{t.name}</td><td>{t.cat}</td><td>{d.usage[t.id]?.uses ?? 0}</td><td>{d.usage[t.id]?.downloads ?? 0}</td>
              <td>{s?.enabled === false ? "Hidden" : s?.featured ? "Featured" : "Live"}</td><td><button className="underline" onClick={() => open(t)}>Edit</button></td></tr>); })}</tbody></table></div>
        {edit && (
          <div className="glass mt-4 space-y-3 p-4"><h3 className="font-semibold">{d.tools.find((t) => t.id === edit.toolId)?.name}</h3>
            <label className="mr-4"><input type="checkbox" checked={edit.enabled} onChange={(e) => setEdit({ ...edit, enabled: e.target.checked })} /> Visible</label>
            <label><input type="checkbox" checked={edit.featured} onChange={(e) => setEdit({ ...edit, featured: e.target.checked })} /> Featured on homepage</label>
            {(["seoTitle", "seoDescription", "adText", "adUrl"] as const).map((k) => <input key={k} className="input" placeholder={{ seoTitle: "SEO title (max 70)", seoDescription: "SEO description (max 170)", adText: "Sponsor text (optional)", adUrl: "Sponsor link (https://…)" }[k]} value={edit[k] ?? ""} onChange={(e) => setEdit({ ...edit, [k]: e.target.value })} />)}
            <div className="flex gap-3"><button className="btn" onClick={save}>Save changes</button><button className="btn-ghost" onClick={() => setEdit(null)}>Cancel</button></div></div>)}
      </section>
      <section><h2 className="mb-2 text-xl font-semibold">Blog posts</h2>
        <div className="glass space-y-3 p-4"><input className="input" placeholder="Title" value={p.title} onChange={(e) => setP({ ...p, title: e.target.value })} /><input className="input" placeholder="Short summary" value={p.excerpt} onChange={(e) => setP({ ...p, excerpt: e.target.value })} /><textarea className="input min-h-[120px]" placeholder="Body (blank line between paragraphs)" value={p.body} onChange={(e) => setP({ ...p, body: e.target.value })} /><button className="btn" onClick={addPost}>Publish post</button></div>
        <ul className="mt-3 space-y-1">{d.posts.map((x) => <li key={x.id} className="flex justify-between"><span>{x.title}</span><button className="underline" onClick={async () => { await post("/api/admin/posts", "DELETE", { id: x.id }); load(); }}>Delete</button></li>)}</ul></section>
      <section><h2 className="mb-2 text-xl font-semibold">Contact messages</h2>
        {d.messages.length ? d.messages.map((m) => <div key={m.id} className="glass mb-2 p-3"><b>{m.name}</b> <span className="text-sm text-slate-500">{m.email} · {new Date(m.createdAt).toLocaleString()}</span><p className="whitespace-pre-wrap">{m.message}</p></div>) : <p className="text-slate-500">No messages yet.</p>}</section>
    </main>
  );
}
