import data from "./tools-data.json";
import { db } from "./db";

export type Tool = { id: string; slug: string; cat: string; name: string; desc: string };
export const TOOLS = data as Tool[];
export const CATEGORIES = [...new Set(TOOLS.map((t) => t.cat))];
export const catSlug = (c: string) => c.toLowerCase().replace(/[^a-z]+/g, "-");
export const catBySlug = (s: string) => CATEGORIES.find((c) => catSlug(c) === s);
export const toolBySlug = (s: string) => TOOLS.find((t) => t.slug === s);
export const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export type Setting = { toolId: string; enabled: boolean; featured: boolean; seoTitle: string | null; seoDescription: string | null; adText: string | null; adUrl: string | null };
export async function settings(): Promise<Record<string, Setting>> {
  try { return Object.fromEntries((await db.toolSetting.findMany()).map((s) => [s.toolId, s])); } catch { return {}; }
}
export async function visibleTools() {
  const s = await settings();
  return TOOLS.filter((t) => s[t.id]?.enabled !== false);
}
export async function trendingIds(): Promise<string[]> {
  try {
    const rows = await db.event.groupBy({ by: ["toolId"], where: { createdAt: { gte: new Date(Date.now() - 7 * 864e5) } }, _count: { toolId: true }, orderBy: { _count: { toolId: "desc" } }, take: 6 });
    return rows.map((r) => r.toolId);
  } catch { return []; }
}
export function faqFor(t: Tool) {
  return [
    [`Is ${t.name} free?`, "Yes. There is no sign-up, no limit and no payment."],
    ["Are my files uploaded to a server?", "No. The tool runs in your browser, so your files and text stay on your device."],
    ["Does it work on my phone?", "Yes. It works in current versions of Chrome, Edge, Safari and Firefox on desktop and mobile."],
  ] as [string, string][];
}
export function relatedTo(t: Tool, list: Tool[]) { return list.filter((x) => x.cat === t.cat && x.id !== t.id).slice(0, 4); }
