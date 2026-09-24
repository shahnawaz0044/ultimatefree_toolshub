import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { setCookie } from "@/lib/auth";
import { limited } from "@/lib/rate";

export async function POST(req: Request) {
  if (limited(req, "auth", 10)) return NextResponse.json({ error: "Too many attempts. Wait a minute." }, { status: 429 });
  const b = await req.json().catch(() => null);
  const email = String(b?.email ?? "").trim().toLowerCase(), password = String(b?.password ?? "");
  try {
    const u = await db.user.findUnique({ where: { email } });
    if (!u || !(await bcrypt.compare(password, u.passwordHash))) return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
    await setCookie("session", u.id, 30);
  } catch { return NextResponse.json({ error: "Could not log in. Please try again." }, { status: 500 }); }
  return NextResponse.json({ ok: true });
}
