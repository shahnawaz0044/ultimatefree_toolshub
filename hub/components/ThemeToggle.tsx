"use client";
export default function ThemeToggle() {
  return (
    <button aria-label="Toggle dark mode" className="btn-ghost !px-3 !py-1" onClick={() => {
      const d = document.documentElement.classList.toggle("dark");
      try { localStorage.setItem("theme", d ? "dark" : "light"); } catch {}
      window.dispatchEvent(new Event("themechange"));
    }}>Light / Dark</button>
  );
}
