import { db } from "./db";
export type PostT = { slug: string; title: string; excerpt: string; body: string; createdAt: string };
const SEED: PostT[] = [
  { slug: "compress-images-without-losing-quality", title: "How to compress images without visible quality loss", excerpt: "Pick the right format and quality setting so pages load faster.", createdAt: "2026-09-01", body: "For photos, JPG or WEBP at 70 to 80 percent quality usually looks identical to the original at a fraction of the size.\n\nFor screenshots and logos, PNG keeps text sharp.\n\nResize first: an image shown at 800 pixels wide gains nothing from 4000 pixels of data. Use the Image Resizer, then the Image Compressor." },
  { slug: "merge-and-split-pdfs-privately", title: "Merge and split PDFs without uploading them", excerpt: "Why browser-based PDF tools keep sensitive documents on your device.", createdAt: "2026-09-08", body: "Most online PDF tools upload your file to a server. Tools that run in your browser never send the file anywhere.\n\nUse the PDF Merger to combine files, and the PDF Splitter to keep only the pages you need, such as 1-3, 5." },
];
export async function allPosts(): Promise<PostT[]> {
  try {
    const rows = await db.post.findMany({ orderBy: { createdAt: "desc" } });
    return [...rows.map((r) => ({ slug: r.slug, title: r.title, excerpt: r.excerpt, body: r.body, createdAt: r.createdAt.toISOString().slice(0, 10) })), ...SEED];
  } catch { return SEED; }
}
