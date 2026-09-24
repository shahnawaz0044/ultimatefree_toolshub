import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => null);
  const title = String(b?.title ?? "").trim().slice(0, 150), excerpt = String(b?.excerpt ?? "").trim().slice(0, 300), body = String(b?.body ?? "").trim();
  if (!title || !excerpt || !body) return NextResponse.json({ error: "Title, summary and body are required." }, { status: 400 });
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "post";
  try { await db.post.create({ data: { slug: `${base}-${Date.now().toString(36)}`, title, excerpt, body } }); } catch { return NextResponse.json({ error: "Could not save the post." }, { status: 500 }); }
  revalidatePath("/blog");
  return NextResponse.json({ ok: true });
}
export async function DELETE(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => null);
  await db.post.delete({ where: { id: String(b?.id ?? "") } }).catch(() => {});
  revalidatePath("/blog");
  return new Response(null, { status: 204 });
}
