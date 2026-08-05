import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Réseau national de convoyeurs automobiles",
  description: "Découvrez notre couverture de convoyage automobile en France métropolitaine et vérifiez la prise en charge de votre trajet.",
  alternates: { canonical: "/reseau" },
};

export default function ReseauLayout({ children }: { children: React.ReactNode }) {
  return children;
}
