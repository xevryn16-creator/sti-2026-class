import React from "react";
import Link from "next/link";
import { getAllMemoriesCMS } from "@/lib/cms/store";
import { deleteMemoryAction } from "@/app/admin/actions/memories";
import DeleteActionButton from "@/components/admin/DeleteActionButton";

export default async function AdminMemoriesPage() {
  const memories = await getAllMemoriesCMS();

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 500, letterSpacing: "-0.03em", margin: "0 0 0.25rem 0" }}>
            Arsip Kenangan & Kisah Angkatan
          </h2>
          <p style={{ color: "#666", fontSize: "0.8125rem", margin: 0 }}>
            Kelola foto cerita, album memori, dan momen berkesan STI 2026.
          </p>
        </div>
        <Link href="/admin/memories/new" className="admin-btn admin-btn-primary">
          + Tambah Cerita Kenangan
        </Link>
      </div>

      {memories.length === 0 ? (
        <div className="admin-empty-state">
          <div className="admin-empty-state-title">Belum ada cerita kenangan tersimpan</div>
          <div className="admin-empty-state-desc">
            Abadikan momen berkesan pertama untuk mengawali arsip kenangan angkatan.
          </div>
          <Link href="/admin/memories/new" className="admin-btn admin-btn-primary">
            + Tambah Kenangan Pertama
          </Link>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Foto</th>
                <th>Judul & Periode</th>
                <th>Kategori</th>
                <th>Jumlah Foto</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {memories.map((memory) => {
                const cover = memory.photos?.[0]?.src || "/images/memories/default.webp";
                return (
                  <tr key={memory.id}>
                    <td style={{ width: "64px" }}>
                      <div
                        style={{
                          width: "60px",
                          height: "40px",
                          backgroundColor: "#eee",
                          backgroundImage: `url(${cover})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          borderRadius: "2px",
                        }}
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: 500, color: "#111" }}>{memory.title}</div>
                      <div style={{ fontSize: "0.75rem", color: "#666" }}>
                        {memory.period || "—"}
                      </div>
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
                        {memory.category || "General"}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: "0.75rem", color: "#444" }}>
                        {memory.photos?.length ?? 0} foto
                      </div>
                    </td>
                    <td>
                      <span
                        className={`admin-badge admin-badge-${memory.publishStatus ?? "published"}`}
                      >
                        {memory.publishStatus ?? "published"}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                        <DeleteActionButton
                          id={memory.id}
                          action={deleteMemoryAction}
                          confirmMessage={`Hapus kenangan "${memory.title}"? Tindakan ini tidak dapat dibatalkan.`}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
