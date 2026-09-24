import type { Metadata } from "next";
import Link from "next/link";
import { allPosts } from "@/lib/posts";
export const metadata: Metadata = { title: "Blog & Resources", description: "Guides for working with images, PDFs and files.", alternates: { canonical: "/blog" } };
export const revalidate = 300;
export default async function Page() {
  const posts = await allPosts();
  return <main className="mx-auto max-w-3xl px-4 py-6"><h1 className="mb-4 text-3xl font-bold">Blog & resources</h1>
    {posts.map((p) => <Link key={p.slug} href={`/blog/${p.slug}`} className="glass mb-4 block p-5"><b className="text-lg">{p.title}</b><span className="block text-sm text-slate-500">{p.createdAt}</span><span className="block">{p.excerpt}</span></Link>)}</main>;
}
