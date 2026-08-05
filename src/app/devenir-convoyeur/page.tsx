import type { Metadata } from "next";
import { Check } from "lucide-react";
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
          <ul className="driver-benefits">
            {benefits.map((benefit) => <li key={benefit}><Check aria-hidden="true" /><span>{benefit}</span></li>)}
          </ul>
        </section>
        <section className="split-section driver-application">
          <div className="driver-application-intro">
            <span className="eyebrow">Votre profil</span>
            <h2>Envie de prendre la route avec nous&nbsp;?</h2>
            <p>Notre équipe étudiera votre candidature et vous recontactera pour échanger sur les missions et leurs conditions.</p>
          </div>
          <JotformDriverForm />
        </section>
      </div>
    </>
  );
}
