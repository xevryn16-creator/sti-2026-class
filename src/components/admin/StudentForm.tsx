"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveStudentAction } from "@/app/admin/actions/students";
import type { CMSStudentItem } from "@/types/cms";

export default function StudentForm({
  initialData,
}: {
  initialData?: CMSStudentItem;
}) {
  const router = useRouter();
  // Consent must be an EXPLICIT opt-in (docs/CONTENT.md §2.2): a new record is
  // never pre-consented, so an untouched form can never leak a student.
  const [consent, setConsent] = useState(initialData?.consentPublic ?? false);
  const [publishStatus, setPublishStatus] = useState(initialData?.publishStatus ?? "published");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("consentPublic", consent ? "true" : "false");
    formData.set("publishStatus", publishStatus);

    try {
      const res = await saveStudentAction(formData);
      if (res.success) {
        router.push("/admin/students");
        return;
      }
      // Authorization/validation refusal reported as data, never as a crash page.
      setError(res.error ?? "Data mahasiswa gagal disimpan.");
      setSubmitting(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan data.");
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "700px" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <Link href="/admin/students" style={{ fontSize: "0.8125rem", color: "#666", textDecoration: "none" }}>
          ← Kembali ke Direktori Mahasiswa
        </Link>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 600, letterSpacing: "-0.03em", margin: "0.5rem 0 0 0" }}>
          {initialData ? `Edit Data: ${initialData.name}` : "Tambah Mahasiswa Baru"}
        </h2>
      </div>

      {error && (
        <div
          role="alert"
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
          {error}
        </div>
      )}

      {/* Privacy Notice Alert */}
      {!consent && (
        <div
          style={{
            backgroundColor: "#fff3cd",
            border: "1px solid #ffeeba",
            color: "#856404",
            padding: "0.75rem 1rem",
            borderRadius: "4px",
            fontSize: "0.8125rem",
            marginBottom: "1.5rem",
          }}
        >
          <strong>Peringatan Privacy Firewall:</strong> Mahasiswa ini ditandai <em>tanpa persetujuan publik</em>. Profil, foto, dan karya mereka <strong>TIDAK AKAN</strong> ditampilkan pada website publik STI 2026.
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-card">
        {initialData && <input type="hidden" name="id" value={initialData.id} />}

        {!initialData && (
          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="id">
              ID / Slug Unik (contoh: <code>achmad-hafiz</code>)
            </label>
            <input
              id="id"
              name="id"
              required
              className="admin-form-input"
              placeholder="nama-lengkap"
            />
            <div className="admin-form-help">
              Format huruf kecil dan tanda hubung (-) saja. Jangan menggunakan NIM atau nomor identitas.
            </div>
          </div>
        )}

        <div className="admin-form-group">
          <label className="admin-form-label" htmlFor="name">
            Nama Lengkap
          </label>
          <input
            id="name"
            name="name"
            required
            defaultValue={initialData?.name}
            className="admin-form-input"
            placeholder="Nama Lengkap Sesuai Dokumen"
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label" htmlFor="nickname">
            Nama Panggilan (Opsional)
          </label>
          <input
            id="nickname"
            name="nickname"
            defaultValue={initialData?.nickname}
            className="admin-form-input"
            placeholder="Panggilan akrab di kampus"
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label" htmlFor="photo">
            URL Foto Potret
          </label>
          <input
            id="photo"
            name="photo"
            required
            defaultValue={initialData?.photo || "/images/students/placeholder.webp"}
            className="admin-form-input"
            placeholder="/images/students/nama.webp"
          />
          <div className="admin-form-help">
            Unggah foto potret rasio 3:4 melalui menu <strong>Media Library</strong> terlebih dahulu, lalu salin URL-nya.
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label" htmlFor="bio">
            Biografi Singkat (Bio)
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={3}
            defaultValue={initialData?.bio}
            className="admin-form-textarea"
            placeholder="Cerita minat akademik, fokus keilmuan, dan perjalanan selama di STI ITB."
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label" htmlFor="quote">
            Kutipan Buku Tahunan (Quote)
          </label>
          <input
            id="quote"
            name="quote"
            defaultValue={initialData?.quote}
            className="admin-form-input"
            placeholder="Kalimat refleksi atau kutipan berkesan"
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label" htmlFor="interests">
            Minat & Bidang Keilmuan (pisahkan dengan koma)
          </label>
          <input
            id="interests"
            name="interests"
            defaultValue={initialData?.interests?.join(", ")}
            className="admin-form-input"
            placeholder="Software Engineering, Distributed Systems, Cloud Architecture"
          />
        </div>

        {/* Consent & Publishing Settings */}
        <div style={{ padding: "1.25rem", backgroundColor: "#faf9f7", borderRadius: "4px", marginTop: "1.5rem" }}>
          <h4 style={{ margin: "0 0 1rem 0", fontSize: "0.875rem", fontWeight: 600 }}>
            Kebijakan Privasi & Status Publikasi
          </h4>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "1rem" }}>
            <input
              type="checkbox"
              id="consentPublic"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              style={{ marginTop: "0.2rem" }}
            />
            <label htmlFor="consentPublic" style={{ fontSize: "0.8125rem", color: "#222" }}>
              <strong>Mahasiswa Memberikan Izin Publikasi (Consent)</strong>
              <div style={{ fontSize: "0.75rem", color: "#666" }}>
                Jika tidak dicentang, seluruh data mahasiswa ini terkunci dan tidak pernah dikirim ke browser publik.
              </div>
            </label>
          </div>

          <div className="admin-form-group" style={{ margin: 0 }}>
            <label className="admin-form-label" htmlFor="publishStatus">
              Status Publikasi Redaksi
            </label>
            <select
              id="publishStatus"
              value={publishStatus}
              onChange={(e) => setPublishStatus(e.target.value as "draft" | "published" | "archived")}
              className="admin-form-select"
            >
              <option value="published">Published (Tayang)</option>
              <option value="draft">Draft (Konsep Internal)</option>
              <option value="archived">Archived (Arsip)</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
          <button
            type="submit"
            disabled={submitting}
            className="admin-btn admin-btn-primary"
          >
            {submitting ? "Menyimpan Data..." : "Simpan Perubahan"}
          </button>
          <Link href="/admin/students" className="admin-btn admin-btn-secondary">
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
