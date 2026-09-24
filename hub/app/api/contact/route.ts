import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { limited } from "@/lib/rate";

export async function POST(req: Request) {
  if (limited(req, "contact", 5, 10 * 60_000)) return NextResponse.json({ error: "Too many messages. Try again later." }, { status: 429 });
  const b = await req.json().catch(() => null);
  const name = String(b?.name ?? "").trim().slice(0, 100), email = String(b?.email ?? "").trim().slice(0, 200), message = String(b?.message ?? "").trim().slice(0, 4000);
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || message.length < 5) return NextResponse.json({ error: "Enter your name, a valid email and a message." }, { status: 400 });
  try { await db.message.create({ data: { name, email, message } }); } catch { return NextResponse.json({ error: "Could not save your message. Please try again later." }, { status: 500 }); }
  return NextResponse.json({ ok: true });
}
