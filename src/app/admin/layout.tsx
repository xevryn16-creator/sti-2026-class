import React from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { getSession } from "@/lib/cms/auth";
import AdminNav from "@/components/admin/AdminNav";
import PublishStatusNotice from "@/components/admin/PublishStatusNotice";
import "@/styles/admin.css";

export const metadata: Metadata = {
  // `absolute` avoids inheriting the public `%s | STI 2026` template, which
  // would otherwise duplicate the brand suffix in the admin tab title.
  title: { absolute: "STI 2026 — Content Management System" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const isLoginRoute =
    (await headers()).get("x-sti-admin-login-route") === "1";

  if (!session) {
    // The login page owns its own presentation.
    if (isLoginRoute) {
      return <div className="admin-login-wrapper">{children}</div>;
    }

    // Defense in depth: middleware already redirects unauthenticated requests.
    // If we ever get here without a valid session we must NOT render `children`,
    // since admin pages read unconsented/draft content straight from the store.
    return (
      <div className="admin-login-wrapper">
        <div className="admin-card" style={{ maxWidth: "420px", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 600, margin: "0 0 0.5rem 0" }}>
            Sesi tidak valid
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#666", margin: "0 0 1.25rem 0" }}>
            Sesi Anda telah berakhir atau belum terautentikasi. Silakan masuk kembali
            untuk mengakses panel redaksi.
          </p>
          <a href="/admin/login" className="admin-btn admin-btn-primary">
            Masuk ke Portal Redaksi
          </a>
        </div>
      </div>
    );
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
        <div className="admin-body">
          <PublishStatusNotice />
          {children}
        </div>
      </main>
    </div>
  );
}
