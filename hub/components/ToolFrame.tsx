"use client";
import { useEffect, useRef, useState } from "react";

function record(id: string, type: "use" | "download") {
  try {
    if (type === "use") {
      const h = JSON.parse(localStorage.getItem("th-history") || "[]");
      localStorage.setItem("th-history", JSON.stringify([{ id, t: Date.now() }, ...h].slice(0, 100)));
    }
  } catch {}
  fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ toolId: id, type }) }).catch(() => {});
}

export default function ToolFrame({ id, title }: { id: string; title: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const last = useRef(0);
  const [src, setSrc] = useState("");
  const [h, setH] = useState(560);
  const theme = () => (document.documentElement.classList.contains("dark") ? "dark" : "light");

  useEffect(() => {
    setSrc(`/engine.html?embed=1&theme=${theme()}#${id}`);
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== location.origin || e.source !== ref.current?.contentWindow) return;
      const d = e.data;
      if (d?.type === "height") setH(Math.max(320, Math.min(4000, d.h)));
      if (d?.type === "used" && Date.now() - last.current > 15000) { last.current = Date.now(); record(id, "use"); }
      if (d?.type === "download") record(id, "download");
    };
    const onTheme = () => ref.current?.contentWindow?.postMessage({ type: "theme", v: theme() }, location.origin);
    window.addEventListener("message", onMsg);
    window.addEventListener("themechange", onTheme);
    return () => { window.removeEventListener("message", onMsg); window.removeEventListener("themechange", onTheme); };
  }, [id]);

  return <iframe ref={ref} src={src || undefined} title={title} style={{ height: h }} className="w-full border-0" allow="microphone; clipboard-write" />;
}
