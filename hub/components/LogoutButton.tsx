"use client";
import { useRouter } from "next/navigation";
export default function LogoutButton() {
  const r = useRouter();
  return <button className="btn-ghost" onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); r.push("/"); r.refresh(); }}>Log out</button>;
}
