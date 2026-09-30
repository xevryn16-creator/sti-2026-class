import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getProjects, getStudents } from "@/lib/data";

/** Static sitemap covering all routes + SSG student/project pages (T-704). */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL;
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/students",
    "/projects",
    "/memories",
    "/events",
    "/timeline",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const studentRoutes: MetadataRoute.Sitemap = getStudents().map((s) => ({
    url: `${base}/students/${s.id}`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const projectRoutes: MetadataRoute.Sitemap = getProjects().map((p) => ({
    url: `${base}/projects/${p.id}`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...studentRoutes, ...projectRoutes];
}
