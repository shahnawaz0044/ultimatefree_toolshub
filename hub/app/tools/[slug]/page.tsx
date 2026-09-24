import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ToolFrame from "@/components/ToolFrame";
import ToolCard from "@/components/ToolCard";
import { TOOLS, SITE, catSlug, faqFor, relatedTo, settings, toolBySlug, visibleTools } from "@/lib/tools";

export const revalidate = 300;
type P = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return TOOLS.map((t) => ({ slug: t.slug })); }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const t = toolBySlug((await params).slug);
  if (!t) return {};
  const s = (await settings())[t.id];
  const title = s?.seoTitle || `${t.name}: Free Online Tool`;
  const description = s?.seoDescription || `${t.desc} Free, no sign-up, and runs in your browser.`;
  return { title, description, alternates: { canonical: `/tools/${t.slug}` }, openGraph: { title, description, url: `${SITE}/tools/${t.slug}` } };
}

export default async function Page({ params }: P) {
  const t = toolBySlug((await params).slug);
  if (!t) notFound();
  const s = (await settings())[t.id];
  if (s?.enabled === false) notFound();
  const faq = faqFor(t);
  const related = relatedTo(t, await visibleTools());
  const ld = [
    { "@context": "https://schema.org", "@type": "WebApplication", name: t.name, description: t.desc, url: `${SITE}/tools/${t.slug}`, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
  ];
  return (
    <main className="mx-auto max-w-4xl px-4 py-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <nav className="text-sm text-slate-500"><Link href="/tools">Tools</Link> / <Link href={`/categories/${catSlug(t.cat)}`}>{t.cat}</Link></nav>
      <h1 className="mt-2 text-3xl font-bold">{t.name}</h1>
      <p className="mb-4 text-slate-500">{t.desc}</p>
      {s?.adText && s.adUrl && <a href={s.adUrl} rel="sponsored noopener noreferrer" target="_blank" className="glass mb-4 block p-3 text-sm">Sponsored: {s.adText}</a>}
      <div className="glass p-2"><ToolFrame id={t.id} title={t.name} /></div>
      <h2 className="mt-8 text-xl font-semibold">How to use {t.name}</h2>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-slate-600 dark:text-slate-300"><li>Add your file or enter your text or values.</li><li>Adjust the options if you want to.</li><li>Run the tool, check the result, then download or copy it.</li></ol>
      <h2 className="mt-8 text-xl font-semibold">Questions</h2>
      {faq.map(([q, a]) => <details key={q} className="border-b py-3 dark:border-white/10"><summary className="cursor-pointer font-medium">{q}</summary><p className="mt-2 text-slate-500">{a}</p></details>)}
      {related.length > 0 && <><h2 className="mt-8 mb-3 text-xl font-semibold">Related tools</h2><div className="grid gap-4 sm:grid-cols-2">{related.map((r) => <ToolCard key={r.id} t={r} />)}</div></>}
    </main>
  );
}
