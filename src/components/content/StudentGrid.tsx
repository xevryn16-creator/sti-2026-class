import StudentCard from "@/components/content/StudentCard";
import type { StudentEntity } from "@/types";

interface StudentGridProps {
  students: StudentEntity[];
}

/**
 * Responsive directory grid (T-403): 4 cols ≥ 1280px, 3 cols ≥ 1024px,
 * 2 cols ≥ 430px, 1 col below. Stagger reveal handled by ScrollReveal.
 */
export default function StudentGrid({ students }: StudentGridProps) {
  if (students.length === 0) {
    return (
      <p className="empty-state t-body" role="status">
        Data angkatan sedang dalam proses kurasi dan persetujuan publikasi.
      </p>
    );
  }

  return (
    <div className="student-grid">
      {students.map((student) => (
        <StudentCard key={student.id} student={student} />
      ))}
    </div>
  );
}
