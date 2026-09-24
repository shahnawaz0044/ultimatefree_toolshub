import type { MetadataRoute } from "next";
import { SITE } from "@/lib/tools";
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/dashboard"] }, sitemap: `${SITE}/sitemap.xml` };
}
