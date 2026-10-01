import { ImageResponse } from "next/og";
import { SITE_FULL_NAME } from "@/lib/constants";

export const alt = SITE_FULL_NAME;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

/**
 * Editorial Beau Open Graph Card Generator (T-704, docs/DESIGN.md):
 * Statically rendered at build time with Ink Black canvas, Warm Parchment text,
 * and the Broadcast Gradient accent.
 */
export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#000000",
          padding: "80px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background:
              "linear-gradient(90deg, #ff4500 0%, #ff8c00 35%, #ffd700 70%, #ff1493 100%)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <p
            style={{
              fontSize: "22px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#a39e93",
              margin: 0,
            }}
          >
            Sistem dan Teknologi Informasi · Angkatan 2026
          </p>
          <h1
            style={{
              fontSize: "80px",
              fontWeight: 600,
              letterSpacing: "-0.04em",
              color: "#f6f4f1",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            STI 2026
          </h1>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            width: "100%",
            borderTop: "1px solid rgba(255, 255, 255, 0.16)",
            paddingTop: "32px",
          }}
        >
          <p
            style={{
              fontSize: "26px",
              color: "#d1cec7",
              margin: 0,
              maxWidth: "750px",
              lineHeight: 1.4,
            }}
          >
            Buku tahunan digital dan etalase karya mahasiswa Sistem dan Teknologi Informasi.
          </p>
          <span
            style={{
              fontSize: "18px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#a39e93",
            }}
          >
            Portfolio & Arsip
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
