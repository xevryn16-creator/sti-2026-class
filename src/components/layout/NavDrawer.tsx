"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Off-canvas mobile navigation drawer (T-203, docs/MOTION.md L-04).
 * Slides in from the right below 1024px. Accessible dialog: focus trap,
 * ESC close, overlay click close, background scroll lock, focus restoration.
 */
export default function NavDrawer() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  /* Close automatically when the route changes (QA F-NAV-07). */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /* Scroll lock + focus management while open (QA F-GAL-style guarantees). */
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const drawer = drawerRef.current;
    const focusable = drawer?.querySelector<HTMLElement>(
      "button, a[href], [tabindex]:not([tabindex='-1'])",
    );
    focusable?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      toggleRef.current?.focus();
    };
  }, [open]);

  const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      setOpen(false);
      return;
    }
    if (event.key !== "Tab") return;

    /* Strict focus trap (QA F-NAV-05..F-NAV-08). */
    const drawer = drawerRef.current;
    if (!drawer) return;
    const focusable = Array.from(
      drawer.querySelectorAll<HTMLElement>(
        "button:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])",
      ),
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }, []);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className="nav-drawer__toggle"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls="nav-drawer"
        onClick={() => setOpen(true)}
      >
        <Menu size={24} strokeWidth={1.75} aria-hidden="true" />
        <span className="visually-hidden">Buka menu navigasi</span>
      </button>

      {open ? (
        <div
          id="nav-drawer"
          className="nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi"
          ref={drawerRef}
          onKeyDown={onKeyDown}
        >
          <button
            type="button"
            className="nav-drawer__overlay"
            aria-label="Tutup menu navigasi"
            onClick={() => setOpen(false)}
          />
          <div className="nav-drawer__panel">
            <div className="nav-drawer__bar">
              <span className="nav-drawer__wordmark">STI 2026</span>
              <button
                type="button"
                className="nav-drawer__close"
                onClick={() => setOpen(false)}
              >
                <X size={24} strokeWidth={1.75} aria-hidden="true" />
                <span className="visually-hidden">Tutup menu</span>
              </button>
            </div>
            <nav aria-label="Navigasi utama">
              <ul className="nav-drawer__list">
                {NAV_LINKS.map((link) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "nav-drawer__link",
                          isActive && "nav-drawer__link--active",
                        )}
                        aria-current={isActive ? "page" : undefined}
                        onClick={() => setOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div className="nav-drawer__footer">
              <Link
                href="/admin"
                className="nav-drawer__dev-login"
                onClick={() => setOpen(false)}
              >
                Portal Redaksi (Dev Login)
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
