import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allPosts } from "@/lib/posts";
export const revalidate = 300;
type P = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const p = (await allPosts()).find((x) => x.slug === (await params).slug);
  return p ? { title: p.title, description: p.excerpt, alternates: { canonical: `/blog/${p.slug}` } } : {};
}
export default async function Page({ params }: P) {
  const { slug } = await params;
  const posts = await allPosts();

  const p = posts.find((x) => x.slug === slug);
  if (!p) notFound();
  return <main className="mx-auto max-w-3xl px-4 py-6"><h1 className="text-3xl font-bold">{p.title}</h1><p className="mb-6 text-sm text-slate-500">{p.createdAt}</p>
    {p.body.split("\n\n").map((para, i) => <p key={i} className="mb-4 leading-relaxed">{para}</p>)}</main>;
}
