"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveMemoryAction } from "@/app/admin/actions/memories";

export default function NewMemoryPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await saveMemoryAction(formData);
      if (res.success) {
        router.push("/admin/memories");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "700px" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <Link href="/admin/memories" style={{ fontSize: "0.8125rem", color: "#666", textDecoration: "none" }}>
          ← Kembali ke Arsip Kenangan
        </Link>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 500, letterSpacing: "-0.03em", margin: "0.5rem 0 0 0" }}>
          Tambah Cerita Kenangan Baru
        </h2>
      </div>

      {error && (
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
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-card">
        <div className="admin-form-group">
          <label className="admin-form-label" htmlFor="id">
            ID Unik Kenangan (contoh: <code>makrab-puncak-2023</code>)
          </label>
          <input
            id="id"
            name="id"
            required
            className="admin-form-input"
            placeholder="slug-kenangan"
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label" htmlFor="title">
            Judul Cerita / Album
          </label>
          <input
            id="title"
            name="title"
            required
            className="admin-form-input"
            placeholder="Malam Keakraban STI 2026 di Villa Puncak"
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="period">
              Periode / Semester (contoh: <code>Semester 4 · 2024</code>)
            </label>
            <input
              id="period"
              name="period"
              required
              className="admin-form-input"
              placeholder="Semester 4 · 2024"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="category">
              Kategori
            </label>
            <select id="category" name="category" className="admin-form-select">
              <option value="social">Kegiatan Sosial & Malam Keakraban</option>
              <option value="academic">Akademik & Kuliah</option>
              <option value="campus">Kehidupan Kampus ITB</option>
              <option value="competition">Kompetisi & Lomba</option>
              <option value="celebration">Perayaan & Wisuda</option>
            </select>
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label" htmlFor="photoSrc">
            URL Foto Utama (src)
          </label>
          <input
            id="photoSrc"
            name="photoSrc"
            required
            defaultValue="/images/memories/default.webp"
            className="admin-form-input"
          />
          <div className="admin-form-help">
            Unggah foto melalui Media Library, lalu salin URL-nya ke sini.
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label" htmlFor="photoAlt">
            Teks Alternatif Foto (Alt)
          </label>
          <input
            id="photoAlt"
            name="photoAlt"
            required
            defaultValue="Foto kenangan kebersamaan mahasiswa STI 2026"
            className="admin-form-input"
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label" htmlFor="description">
            Deskripsi / Refleksi Cerita
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            required
            className="admin-form-textarea"
            placeholder="Ceritakan momen, tawa, atau perjuangan bersama di balik kenangan ini."
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label" htmlFor="publishStatus">
            Status Publikasi
          </label>
          <select id="publishStatus" name="publishStatus" className="admin-form-select">
            <option value="published">Published (Tayang)</option>
            <option value="draft">Draft (Konsep Internal)</option>
            <option value="archived">Archived (Arsip)</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
          <button type="submit" disabled={submitting} className="admin-btn admin-btn-primary">
            {submitting ? "Menyimpan Cerita..." : "Simpan Cerita Kenangan"}
          </button>
          <Link href="/admin/memories" className="admin-btn admin-btn-secondary">
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
