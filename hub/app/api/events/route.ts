import { db } from "@/lib/db";
import { userId } from "@/lib/auth";
import { limited } from "@/lib/rate";
import { TOOLS } from "@/lib/tools";

export async function POST(req: Request) {
  if (limited(req, "events", 120)) return new Response(null, { status: 429 });
  const b = await req.json().catch(() => null);
  if (!b || !TOOLS.some((t) => t.id === b.toolId) || !["use", "download"].includes(b.type)) return new Response(null, { status: 400 });
  try {
    await db.event.create({ data: { toolId: b.toolId, type: b.type } });
    if (b.type === "use") { const u = await userId(); if (u) await db.history.create({ data: { userId: u, toolId: b.toolId } }); }
  } catch { /* analytics must never break a tool */ }
  return new Response(null, { status: 204 });
}
