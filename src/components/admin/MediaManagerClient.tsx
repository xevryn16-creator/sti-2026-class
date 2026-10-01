"use client";

import React, { useState } from "react";
import type { MediaAssetEntity } from "@/types/cms";
import { uploadMediaAction, deleteMediaAction } from "@/app/admin/actions/media";

export default function MediaManagerClient({
  initialMedia,
}: {
  initialMedia: MediaAssetEntity[];
}) {
  const [media, setMedia] = useState<MediaAssetEntity[]>(initialMedia);
  const [filterType, setFilterType] = useState<"all" | "image" | "video">("all");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadMediaAction(formData);
      if (res.success && res.asset) {
        setMedia([res.asset, ...media]);
      } else {
        setUploadError(res.error || "Gagal mengunggah berkas.");
      }
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Terjadi kesalahan unggah.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus berkas media ini? Tindakan ini tidak dapat dibatalkan.")) return;
    try {
      await deleteMediaAction(id);
      setMedia(media.filter((m) => m.id !== id));
    } catch {
      alert("Gagal menghapus berkas media.");
    }
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = media.filter((m) => {
    if (filterType === "all") return true;
    return m.type === filterType;
  });

  return (
    <div>
      {/* Upload Zone & Filter Toolbar */}
      <div className="admin-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <label className="admin-btn admin-btn-primary" style={{ cursor: uploading ? "wait" : "pointer" }}>
            {uploading ? "Mengoptimasi & Mengunggah..." : "+ Unggah Berkas Baru"}
            <input
              type="file"
              onChange={handleUpload}
              disabled={uploading}
              style={{ display: "none" }}
              accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm"
            />
          </label>
          <span style={{ fontSize: "0.75rem", color: "#666" }}>
            Gambar maks 10MB (WebP auto-strip EXIF), Video maks 50MB
          </span>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => setFilterType("all")}
            className={`admin-btn ${filterType === "all" ? "admin-btn-primary" : "admin-btn-secondary"}`}
            style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}
          >
            Semua ({media.length})
          </button>
          <button
            onClick={() => setFilterType("image")}
            className={`admin-btn ${filterType === "image" ? "admin-btn-primary" : "admin-btn-secondary"}`}
            style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}
          >
            Gambar ({media.filter((m) => m.type === "image").length})
          </button>
          <button
            onClick={() => setFilterType("video")}
            className={`admin-btn ${filterType === "video" ? "admin-btn-primary" : "admin-btn-secondary"}`}
            style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}
          >
            Video ({media.filter((m) => m.type === "video").length})
          </button>
        </div>
      </div>

      {uploadError && (
        <div
          style={{
            backgroundColor: "#fdeded",
            color: "#5f2120",
            border: "1px solid #f5c2c7",
            borderRadius: "4px",
            padding: "0.75rem 1rem",
            fontSize: "0.8125rem",
            marginBottom: "1.5rem",
          }}
        >
          {uploadError}
        </div>
      )}

      {/* Grid of Media Assets */}
      {filtered.length === 0 ? (
        <div className="admin-empty-state">
          <div className="admin-empty-state-title">Media library masih kosong</div>
          <div className="admin-empty-state-desc">
            Unggah foto angkatan, portofolio, atau rekaman video untuk digunakan di profil mahasiswa, memori, dan proyek.
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {filtered.map((item) => (
            <div
              key={item.id}
              className="admin-card"
              style={{
                padding: "0.75rem",
                display: "flex",
                flexDirection: "column",
                margin: 0,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "140px",
                  backgroundColor: "#f0ece1",
                  borderRadius: "3px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "0.75rem",
                }}
              >
                {item.type === "image" ? (
                  <img
                    src={item.url}
                    alt={item.filename}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div style={{ textAlign: "center", color: "#666" }}>
                    <div style={{ fontSize: "2rem" }}>🎥</div>
                    <div style={{ fontSize: "0.6875rem", fontFamily: "monospace" }}>VIDEO MP4</div>
                  </div>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    wordBreak: "break-all",
                    marginBottom: "0.25rem",
                  }}
                >
                  {item.filename}
                </div>
                <div style={{ fontSize: "0.6875rem", color: "#666", marginBottom: "0.75rem" }}>
                  {(item.sizeBytes / 1024).toFixed(0)} KB · {item.mimeType}
                  {item.width && item.height ? ` · ${item.width}×${item.height}px` : ""}
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.5rem", borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => copyUrl(item.url, item.id)}
                  className="admin-btn admin-btn-secondary"
                  style={{ flex: 1, padding: "0.3rem", fontSize: "0.6875rem" }}
                >
                  {copiedId === item.id ? "✓ Tersalin!" : "Salin URL"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="admin-btn admin-btn-danger"
                  style={{ padding: "0.3rem 0.6rem", fontSize: "0.6875rem" }}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
