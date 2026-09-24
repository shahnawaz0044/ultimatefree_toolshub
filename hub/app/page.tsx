import Link from "next/link";
import ToolSearch from "@/components/ToolSearch";
import ToolCard from "@/components/ToolCard";
import { CATEGORIES, catSlug, settings, trendingIds, visibleTools, faqFor, TOOLS } from "@/lib/tools";

export const revalidate = 300;

export default async function Home() {
  const [tools, s, trending] = await Promise.all([visibleTools(), settings(), trendingIds()]);
  const byId = new Map(tools.map((t) => [t.id, t]));
  const featured = tools.filter((t) => s[t.id]?.featured);
  const popular = (featured.length ? featured : ["convert", "compress", "pdf-merge", "qr", "json-formatter", "password"].map((i) => byId.get(i)!).filter(Boolean)).slice(0, 6);
  const trend = (trending.length ? trending.map((i) => byId.get(i)!).filter(Boolean) : tools.slice(6, 12)).slice(0, 6);
  const recent = tools.slice(-6).reverse();
  const faq = faqFor(TOOLS[0]).slice(1);
  return (
    <main className="mx-auto max-w-6xl px-4">
      <section className="max-w-3xl py-10">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Free online tools for work, business and creativity</h1>
        <p className="mt-4 mb-6 text-lg text-slate-500">Convert files, create content, work with PDFs and code, and run everyday calculations. No sign-up, and your files never leave your browser.</p>
        <ToolSearch tools={tools.map(({ slug, name, desc, cat }) => ({ slug, name, desc, cat }))} categories={CATEGORIES} />
      </section>
      {[["Popular tools", popular], ["Trending this week", trend], ["Recently added", recent]].map(([title, list]) => (
        <section key={title as string} className="mt-10"><h2 className="mb-3 text-2xl font-bold">{title as string}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{(list as typeof tools).map((t) => <ToolCard key={t.id} t={t} />)}</div></section>
      ))}
      <section className="mt-10"><h2 className="mb-3 text-2xl font-bold">Categories</h2>
        <div className="flex flex-wrap gap-3">{CATEGORIES.map((c) => <Link key={c} href={`/categories/${catSlug(c)}`} className="btn-ghost">{c}</Link>)}</div></section>
      <section className="mt-10 max-w-3xl"><h2 className="mb-3 text-2xl font-bold">Questions</h2>
        {faq.map(([q, a]) => <details key={q} className="border-b py-3 dark:border-white/10"><summary className="cursor-pointer font-medium">{q}</summary><p className="mt-2 text-slate-500">{a}</p></details>)}</section>
    </main>
  );
}
