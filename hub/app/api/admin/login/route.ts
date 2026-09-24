import { NextResponse } from "next/server";
import { checkAdminPassword, clearCookie, setCookie } from "@/lib/auth";
import { limited } from "@/lib/rate";

export async function POST(req: Request) {
  if (limited(req, "admin-login", 8, 5 * 60_000)) return NextResponse.json({ error: "Too many attempts. Wait a few minutes." }, { status: 429 });
  const b = await req.json().catch(() => null);
  if (!checkAdminPassword(String(b?.password ?? ""))) return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  await setCookie("admin", "admin", 7);
  return NextResponse.json({ ok: true });
}
export async function DELETE() { await clearCookie("admin"); return new Response(null, { status: 204 }); }
