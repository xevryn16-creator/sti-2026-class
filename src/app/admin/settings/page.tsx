import React from "react";
import { getSession } from "@/lib/cms/auth";
import { getAuditLogs } from "@/lib/cms/store";

export default async function AdminSettingsPage() {
  const session = await getSession();
  const logs = await getAuditLogs(50);

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 600, letterSpacing: "-0.03em", margin: "0 0 0.25rem 0" }}>
          Pengaturan Sistem & Log Audit
        </h2>
        <p style={{ color: "#666", fontSize: "0.8125rem", margin: 0 }}>
          Informasi konfigurasi database, status autentikasi, dan riwayat aktivitas redaksi.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
        {/* System Status Card */}
        <div className="admin-card" style={{ margin: 0 }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: "0 0 1rem 0" }}>
            Status Lingkungan & Konektivitas
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
            <div style={{ padding: "0.75rem", backgroundColor: "#faf9f7", borderRadius: "4px" }}>
              <div style={{ fontSize: "0.6875rem", color: "#666", textTransform: "uppercase" }}>
                Mode Database
              </div>
              <div style={{ fontWeight: 600, fontSize: "0.875rem", marginTop: "0.25rem" }}>
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? "Supabase PostgreSQL" : "Local JSON File Store (Development)"}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#666", marginTop: "0.25rem" }}>
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? "Tersambung ke cloud database" : "Fallback aman untuk testing & development offline"}
              </div>
            </div>

            <div style={{ padding: "0.75rem", backgroundColor: "#faf9f7", borderRadius: "4px" }}>
              <div style={{ fontSize: "0.6875rem", color: "#666", textTransform: "uppercase" }}>
                Sesi Aktif
              </div>
              <div style={{ fontWeight: 600, fontSize: "0.875rem", marginTop: "0.25rem" }}>
                {session?.user.name} ({session?.user.role})
              </div>
              <div style={{ fontSize: "0.75rem", color: "#666", marginTop: "0.25rem" }}>
                {session?.user.email}
              </div>
            </div>

            <div style={{ padding: "0.75rem", backgroundColor: "#faf9f7", borderRadius: "4px" }}>
              <div style={{ fontSize: "0.6875rem", color: "#666", textTransform: "uppercase" }}>
                Privacy Firewall Enforcement
              </div>
              <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "#28a745", marginTop: "0.25rem" }}>
                ✓ AKTIF & TERKUNCI
              </div>
              <div style={{ fontSize: "0.75rem", color: "#666", marginTop: "0.25rem" }}>
                Filter PII & verifikasi izin publik aktif di layer server-side
              </div>
            </div>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="admin-card" style={{ margin: 0 }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: "0 0 1rem 0" }}>
            Riwayat Log Audit Redaksi ({logs.length} entri terakhir)
          </h3>

          {logs.length === 0 ? (
            <div style={{ fontSize: "0.8125rem", color: "#888", fontStyle: "italic", padding: "1rem 0" }}>
              Belum ada aksi yang tercatat.
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Waktu</th>
                    <th>Aktor</th>
                    <th>Peran</th>
                    <th>Aksi</th>
                    <th>Entitas</th>
                    <th>ID Sasaran</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td style={{ fontSize: "0.75rem", color: "#666" }}>
                        {new Date(log.createdAt).toLocaleString("id-ID")}
                      </td>
                      <td style={{ fontWeight: 500 }}>{log.actorEmail}</td>
                      <td>
                        <span className="admin-role-tag">{log.actorRole}</span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontFamily: "monospace",
                            textTransform: "uppercase",
                            fontSize: "0.6875rem",
                            padding: "2px 6px",
                            backgroundColor: "#f2efe9",
                            borderRadius: "2px",
                          }}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td>{log.entity}</td>
                      <td>
                        <code>{log.entityId}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
