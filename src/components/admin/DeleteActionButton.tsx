"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export interface DeleteResult {
  success: boolean;
  error?: string;
}

/**
 * Destructive row action (docs/ADMIN.md §2.3).
 *
 * The server action is the security boundary and re-checks the caller's role on
 * every call. This component only owns the *presentation* of a refusal: a denied
 * editor sees an inline Indonesian message instead of the framework error page
 * that an unhandled server exception used to produce.
 */
export default function DeleteActionButton({
  id,
  action,
  label = "Hapus",
  confirmMessage,
  size = "sm",
}: {
  id: string;
  action: (id: string) => Promise<DeleteResult>;
  label?: string;
  confirmMessage?: string;
  size?: "sm" | "md";
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    if (confirmMessage && typeof window !== "undefined" && !window.confirm(confirmMessage)) {
      return;
    }
    setError(null);

    startTransition(async () => {
      try {
        const result = await action(id);
        if (result && result.success === false) {
          setError(result.error ?? "Tindakan tidak dapat dijalankan.");
          return;
        }
        router.refresh();
      } catch {
        setError("Tindakan gagal dijalankan. Silakan muat ulang halaman dan coba lagi.");
      }
    });
  };

  const compact = size === "sm";

  return (
    <span
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "0.25rem",
      }}
    >
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="admin-btn admin-btn-danger"
        style={
          compact
            ? { padding: "0.25rem 0.5rem", fontSize: "0.75rem" }
            : undefined
        }
      >
        {pending ? "Memproses…" : label}
      </button>
      {error ? (
        <span
          role="alert"
          style={{
            display: "block",
            maxWidth: "240px",
            textAlign: "left",
            fontSize: "0.6875rem",
            lineHeight: 1.4,
            color: "#5f2120",
            backgroundColor: "#fdeded",
            border: "1px solid #f5c2c7",
            borderRadius: "3px",
            padding: "0.25rem 0.4rem",
          }}
        >
          {error}
        </span>
      ) : null}
    </span>
  );
}
