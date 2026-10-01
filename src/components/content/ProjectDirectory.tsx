"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import ProjectCard from "@/components/content/ProjectCard";
import type { ProjectEntity } from "@/types";

interface ProjectDirectoryProps {
  projects: ProjectEntity[];
}

/**
 * Interactive Project Directory (T-504, QA F-PRJ):
 * Provides instant search by title, tech stack, or team members,
 * category filter pills, and accessible empty-search state.
 */
export default function ProjectDirectory({ projects }: ProjectDirectoryProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Extract unique categories
  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    for (const p of projects) {
      if (p.category) cats.add(p.category);
    }
    return Array.from(cats).sort();
  }, [projects]);

  // Filter projects based on query and active category
  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();
    return projects.filter((project) => {
      // Category filter
      if (activeCategory && project.category !== activeCategory) {
        return false;
      }
      // Text query
      if (!normalizedQuery) return true;
      const matchTitle = project.title.toLowerCase().includes(normalizedQuery);
      const matchDesc = project.description.toLowerCase().includes(normalizedQuery);
      const matchTech = (project.technology ?? []).some((t) =>
        t.toLowerCase().includes(normalizedQuery),
      );
      const matchMembers = (project.members ?? []).some((m) =>
        m.studentId.toLowerCase().includes(normalizedQuery) ||
        (m.role && m.role.toLowerCase().includes(normalizedQuery)),
      );
      return matchTitle || matchDesc || matchTech || matchMembers;
    });
  }, [projects, query, activeCategory]);

  if (projects.length === 0) {
    return (
      <p className="empty-state t-body" role="status">
        Etalase proyek sedang dikurasi — deskripsi, tim, dan visual akan
        diterbitkan setelah verifikasi.
      </p>
    );
  }

  const isFiltering = query.trim().length > 0 || activeCategory !== null;

  const handleReset = () => {
    setQuery("");
    setActiveCategory(null);
  };

  return (
    <div className="directory-container">
      <div className="directory-controls" data-reveal>
        <div className="directory-search">
          <Search size={18} className="directory-search__icon" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari berdasarkan judul, teknologi, atau tim..."
            className="directory-search__input"
            aria-label="Cari proyek karya"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="directory-search__clear"
              aria-label="Hapus kata kunci pencarian"
            >
              <X size={16} aria-hidden="true" />
            </button>
          ) : null}
        </div>

        {allCategories.length > 0 ? (
          <div className="directory-filters" role="group" aria-label="Filter kategori proyek">
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className={`directory-filter-btn ${
                activeCategory === null ? "directory-filter-btn--active" : ""
              }`}
              aria-pressed={activeCategory === null}
            >
              Semua
            </button>
            {allCategories.map((category) => {
              const active = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(active ? null : category)}
                  className={`directory-filter-btn ${
                    active ? "directory-filter-btn--active" : ""
                  }`}
                  aria-pressed={active}
                >
                  {category}
                </button>
              );
            })}
          </div>
        ) : null}

        <div className="directory-meta" aria-live="polite">
          <p className="t-caption">
            Menampilkan {filteredProjects.length} dari {projects.length} karya
            {isFiltering ? " (hasil filter)" : ""}
          </p>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="directory-empty empty-state" role="status">
          <p className="t-body">
            Tidak ditemukan karya yang sesuai dengan kata kunci atau filter yang dipilih.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="btn-pill-ghost directory-empty__reset"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="project-grid">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              featured={project.featured}
            />
          ))}
        </div>
      )}
    </div>
  );
}
