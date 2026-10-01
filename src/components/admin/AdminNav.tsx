"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AdminUser } from "@/types/cms";
import { logoutAction } from "@/app/admin/actions/auth";

export default function AdminNav({ user }: { user: AdminUser }) {
  const pathname = usePathname();

  const links = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/admin/students", label: "Mahasiswa", icon: "👥" },
    { href: "/admin/projects", label: "Katalog Proyek", icon: "💼" },
    { href: "/admin/memories", label: "Kenangan & Cerita", icon: "🎞️" },
    { href: "/admin/events", label: "Agenda & Timeline", icon: "📅" },
    { href: "/admin/media", label: "Media Library", icon: "📁" },
    { href: "/admin/settings", label: "Pengaturan & Audit", icon: "⚙️" },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div className="admin-logo-badge">ITB · STI 2026</div>
        <h1 className="admin-sidebar-title">Redaksi CMS</h1>
      </div>

      <nav className="admin-nav">
        {links.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-item ${isActive ? "active" : ""}`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="admin-sidebar-footer">
        <div className="admin-user-pill">
          <div>
            <div style={{ fontWeight: 600, color: "#111" }}>{user.name}</div>
            <div style={{ fontSize: "0.6875rem", color: "#666" }}>{user.email}</div>
          </div>
          <span className="admin-role-tag">{user.role}</span>
        </div>

        <form action={logoutAction}>
          <button
            type="submit"
            className="admin-btn admin-btn-secondary"
            style={{ width: "100%", justifyContent: "center" }}
          >
            Keluar (Logout)
          </button>
        </form>
      </div>
    </aside>
  );
}
