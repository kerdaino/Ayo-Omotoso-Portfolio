import type { MetadataRoute } from "next";

import { canonicalUrl } from "@/lib/site";
import { getAllProjects } from "@/sanity/queries";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getAllProjects();
  const routes = [
    "/",
    "/resume/",
    ...projects.map((project) => `/work/${project.slug}/`),
  ];

  return routes.map((route) => ({
    url: canonicalUrl(route),
  }));
}
