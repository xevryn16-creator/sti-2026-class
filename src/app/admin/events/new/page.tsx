"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveEventAction } from "@/app/admin/actions/events";
import type { EventCategory } from "@/types";

export default function NewEventPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await saveEventAction(formData);
      if (res.success) {
        router.push("/admin/events");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "700px" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <Link href="/admin/events" style={{ fontSize: "0.8125rem", color: "#666", textDecoration: "none" }}>
          ← Kembali ke Agenda & Timeline
        </Link>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 500, letterSpacing: "-0.03em", margin: "0.5rem 0 0 0" }}>
          Tambah Agenda Kegiatan Baru
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
            ID Unik Acara (contoh: <code>sidang-tugas-akhir-2026</code>)
          </label>
          <input
            id="id"
            name="id"
            required
            className="admin-form-input"
            placeholder="slug-kegiatan"
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label" htmlFor="title">
            Nama Kegiatan / Acara
          </label>
          <input
            id="title"
            name="title"
            required
            className="admin-form-input"
            placeholder="Sidang Tugas Akhir & Pameran Karya STI"
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="date">
              Tanggal (YYYY-MM-DD)
            </label>
            <input
              id="date"
              name="date"
              type="date"
              required
              className="admin-form-input"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="category">
              Kategori
            </label>
            <select id="category" name="category" className="admin-form-select">
              <option value="academic">Akademik</option>
              <option value="social">Sosial</option>
              <option value="competition">Kompetisi</option>
              <option value="ceremony">Upacara / Wisuda</option>
              <option value="other">Lainnya</option>
            </select>
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label" htmlFor="location">
            Lokasi Acara
          </label>
          <input
            id="location"
            name="location"
            defaultValue="Kampus ITB Ganesha, Bandung"
            className="admin-form-input"
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label" htmlFor="poster">
            URL Poster / Banner
          </label>
          <input
            id="poster"
            name="poster"
            placeholder="/images/events/poster.webp"
            className="admin-form-input"
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label" htmlFor="description">
            Deskripsi Acara
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            className="admin-form-textarea"
            placeholder="Rangkaian acara, jadwal, dan keterangan detail kegiatan."
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
            {submitting ? "Menyimpan Acara..." : "Simpan Kegiatan"}
          </button>
          <Link href="/admin/events" className="admin-btn admin-btn-secondary">
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
