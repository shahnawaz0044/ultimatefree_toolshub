import { clearCookie } from "@/lib/auth";
export async function POST() { await clearCookie("session"); return new Response(null, { status: 204 }); }
