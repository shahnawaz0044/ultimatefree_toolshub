import type { MetadataRoute } from "next";
import { CATEGORIES, SITE, TOOLS, catSlug } from "@/lib/tools";
import { allPosts } from "@/lib/posts";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await allPosts();
  const u = (p: string) => ({ url: `${SITE}${p}` });
  return [u("/"), u("/tools"), u("/categories"), u("/blog"), u("/about"), u("/contact"),
    ...CATEGORIES.map((c) => u(`/categories/${catSlug(c)}`)), ...TOOLS.map((t) => u(`/tools/${t.slug}`)), ...posts.map((p) => u(`/blog/${p.slug}`))];
}
