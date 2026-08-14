import type { MetadataRoute } from "next";

const BASE_URL = "https://zenaldodev.com.br";

const PUBLIC_ROUTES = [
  "",
  "/about",
  "/services",
  "/projects",
  "/skills",
  "/certificates",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
