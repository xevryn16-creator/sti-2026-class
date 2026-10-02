"use client";

import React, { useActionState, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { loginAction } from "@/app/admin/actions/auth";
import { sanitizeAdminRedirect } from "@/lib/cms/redirect";

export default function AdminLoginPage() {
  const searchParams = useSearchParams();
  const redirectTo = sanitizeAdminRedirect(searchParams.get("redirect"));

  const [state, formAction, isPending] = useActionState(loginAction, undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const fillDev = (devEmail: string, devPass: string) => {
    setEmail(devEmail);
    setPassword(devPass);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f6f4f1",
        padding: "1.5rem",
      }}
    >
      <div
        className="admin-card"
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          padding: "2.5rem 2rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div className="admin-logo-badge">ITB · STI 2026</div>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 500,
              letterSpacing: "-0.03em",
              margin: "0.25rem 0 0.5rem 0",
            }}
          >
            Masuk Portal Redaksi
          </h1>
          <p style={{ fontSize: "0.8125rem", color: "#666", margin: 0 }}>
            Akses autentikasi untuk pengelola direktori & konten STI 2026.
          </p>
        </div>

        {state?.error && (
          <div
            style={{
              backgroundColor: "#fdeded",
              color: "#5f2120",
              border: "1px solid #f5c2c7",
              borderRadius: "4px",
              padding: "0.75rem",
              fontSize: "0.8125rem",
              marginBottom: "1.25rem",
            }}
          >
            {state.error}
          </div>
        )}

        <form action={formAction}>
          <input type="hidden" name="redirectTo" value={redirectTo} />

          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="email">
              Alamat Email ITB / Redaksi
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="admin-form-input"
              placeholder="nama@sti2026.itb.ac.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="password">
              Kata Sandi
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="admin-form-input"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="admin-btn admin-btn-primary"
            style={{ width: "100%", padding: "0.75rem", marginTop: "0.5rem" }}
          >
            {isPending ? "Memverifikasi..." : "Masuk ke Panel Redaksi"}
          </button>

          {/* Quick-fill Dev Login Credentials */}
          <div
            style={{
              marginTop: "1.5rem",
              padding: "0.875rem",
              backgroundColor: "#f9f8f6",
              borderRadius: "6px",
              border: "1px dashed #d1ceca",
              fontSize: "0.8125rem",
            }}
          >
            <div style={{ fontWeight: 500, color: "#111", marginBottom: "0.25rem" }}>
              ⚡ Dev Login (1-Klik Isi Kredensial)
            </div>
            <p style={{ margin: "0 0 0.625rem 0", color: "#666", fontSize: "0.75rem", lineHeight: 1.4 }}>
              Pilih peran akun pengembang di bawah untuk langsung mengisi formulir:
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                type="button"
                onClick={() => fillDev("admin@sti2026.itb.ac.id", "AdminSTI2026!Editorial")}
                style={{
                  flex: 1,
                  padding: "0.45rem 0.5rem",
                  fontSize: "0.75rem",
                  borderRadius: "200px",
                  border: "1px solid #000",
                  backgroundColor: "#000",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Akun Admin
              </button>
              <button
                type="button"
                onClick={() => fillDev("editor@sti2026.itb.ac.id", "EditorSTI2026!Content")}
                style={{
                  flex: 1,
                  padding: "0.45rem 0.5rem",
                  fontSize: "0.75rem",
                  borderRadius: "200px",
                  border: "1px solid #ccc",
                  backgroundColor: "#fff",
                  color: "#111",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Akun Editor
              </button>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "1.25rem" }}>
            <Link
              href="/"
              style={{
                fontSize: "0.8125rem",
                color: "#666",
                textDecoration: "underline",
                textUnderlineOffset: "4px",
              }}
            >
              ← Kembali ke Beranda Situs
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
