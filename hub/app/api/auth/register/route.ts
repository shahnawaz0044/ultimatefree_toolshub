import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { setCookie } from "@/lib/auth";
import { limited } from "@/lib/rate";

export async function POST(req: Request) {
  if (limited(req, "auth", 10)) return NextResponse.json({ error: "Too many attempts. Wait a minute." }, { status: 429 });
  const b = await req.json().catch(() => null);
  const email = String(b?.email ?? "").trim().toLowerCase(), password = String(b?.password ?? ""), name = String(b?.name ?? "").trim().slice(0, 80) || null;
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  if (password.length < 8 || password.length > 100) return NextResponse.json({ error: "Password must be 8 to 100 characters." }, { status: 400 });
  try {
    if (await db.user.findUnique({ where: { email } })) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    const u = await db.user.create({ data: { email, name, passwordHash: await bcrypt.hash(password, 10) } });
    await setCookie("session", u.id, 30);
  } catch { return NextResponse.json({ error: "Could not create the account. Please try again." }, { status: 500 }); }
  return NextResponse.json({ ok: true });
}
