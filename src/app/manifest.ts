import type { MetadataRoute } from "next";
import { siteDescription, siteName } from "@/config/site";

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
      { src: "/logo.png", sizes: "2000x2000", type: "image/png", purpose: "any" },
      { src: "/logo.png", sizes: "2000x2000", type: "image/png", purpose: "maskable" },
    ],
  };
}
