import type { Metadata } from "next";
import { JotformDriverForm } from "@/components/forms/JotformDriverForm";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Devenir convoyeur partenaire",
  description: "Proposez votre profil pour rejoindre notre réseau de convoyeurs partenaires.",
  alternates: { canonical: "/devenir-convoyeur" },
};

const benefits = [
  "Missions choisies selon vos disponibilités",
  "Informations de mission centralisées",
  "Accompagnement opérationnel",
  "Conditions communiquées avec transparence",
  "Parcours d’intégration",
  "Support en cas d’imprévu",
];

export default function Page() {
  return (
    <>
      <section className="subhero driver-hero">
        <span className="eyebrow">Convoyeurs partenaires</span>
        <h1>Conduisez en toute autonomie. Travaillez avec une équipe qui vous respecte.</h1>
        <p>Un parcours clair, des informations de mission centralisées et un accompagnement opérationnel lorsque vous en avez besoin.</p>
      </section>
      <div className="page-shell">
        <section className="section">
          <SectionHeading eyebrow="Le partenariat" title="Un cadre de travail lisible." />
          <div className="feature-grid">
            {benefits.map((benefit) => <article key={benefit}><h3>{benefit}</h3></article>)}
          </div>
        </section>
        <section className="split-section">
          <SectionHeading eyebrow="Votre profil" title="Faisons connaissance." text="Aucune promesse de volume ou de rémunération n’est affichée : chaque condition doit être présentée et acceptée clairement." />
          <JotformDriverForm />
        </section>
      </div>
    </>
  );
}
