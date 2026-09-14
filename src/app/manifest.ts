import type { MetadataRoute } from "next";
import { siteDescription, siteName } from "@/config/site";
import { brandAssets } from "@/config/brand-assets";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteName,
    short_name: siteName,
    description: siteDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#fbfaf7",
    theme_color: "#0b2033",
    lang: "fr-FR",
    icons: [
      { src: brandAssets.icon(192), sizes: "192x192", type: "image/png", purpose: "any" },
      { src: brandAssets.icon(512), sizes: "512x512", type: "image/png", purpose: "any" },
      { src: brandAssets.maskableIcon, sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
