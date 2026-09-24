import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, TOOLS, catSlug } from "@/lib/tools";
export const metadata: Metadata = { title: "Tool Categories", description: "Free online tools grouped by category.", alternates: { canonical: "/categories" } };
export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6"><h1 className="mb-4 text-3xl font-bold">Categories</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{CATEGORIES.map((c) => (
        <Link key={c} href={`/categories/${catSlug(c)}`} className="glass block p-5"><b className="text-lg">{c}</b><span className="block text-sm text-slate-500">{TOOLS.filter((t) => t.cat === c).length} tools</span></Link>))}</div></main>
  );
}
