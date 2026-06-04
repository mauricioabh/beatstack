import type { MetadataRoute } from "next";
import { PUBLIC_SITEMAP_PATHS } from "@/lib/seo/routes";
import { getSiteUrl } from "@/lib/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  return PUBLIC_SITEMAP_PATHS.map((path) => ({
    url: new URL(path, siteUrl).href,
    lastModified,
    changeFrequency:
      path === "/" || path === "/home" || path === "/create"
        ? "weekly"
        : "monthly",
    priority:
      path === "/" || path === "/home"
        ? 1
        : path === "/create"
          ? 0.9
          : 0.7,
  }));
}
