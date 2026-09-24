import type { Metadata } from "next";
export const metadata: Metadata = { title: "About", description: "About Tools Hub: free, private, browser-based tools.", alternates: { canonical: "/about" } };
export default function Page() {
  return <main className="mx-auto max-w-3xl px-4 py-6"><h1 className="mb-4 text-3xl font-bold">About</h1>
    <p className="mb-3">Tools Hub is a collection of free tools for everyday work. Every tool is free, needs no account, and has no usage limits.</p>
    <p>Tools run inside your browser, so your files and text stay on your device. An optional account only saves your tool history across devices.</p></main>;
}
