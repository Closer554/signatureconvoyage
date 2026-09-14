import type { Metadata } from "next";
import "@fontsource-variable/manrope/index.css";
import "@fontsource-variable/newsreader/index.css";
import "./globals.css";
import "./refinement.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { brand } from "@/config/brand";
import { brandAssets } from "@/config/brand-assets";
import { siteDescription, siteName, siteUrl } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${siteName} | Convoyage automobile en France`, template: `%s | ${siteName}` },
  description: siteDescription,
  applicationName: siteName,
  category: "Transport automobile",
  keywords: ["convoyage automobile", "convoyage véhicule", "livraison voiture", "transport voiture", "convoyeur automobile", "convoyage France"],
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: brand.legalName ?? siteName,
  alternates: { canonical: "/", languages: { "fr-FR": "/" } },
  icons: {
    icon: [
      { url: brandAssets.icon(16), type: "image/png", sizes: "16x16" },
      { url: brandAssets.icon(32), type: "image/png", sizes: "32x32" },
      { url: brandAssets.favicon, type: "image/svg+xml", sizes: "any" },
    ],
    apple: [{ url: brandAssets.icon(180), type: "image/png", sizes: "180x180" }],
    shortcut: brandAssets.icon(32),
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    url: "/",
    locale: "fr_FR",
    siteName,
    title: `${siteName} | Convoyage automobile en France`,
    description: siteDescription,
    images: [{ url: brandAssets.share.src, type: "image/jpeg", width: brandAssets.share.width, height: brandAssets.share.height, alt: `Logo ${siteName}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | Convoyage automobile en France`,
    description: siteDescription,
    images: [brandAssets.share.src],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness"],
        "@id": `${siteUrl}/#organization`,
        name: siteName,
        legalName: brand.legalName ?? siteName,
        url: siteUrl,
        logo: `${siteUrl}${brandAssets.logo.src}`,
        image: `${siteUrl}${brandAssets.share.src}`,
        description: siteDescription,
        ...(brand.email && { email: brand.email }),
        ...(brand.phone && { telephone: brand.phone }),
        ...(brand.address && { address: { "@type": "PostalAddress", streetAddress: "5 Avenue Chausson", postalCode: "92230", addressLocality: "Gennevilliers", addressCountry: "FR" } }),
        areaServed: { "@type": "Country", name: "France" },
        sameAs: brand.socialLinks.map((link) => link.url),
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: siteName,
        description: siteDescription,
        inLanguage: "fr-FR",
        publisher: { "@id": `${siteUrl}/#organization` },
      },
    ],
  };

  return <html lang="fr" data-scroll-behavior="smooth"><body suppressHydrationWarning><a className="skip-link" href="#contenu">Aller au contenu</a><Header/><main id="contenu">{children}</main><Footer/><MobileActionBar/><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}/></body></html>;
}
