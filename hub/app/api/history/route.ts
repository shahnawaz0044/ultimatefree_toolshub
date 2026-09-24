import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userId } from "@/lib/auth";

export async function GET() {
  const u = await userId();
  if (!u) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  return NextResponse.json(await db.history.findMany({ where: { userId: u }, orderBy: { createdAt: "desc" }, take: 100, select: { toolId: true, createdAt: true } }));
}
export async function DELETE() {
  const u = await userId();
  if (!u) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  await db.history.deleteMany({ where: { userId: u } });
  return new Response(null, { status: 204 });
}
