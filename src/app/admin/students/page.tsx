import React from "react";
import Link from "next/link";
import { getAllStudentsCMS } from "@/lib/cms/store";
import { deleteStudentAction } from "@/app/admin/actions/students";
import DeleteActionButton from "@/components/admin/DeleteActionButton";

export default async function AdminStudentsPage() {
  const students = await getAllStudentsCMS();

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
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, letterSpacing: "-0.03em", margin: "0 0 0.25rem 0" }}>
            Direktori Mahasiswa
          </h2>
          <p style={{ color: "#666", fontSize: "0.8125rem", margin: 0 }}>
            Kelola profil, foto, minat, kutipan, dan persetujuan publik (consent firewall).
          </p>
        </div>
        <Link href="/admin/students/new" className="admin-btn admin-btn-primary">
          + Tambah Mahasiswa
        </Link>
      </div>

      {students.length === 0 ? (
        <div className="admin-empty-state">
          <div className="admin-empty-state-title">Belum ada mahasiswa terdaftar</div>
          <div className="admin-empty-state-desc">
            Tambahkan data mahasiswa pertama untuk mulai mengisi direktori angkatan STI 2026.
          </div>
          <Link href="/admin/students/new" className="admin-btn admin-btn-primary">
            + Tambah Mahasiswa Pertama
          </Link>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Foto</th>
                <th>Nama / ID</th>
                <th>Minat & Peran</th>
                <th>Status Publik</th>
                <th>Consent Firewall</th>
                <th style={{ textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td style={{ width: "48px" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "44px",
                        backgroundColor: "#eee",
                        backgroundImage: `url(${student.photo})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: "2px",
                      }}
                    />
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: "#111" }}>{student.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "#666" }}>
                      <code>{student.id}</code>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: "0.75rem", color: "#444" }}>
                      {student.interests && student.interests.length > 0
                        ? student.interests.slice(0, 3).join(", ")
                        : "—"}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`admin-badge admin-badge-${student.publishStatus ?? "published"}`}
                    >
                      {student.publishStatus ?? "published"}
                    </span>
                  </td>
                  <td>
                    {student.consentPublic ? (
                      <span
                        style={{
                          color: "#155724",
                          backgroundColor: "#d4edda",
                          padding: "2px 8px",
                          borderRadius: "3px",
                          fontSize: "0.6875rem",
                          fontWeight: 600,
                        }}
                      >
                        ✓ DIIZINKAN
                      </span>
                    ) : (
                      <span
                        style={{
                          color: "#721c24",
                          backgroundColor: "#f8d7da",
                          padding: "2px 8px",
                          borderRadius: "3px",
                          fontSize: "0.6875rem",
                          fontWeight: 600,
                        }}
                      >
                        ✕ TIDAK PUBLIK
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                      <Link
                        href={`/admin/students/${student.id}/edit`}
                        className="admin-btn admin-btn-secondary"
                        style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                      >
                        Edit
                      </Link>
                      <DeleteActionButton
                        id={student.id}
                        action={deleteStudentAction}
                        confirmMessage={`Hapus data mahasiswa "${student.name}"? Tindakan ini tidak dapat dibatalkan.`}
                      />
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
