import React from "react";
import { describePublishState, getPublishState } from "@/lib/cms/publish";

const TONES: Record<
  "info" | "warning" | "success",
  { background: string; border: string; color: string; label: string }
> = {
  warning: { background: "#fff3cd", border: "#ffeeba", color: "#856404", label: "Perlu build" },
  success: { background: "#eef7ee", border: "#cfe6cf", color: "#2f5d2f", label: "Tersinkron" },
  info: { background: "#eef2f7", border: "#d3dfeb", color: "#33475b", label: "Info" },
};

/**
 * Reports how the CMS relates to the public site (docs/ADMIN.md §7).
 *
 * The public site is build-gated, so this notice is the single source of truth
 * for "when will my edit appear publicly?" — it never claims that saving (or
 * `revalidatePath`) publishes anything on its own.
 */
export default function PublishStatusNotice() {
  const state = getPublishState();
  const { tone, title, detail } = describePublishState(state);
  const colors = TONES[tone];

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        backgroundColor: colors.background,
        border: `1px solid ${colors.border}`,
        color: colors.color,
        borderRadius: "4px",
        padding: "0.75rem 1rem",
        fontSize: "0.8125rem",
        lineHeight: 1.5,
        marginBottom: "1.5rem",
      }}
    >
      <strong style={{ display: "block", marginBottom: "0.25rem" }}>
        {title}
        <span
          style={{
            marginLeft: "0.5rem",
            fontSize: "0.6875rem",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            border: `1px solid ${colors.color}`,
            borderRadius: "3px",
            padding: "0.05rem 0.35rem",
          }}
        >
          {colors.label}
        </span>
      </strong>
      <span>{detail}</span>
      <span style={{ display: "block", marginTop: "0.35rem", opacity: 0.85 }}>
        Catatan: perubahan tersimpan langsung di CMS, sedangkan berkas media yang diunggah
        ke <code>public/uploads/</code> ikut terbit pada build berikutnya.
      </span>
    </div>
  );
}
