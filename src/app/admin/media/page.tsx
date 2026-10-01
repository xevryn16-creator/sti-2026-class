import React from "react";
import { getAllMediaCMS } from "@/lib/cms/store";
import MediaManagerClient from "@/components/admin/MediaManagerClient";

export default async function AdminMediaPage() {
  const mediaList = await getAllMediaCMS();

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 600, letterSpacing: "-0.03em", margin: "0 0 0.25rem 0" }}>
          Media Library & Berkas
        </h2>
        <p style={{ color: "#666", fontSize: "0.8125rem", margin: 0 }}>
          Pusat pengelolaan gambar potret mahasiswa, foto album, thumbnail proyek, dan video angkatan.
        </p>
      </div>

      <MediaManagerClient initialMedia={mediaList} />
    </div>
  );
}
