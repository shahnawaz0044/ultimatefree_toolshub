import Link from "next/link";
import type { Tool } from "@/lib/tools";
export default function ToolCard({ t }: { t: Pick<Tool, "slug" | "name" | "desc" | "cat"> }) {
  return (
    <Link href={`/tools/${t.slug}`} className="glass block p-4 transition hover:-translate-y-0.5 hover:border-blue-500">
      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{t.cat}</span>
      <b className="block">{t.name}</b>
      <span className="text-sm text-slate-500">{t.desc}</span>
    </Link>
  );
}
