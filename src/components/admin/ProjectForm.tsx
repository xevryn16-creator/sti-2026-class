"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveProjectAction } from "@/app/admin/actions/projects";
import type { CMSProjectItem } from "@/types/cms";
import type { ProjectStatus } from "@/types";

export default function ProjectForm({
  initialData,
}: {
  initialData?: CMSProjectItem;
}) {
  const router = useRouter();
  const [featured, setFeatured] = useState(initialData?.featured ?? false);
  const [publishStatus, setPublishStatus] = useState(initialData?.publishStatus ?? "published");
  const [status, setStatus] = useState<ProjectStatus>(initialData?.status ?? "completed");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("featured", featured ? "true" : "false");
    formData.set("publishStatus", publishStatus);
    formData.set("status", status);

    try {
      const res = await saveProjectAction(formData);
      if (res.success) {
        router.push("/admin/projects");
        return;
      }
      // Authorization/validation refusal reported as data, never as a crash page.
      setError(res.error ?? "Data proyek gagal disimpan.");
      setSubmitting(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan data.");
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "700px" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <Link href="/admin/projects" style={{ fontSize: "0.8125rem", color: "#666", textDecoration: "none" }}>
          ← Kembali ke Katalog Proyek
        </Link>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 500, letterSpacing: "-0.03em", margin: "0.5rem 0 0 0" }}>
          {initialData ? `Edit Proyek: ${initialData.title}` : "Tambah Proyek Baru"}
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

      <form onSubmit={handleSubmit} className="admin-card">
        {initialData && <input type="hidden" name="id" value={initialData.id} />}

        {!initialData && (
          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="id">
              ID / Slug Proyek (contoh: <code>kampus-connect</code>)
            </label>
            <input
              id="id"
              name="id"
              required
              className="admin-form-input"
              placeholder="judul-proyek-slug"
            />
          </div>
        )}

        <div className="admin-form-group">
          <label className="admin-form-label" htmlFor="title">
            Judul Proyek
          </label>
          <input
            id="title"
            name="title"
            required
            defaultValue={initialData?.title}
            className="admin-form-input"
            placeholder="Judul Proyek atau Produk"
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="category">
              Kategori
            </label>
            <input
              id="category"
              name="category"
              defaultValue={initialData?.category || "Web Development"}
              className="admin-form-input"
              placeholder="Web Development, Mobile App, AI, dll."
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="year">
              Tahun
            </label>
            <input
              id="year"
              name="year"
              type="number"
              required
              defaultValue={initialData?.year || 2024}
              className="admin-form-input"
            />
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label" htmlFor="coverImage">
            URL Gambar Sampul (Cover Image)
          </label>
          <input
            id="coverImage"
            name="coverImage"
            required
            defaultValue={initialData?.coverImage || "/images/projects/default.webp"}
            className="admin-form-input"
            placeholder="/images/projects/proyek-cover.webp"
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label" htmlFor="description">
            Deskripsi Lengkap
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            defaultValue={initialData?.description}
            className="admin-form-textarea"
            placeholder="Latar belakang, arsitektur teknologi, dan dampak dari solusi yang dibangun."
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label" htmlFor="members">
            ID Mahasiswa Pengembang (pisahkan dengan koma)
          </label>
          <input
            id="members"
            name="members"
            defaultValue={initialData?.members?.map((m) => m.studentId).join(", ")}
            className="admin-form-input"
            placeholder="achmad-hafiz, aisyah-putri"
          />
          <div className="admin-form-help">
            Pastikan ID mahasiswa sesuai dengan direktori mahasiswa yang telah memberikan izin (consent).
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label" htmlFor="technology">
            Tags Teknologi (pisahkan dengan koma)
          </label>
          <input
            id="technology"
            name="technology"
            defaultValue={initialData?.technology?.join(", ")}
            className="admin-form-input"
            placeholder="Next.js, PostgreSQL, TypeScript, Docker"
          />
        </div>

        <div style={{ padding: "1.25rem", backgroundColor: "#faf9f7", borderRadius: "4px", marginTop: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            <label htmlFor="featured" style={{ fontSize: "0.8125rem", fontWeight: 500 }}>
              Sorot di Beranda (Featured Showcase)
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-form-label" htmlFor="status">
                Status Proyek
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="admin-form-select"
              >
                <option value="completed">Completed (Selesai)</option>
                <option value="in-progress">In Progress (Sedang Berjalan)</option>
                <option value="prototype">Prototype (Prototipe)</option>
                <option value="archived">Archived (Arsip)</option>
              </select>
            </div>

            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-form-label" htmlFor="publishStatus">
                Status Publikasi
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
        </div>

        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
          <button
            type="submit"
            disabled={submitting}
            className="admin-btn admin-btn-primary"
          >
            {submitting ? "Menyimpan Proyek..." : "Simpan Proyek"}
          </button>
          <Link href="/admin/projects" className="admin-btn admin-btn-secondary">
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
