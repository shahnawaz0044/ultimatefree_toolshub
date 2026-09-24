// In-memory limiter: fine for one instance. On Vercel, swap for Upstash Redis to share limits across instances.
const hits = new Map<string, number[]>();
export function limited(req: Request, bucket: string, max: number, windowMs = 60_000) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const k = `${bucket}:${ip}`, now = Date.now();
  const recent = (hits.get(k) ?? []).filter((t) => now - t < windowMs);
  recent.push(now); hits.set(k, recent);
  return recent.length > max;
}
