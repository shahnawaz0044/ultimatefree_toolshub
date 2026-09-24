import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";
import { SITE } from "@/lib/tools";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "Ultimate Productivity Tools Hub: Free Online Tools", template: "%s | Tools Hub" },
  description: "Free online tools for images, PDFs, developers, business and daily life. No sign-up. Files stay on your device.",
};

const themeScript = `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body>
        <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <Link href="/" className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-lg font-extrabold text-transparent">Tools Hub</Link>
          <nav className="flex flex-wrap items-center gap-4 text-sm">
            <Link href="/tools">All tools</Link><Link href="/categories">Categories</Link><Link href="/blog">Blog</Link>
            <Link href="/history">History</Link><Link href="/dashboard">Account</Link><ThemeToggle />
          </nav>
        </header>
        {children}
        <footer className="mx-auto mt-16 max-w-6xl px-4 pb-10 text-sm text-slate-500">
          <div className="flex flex-wrap gap-4"><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/blog">Resources</Link></div>
          <p className="mt-3">Tools run in your browser. Your files are not uploaded. No account needed.</p>
        </footer>
      </body>
    </html>
  );
}
