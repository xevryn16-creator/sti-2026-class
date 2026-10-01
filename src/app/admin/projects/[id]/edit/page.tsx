import React from "react";
import { notFound } from "next/navigation";
import { getProjectByIdCMS } from "@/lib/cms/store";
import ProjectForm from "@/components/admin/ProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectByIdCMS(id);

  if (!project) {
    notFound();
  }

  return <ProjectForm initialData={project} />;
}
