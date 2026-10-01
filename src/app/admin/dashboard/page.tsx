import React from "react";
import Link from "next/link";
import { getSession } from "@/lib/cms/auth";
import { getCMSDashboardStats } from "@/lib/cms/store";

export default async function AdminDashboardPage() {
  const session = await getSession();
  const stats = await getCMSDashboardStats();

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 600, letterSpacing: "-0.03em", margin: "0 0 0.5rem 0" }}>
          Dashboard Redaksi
        </h2>
        <p style={{ color: "#666", fontSize: "0.875rem", margin: 0 }}>
          Ringkasan status konten, direktori mahasiswa, dan log publikasi STI 2026.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div className="admin-card" style={{ padding: "1.25rem", margin: 0 }}>
          <div style={{ fontSize: "0.75rem", color: "#666", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
            Total Mahasiswa
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.03em" }}>
            {stats.totalStudents}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#28a745", marginTop: "0.25rem" }}>
            {stats.consentedStudents} telah memberi consent publik
          </div>
        </div>

        <div className="admin-card" style={{ padding: "1.25rem", margin: 0 }}>
          <div style={{ fontSize: "0.75rem", color: "#666", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
            Katalog Proyek
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.03em" }}>
            {stats.totalProjects}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#666", marginTop: "0.25rem" }}>
            Karya & inisiatif
          </div>
        </div>

        <div className="admin-card" style={{ padding: "1.25rem", margin: 0 }}>
          <div style={{ fontSize: "0.75rem", color: "#666", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
            Kenangan & Cerita
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.03em" }}>
            {stats.totalMemories}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#666", marginTop: "0.25rem" }}>
            Arsip momen penting
          </div>
        </div>

        <div className="admin-card" style={{ padding: "1.25rem", margin: 0 }}>
          <div style={{ fontSize: "0.75rem", color: "#666", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
            Agenda & Kegiatan
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.03em" }}>
            {stats.totalEvents}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#666", marginTop: "0.25rem" }}>
            Milestone & rekam jejak
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Content Readiness Checklist */}
        <div className="admin-card" style={{ margin: 0 }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: "0 0 1rem 0", display: "flex", justifyContent: "space-between" }}>
            <span>Kesiapan Konten (Content Readiness)</span>
            <span style={{ fontSize: "0.75rem", fontWeight: 400, color: "#666" }}>Audit Otomatis</span>
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {stats.readiness.map((item) => (
              <div
                key={item.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.625rem 0.75rem",
                  backgroundColor: item.ready ? "#f9fcf9" : "#fffbfb",
                  border: `1px solid ${item.ready ? "#e2f0e4" : "#fae6e6"}`,
                  borderRadius: "4px",
                  fontSize: "0.8125rem",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: "#111" }}>{item.label}</div>
                  <div style={{ fontSize: "0.6875rem", color: "#666" }}>{item.detail}</div>
                </div>
                <div>
                  {item.ready ? (
                    <span className="admin-badge admin-badge-published">READY</span>
                  ) : (
                    <span className="admin-badge admin-badge-draft">MISSING</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log and Quick Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="admin-card" style={{ margin: 0 }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: "0 0 1rem 0" }}>
              Aksi Cepat Redaksi
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <Link href="/admin/students/new" className="admin-btn admin-btn-primary">
                + Tambah Mahasiswa
              </Link>
              <Link href="/admin/projects/new" className="admin-btn admin-btn-secondary">
                + Tambah Proyek
              </Link>
              <Link href="/admin/memories/new" className="admin-btn admin-btn-secondary">
                + Tambah Kenangan
              </Link>
              <Link href="/admin/media" className="admin-btn admin-btn-secondary">
                Unggah Berkas Media
              </Link>
            </div>
          </div>

          <div className="admin-card" style={{ margin: 0, flex: 1 }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: "0 0 1rem 0" }}>
              Log Aktivitas Terbaru
            </h3>
            {stats.recentLogs.length === 0 ? (
              <div style={{ fontSize: "0.8125rem", color: "#888", fontStyle: "italic" }}>
                Belum ada aktivitas tercatat di sistem.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {stats.recentLogs.slice(0, 5).map((log) => (
                  <div
                    key={log.id}
                    style={{
                      fontSize: "0.75rem",
                      paddingBottom: "0.5rem",
                      borderBottom: "1px solid rgba(0,0,0,0.04)",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <strong>{log.actorEmail}</strong> · {log.action} {log.entity} (
                      <code>{log.entityId}</code>)
                    </div>
                    <div style={{ color: "#888" }}>
                      {new Date(log.createdAt).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
