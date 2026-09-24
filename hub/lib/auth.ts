import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { timingSafeEqual } from "crypto";

function key() {
  const s = process.env.AUTH_SECRET;
  if (!s && process.env.NODE_ENV === "production") throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(s || "dev-only-secret-change-me");
}
type Name = "session" | "admin";
export async function setCookie(name: Name, sub: string, days: number) {
  const token = await new SignJWT({ sub, role: name }).setProtectedHeader({ alg: "HS256" }).setExpirationTime(`${days}d`).sign(key());
  (await cookies()).set(name, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: days * 86400 });
}
export async function clearCookie(name: Name) { (await cookies()).delete(name); }
async function read(name: Name) {
  const v = (await cookies()).get(name)?.value;
  if (!v) return null;
  try { const { payload } = await jwtVerify(v, key()); return payload.role === name ? payload : null; } catch { return null; }
}
export async function userId() { return ((await read("session"))?.sub as string) ?? null; }
export async function isAdmin() { return !!(await read("admin")); }
export function checkAdminPassword(input: string) {
  const a = Buffer.from(input), b = Buffer.from(process.env.ADMIN_PASSWORD || "");
  return b.length > 0 && a.length === b.length && timingSafeEqual(a, b);
}
