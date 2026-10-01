import React from "react";
import Link from "next/link";
import { getAllProjectsCMS } from "@/lib/cms/store";
import { deleteProjectAction } from "@/app/admin/actions/projects";

export default async function AdminProjectsPage() {
  const projects = await getAllProjectsCMS();

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
            Katalog Proyek & Inovasi
          </h2>
          <p style={{ color: "#666", fontSize: "0.8125rem", margin: 0 }}>
            Kelola karya, tugas akhir, prototipe, dan inisiatif mahasiswa STI 2026.
          </p>
        </div>
        <Link href="/admin/projects/new" className="admin-btn admin-btn-primary">
          + Tambah Proyek
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="admin-empty-state">
          <div className="admin-empty-state-title">Belum ada proyek dalam katalog</div>
          <div className="admin-empty-state-desc">
            Tambahkan karya pertama angkatan untuk mulai mengisi etalase karya mahasiswa.
          </div>
          <Link href="/admin/projects/new" className="admin-btn admin-btn-primary">
            + Tambah Proyek Pertama
          </Link>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Cover</th>
                <th>Judul Proyek</th>
                <th>Kategori</th>
                <th>Anggota</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td style={{ width: "64px" }}>
                    <div
                      style={{
                        width: "60px",
                        height: "40px",
                        backgroundColor: "#eee",
                        backgroundImage: `url(${project.coverImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: "2px",
                      }}
                    />
                  </td>
                  <td>
                    <div style={{ fontWeight: 500, color: "#111" }}>{project.title}</div>
                    <div style={{ fontSize: "0.75rem", color: "#666" }}>
                      <code>{project.id}</code>
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        backgroundColor: "#f2efe9",
                        padding: "2px 6px",
                        borderRadius: "2px",
                        fontFamily: "monospace",
                      }}
                    >
                      {project.category || "General"}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: "0.75rem", color: "#444" }}>
                      {project.members && project.members.length > 0
                        ? project.members.map((m) => m.studentId).join(", ")
                        : "—"}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`admin-badge admin-badge-${project.publishStatus ?? "published"}`}
                    >
                      {project.publishStatus ?? "published"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className="admin-btn admin-btn-secondary"
                        style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                      >
                        Edit
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          await deleteProjectAction(project.id);
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
