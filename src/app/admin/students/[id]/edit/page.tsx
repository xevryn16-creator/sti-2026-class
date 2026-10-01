import React from "react";
import { notFound } from "next/navigation";
import { getStudentByIdCMS } from "@/lib/cms/store";
import StudentForm from "@/components/admin/StudentForm";

export default async function EditStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const student = await getStudentByIdCMS(id);

  if (!student) {
    notFound();
  }

  return <StudentForm initialData={student} />;
}
