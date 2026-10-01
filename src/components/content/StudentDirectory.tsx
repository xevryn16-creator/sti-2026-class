"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import StudentGrid from "@/components/content/StudentGrid";
import type { StudentEntity } from "@/types";

interface StudentDirectoryProps {
  students: StudentEntity[];
}

/**
 * Interactive Student Directory (T-405, QA F-STU):
 * Provides instant search by name, nickname, or interest tags,
 * plus interest filter pills and accessible empty-search state.
 */
export default function StudentDirectory({ students }: StudentDirectoryProps) {
  const [query, setQuery] = useState("");
  const [activeInterest, setActiveInterest] = useState<string | null>(null);

  // Extract unique interests sorted by frequency or alphabetically
  const allInterests = useMemo(() => {
    const counts = new Map<string, number>();
    for (const student of students) {
      for (const interest of student.interests ?? []) {
        counts.set(interest, (counts.get(interest) ?? 0) + 1);
      }
    }
    return Array.from(counts.keys()).sort();
  }, [students]);

  // Filter students based on query and active interest
  const filteredStudents = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();
    return students.filter((student) => {
      // Interest filter
      if (activeInterest && !(student.interests ?? []).includes(activeInterest)) {
        return false;
      }
      // Text query
      if (!normalizedQuery) return true;
      const matchName = student.name.toLowerCase().includes(normalizedQuery);
      const matchNickname = student.nickname?.toLowerCase().includes(normalizedQuery);
      const matchInterests = (student.interests ?? []).some((i) =>
        i.toLowerCase().includes(normalizedQuery),
      );
      return matchName || matchNickname || matchInterests;
    });
  }, [students, query, activeInterest]);

  // If no data exists at all in the database, delegate to StudentGrid default empty state
  if (students.length === 0) {
    return <StudentGrid students={[]} />;
  }

  const isFiltering = query.trim().length > 0 || activeInterest !== null;

  const handleReset = () => {
    setQuery("");
    setActiveInterest(null);
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
            placeholder="Cari berdasarkan nama, panggilan, atau minat..."
            className="directory-search__input"
            aria-label="Cari mahasiswa"
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

        {allInterests.length > 0 ? (
          <div className="directory-filters" role="group" aria-label="Filter minat">
            <button
              type="button"
              onClick={() => setActiveInterest(null)}
              className={`directory-filter-btn ${
                activeInterest === null ? "directory-filter-btn--active" : ""
              }`}
              aria-pressed={activeInterest === null}
            >
              Semua
            </button>
            {allInterests.map((interest) => {
              const active = activeInterest === interest;
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => setActiveInterest(active ? null : interest)}
                  className={`directory-filter-btn ${
                    active ? "directory-filter-btn--active" : ""
                  }`}
                  aria-pressed={active}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        ) : null}

        <div className="directory-meta" aria-live="polite">
          <p className="t-caption">
            Menampilkan {filteredStudents.length} dari {students.length} mahasiswa
            {isFiltering ? " (hasil filter)" : ""}
          </p>
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <div className="directory-empty empty-state" role="status">
          <p className="t-body">
            Tidak ditemukan mahasiswa yang sesuai dengan kata kunci atau filter yang dipilih.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="btn-pill-ghost directory-empty__reset"
          >
            Reset Pencarian
          </button>
        </div>
      ) : (
        <StudentGrid students={filteredStudents} />
      )}
    </div>
  );
}
