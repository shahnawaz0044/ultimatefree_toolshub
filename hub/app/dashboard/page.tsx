import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { db } from "@/lib/db";
import { userId } from "@/lib/auth";
import { toolBySlug, TOOLS } from "@/lib/tools";
export const metadata: Metadata = { title: "Your dashboard", robots: { index: false } };
export const dynamic = "force-dynamic";
export default async function Page() {
  const id = await userId();
  if (!id) redirect("/login");
  const user = await db.user.findUnique({ where: { id }, select: { email: true, name: true } });
  if (!user) redirect("/login");
  const recent = await db.history.findMany({ where: { userId: id }, orderBy: { createdAt: "desc" }, take: 10 });
  const counts = await db.history.groupBy({ by: ["toolId"], where: { userId: id }, _count: { toolId: true }, orderBy: { _count: { toolId: "desc" } }, take: 5 });
  const name = (tid: string) => TOOLS.find((t) => t.id === tid);
  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <div className="flex items-center justify-between"><h1 className="text-3xl font-bold">Hello{user.name ? `, ${user.name}` : ""}</h1><LogoutButton /></div>
      <p className="text-slate-500">{user.email}</p>
      <h2 className="mt-6 mb-2 text-xl font-semibold">Your most used tools</h2>
      {counts.length ? <ul className="space-y-1">{counts.map((c) => { const t = name(c.toolId); return t ? <li key={c.toolId}><Link className="underline" href={`/tools/${t.slug}`}>{t.name}</Link> ({c._count.toolId} uses)</li> : null; })}</ul> : <p className="text-slate-500">Nothing yet. Use a tool while logged in and it will show up here.</p>}
      <h2 className="mt-6 mb-2 text-xl font-semibold">Recent activity</h2>
      <ul className="space-y-1">{recent.map((h) => { const t = name(h.toolId); return t ? <li key={h.id}><Link className="underline" href={`/tools/${t.slug}`}>{t.name}</Link> <span className="text-sm text-slate-500">{h.createdAt.toLocaleString()}</span></li> : null; })}</ul>
      <p className="mt-6"><Link href="/history" className="underline">Full history</Link></p>
    </main>
  );
}
