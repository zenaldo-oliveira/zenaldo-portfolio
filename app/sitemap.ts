import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const PUBLIC_ROUTES = [
  "",
  "/about",
  "/services",
  "/plans",
  "/build",
  "/how-it-works",
  "/projects",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
