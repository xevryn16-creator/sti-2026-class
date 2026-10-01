import React from "react";
import type { Metadata } from "next";
import { getSession } from "@/lib/cms/auth";
import AdminNav from "@/components/admin/AdminNav";
import "@/styles/admin.css";

export const metadata: Metadata = {
  title: "STI 2026 — Content Management System",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // If on /admin/login or unauthenticated, let the page handle its presentation
  if (!session) {
    return <div className="admin-login-wrapper">{children}</div>;
  }

  return (
    <div className="admin-shell">
      <AdminNav user={session.user} />
      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-breadcrumb">
            <span style={{ fontSize: "0.8125rem", color: "#666" }}>
              STI 2026 Yearbook & Portfolio
            </span>
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="admin-btn admin-btn-secondary"
              style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}
            >
              Lihat Public Site ↗
            </a>
          </div>
        </header>
        <div className="admin-body">{children}</div>
      </main>
    </div>
  );
}
