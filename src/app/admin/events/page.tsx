import React from "react";
import Link from "next/link";
import { getAllEventsCMS, getAllTimelineCMS } from "@/lib/cms/store";
import { deleteEventAction } from "@/app/admin/actions/events";

export default async function AdminEventsPage() {
  const events = await getAllEventsCMS();
  const timeline = await getAllTimelineCMS();

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 500, letterSpacing: "-0.03em", margin: "0 0 0.25rem 0" }}>
            Agenda & Perjalanan Angkatan (Timeline)
          </h2>
          <p style={{ color: "#666", fontSize: "0.8125rem", margin: 0 }}>
            Kelola agenda kegiatan kampus dan rekam jejak semester per semester STI 2026.
          </p>
        </div>
        <Link href="/admin/events/new" className="admin-btn admin-btn-primary">
          + Tambah Kegiatan
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
        {/* Events Table */}
        <div className="admin-card" style={{ margin: 0 }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: 500, margin: "0 0 1rem 0" }}>
            Daftar Kegiatan & Acara
          </h3>

          {events.length === 0 ? (
            <div className="admin-empty-state">
              <div className="admin-empty-state-title">Belum ada kegiatan terdaftar</div>
              <div className="admin-empty-state-desc">
                Tambahkan agenda kegiatan akademik atau sosial angkatan.
              </div>
              <Link href="/admin/events/new" className="admin-btn admin-btn-primary">
                + Tambah Kegiatan Pertama
              </Link>
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Judul Acara</th>
                    <th>Tanggal</th>
                    <th>Lokasi</th>
                    <th>Kategori</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id}>
                      <td>
                        <div style={{ fontWeight: 500, color: "#111" }}>{event.title}</div>
                        <div style={{ fontSize: "0.75rem", color: "#666" }}>
                          <code>{event.id}</code>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: "0.8125rem" }}>{event.date}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: "0.8125rem", color: "#444" }}>{event.location || "—"}</div>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: "0.6875rem",
                            backgroundColor: "#f2efe9",
                            padding: "2px 6px",
                            borderRadius: "2px",
                            textTransform: "capitalize",
                          }}
                        >
                          {event.category || "General"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`admin-badge admin-badge-${event.publishStatus ?? "published"}`}
                        >
                          {event.publishStatus ?? "published"}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <form
                          action={async () => {
                            "use server";
                            await deleteEventAction(event.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="admin-btn admin-btn-danger"
                            style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                          >
                            Hapus
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Timeline Milestones Overview */}
        <div className="admin-card" style={{ margin: 0 }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: 500, margin: "0 0 1rem 0" }}>
            Struktur Timeline Perjalanan Angkatan (2022 - 2026)
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            {timeline.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: "1rem",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: "4px",
                  backgroundColor: "#faf9f7",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                  <span style={{ fontSize: "0.6875rem", fontFamily: "monospace", color: "#888" }}>
                    {item.date}
                  </span>
                  <span className="admin-badge admin-badge-published">PUBLISHED</span>
                </div>
                <div style={{ fontWeight: 500, fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                  {item.milestone}
                </div>
                <p style={{ fontSize: "0.75rem", color: "#555", margin: 0 }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
