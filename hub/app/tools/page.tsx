import type { Metadata } from "next";
import ToolSearch from "@/components/ToolSearch";
import { CATEGORIES, visibleTools } from "@/lib/tools";
export const metadata: Metadata = { title: "All Free Online Tools", description: "Browse every free tool: images, PDF, text, developer, marketing, business and daily life.", alternates: { canonical: "/tools" } };
export const revalidate = 300;
export default async function Page() {
  const tools = await visibleTools();
  return <main className="mx-auto max-w-6xl px-4 py-6"><h1 className="mb-4 text-3xl font-bold">All tools</h1><ToolSearch tools={tools.map(({ slug, name, desc, cat }) => ({ slug, name, desc, cat }))} categories={CATEGORIES} /></main>;
}
