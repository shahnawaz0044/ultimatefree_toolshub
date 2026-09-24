import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ToolCard from "@/components/ToolCard";
import { CATEGORIES, catBySlug, catSlug, visibleTools } from "@/lib/tools";
export const revalidate = 300;
type P = { params: Promise<{ cat: string }> };
export function generateStaticParams() { return CATEGORIES.map((c) => ({ cat: catSlug(c) })); }
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const c = catBySlug((await params).cat);
  return c ? { title: `Free ${c} Tools`, description: `Free online ${c.toLowerCase()} tools that run in your browser.`, alternates: { canonical: `/categories/${catSlug(c)}` } } : {};
}
export default async function Page({ params }: P) {
  const c = catBySlug((await params).cat);
  if (!c) notFound();
  const tools = (await visibleTools()).filter((t) => t.cat === c);
  return <main className="mx-auto max-w-6xl px-4 py-6"><h1 className="mb-4 text-3xl font-bold">{c} tools</h1><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{tools.map((t) => <ToolCard key={t.id} t={t} />)}</div></main>;
}
