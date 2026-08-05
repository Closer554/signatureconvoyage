import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";

const pages = [
  { path: "", priority: 1, changeFrequency: "weekly" as const },
  { path: "/professionnels", priority: .9, changeFrequency: "monthly" as const },
  { path: "/particuliers", priority: .9, changeFrequency: "monthly" as const },
  { path: "/reseau", priority: .8, changeFrequency: "monthly" as const },
  { path: "/qualite-securite", priority: .8, changeFrequency: "monthly" as const },
  { path: "/qui-sommes-nous", priority: .7, changeFrequency: "monthly" as const },
  { path: "/devis", priority: .9, changeFrequency: "monthly" as const },
  { path: "/contact", priority: .7, changeFrequency: "monthly" as const },
  { path: "/devenir-convoyeur", priority: .6, changeFrequency: "monthly" as const },
  { path: "/mentions-legales", priority: .2, changeFrequency: "yearly" as const },
  { path: "/politique-confidentialite", priority: .2, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map(({ path, ...entry }) => ({ url: `${siteUrl}${path}`, ...entry }));
}
