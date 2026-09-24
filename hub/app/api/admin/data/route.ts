import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { TOOLS } from "@/lib/tools";

const clean = (v: unknown, max: number) => { const s = String(v ?? "").trim().slice(0, max); return s || null; };

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [users, byTool, messages, posts, settings] = await Promise.all([
    db.user.count(),
    db.event.groupBy({ by: ["toolId", "type"], _count: { _all: true } }),
    db.message.findMany({ orderBy: { createdAt: "desc" }, take: 30 }),
    db.post.findMany({ orderBy: { createdAt: "desc" } }),
    db.toolSetting.findMany(),
  ]);
  const usage: Record<string, { uses: number; downloads: number }> = {};
  for (const r of byTool) { usage[r.toolId] ??= { uses: 0, downloads: 0 }; if (r.type === "use") usage[r.toolId].uses = r._count._all; else usage[r.toolId].downloads = r._count._all; }
  return NextResponse.json({ users, usage, messages, posts, settings, tools: TOOLS });
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => null);
  if (!b || !TOOLS.some((t) => t.id === b.toolId)) return NextResponse.json({ error: "Unknown tool." }, { status: 400 });
  const adUrl = clean(b.adUrl, 500);
  if (adUrl && !/^https?:\/\//i.test(adUrl)) return NextResponse.json({ error: "Ad link must start with http:// or https://" }, { status: 400 });
  const data = { enabled: b.enabled !== false, featured: !!b.featured, seoTitle: clean(b.seoTitle, 70), seoDescription: clean(b.seoDescription, 170), adText: clean(b.adText, 140), adUrl };
  await db.toolSetting.upsert({ where: { toolId: b.toolId }, create: { toolId: b.toolId, ...data }, update: data });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
