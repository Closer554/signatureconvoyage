import type { Metadata } from "next";
import Link from "next/link";
import { Compass, Handshake, Route, ShieldCheck } from "lucide-react";
import { brand } from "@/config/brand";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Qui sommes-nous",
  description: "Découvrez l’histoire, l’expérience et les engagements de Signature Convoyage.",
  alternates: { canonical: "/qui-sommes-nous" },
};

const commitments = [
  { Icon: Compass, title: "Une organisation claire", text: "Un point de contact unique coordonne chaque trajet, les rendez-vous et les informations utiles." },
  { Icon: Route, title: "Une présence nationale", text: "Les missions sont organisées partout en France métropolitaine, au plus près du lieu de prise en charge." },
  { Icon: ShieldCheck, title: "Une méthode rigoureuse", text: "Chaque convoyage suit des étapes définies, de l’affectation à la remise documentée du véhicule." },
  { Icon: Handshake, title: "Une relation de confiance", text: "Nous privilégions des échanges directs, des engagements lisibles et une réponse adaptée à chaque besoin." },
];

export default function Page() {
  const history = brand.foundingYear
    ? `Créée en ${brand.foundingYear}, Signature Convoyage s’est développée autour d’une conviction simple : le transport d’un véhicule doit être aussi fluide et maîtrisé que sa remise en main propre.`
    : "Signature Convoyage est née d’une conviction simple : le transport d’un véhicule doit être aussi fluide et maîtrisé que sa remise en main propre.";
  const experience = brand.experienceYears
    ? `${brand.experienceYears} ans d’expérience au service de la mobilité automobile.`
    : "Une expérience de terrain mise au service de la mobilité automobile.";

  return <>
    <section className="subhero dark">
      <span className="eyebrow light-eye">Qui sommes-nous</span>
      <h1>Le convoyage automobile, conduit avec exigence.</h1>
      <p>Signature Convoyage accompagne professionnels et particuliers dans le déplacement de leurs véhicules, avec une organisation attentive, un suivi clair et un réseau mobilisé à l’échelle nationale.</p>
    </section>
    <div className="page-shell">
      <section className="about-intro">
        <span className="about-year">{brand.foundingYear ?? "Notre histoire"}</span>
        <div>
          <span className="eyebrow">L’origine</span>
          <h2>Une vision simple de la mobilité.</h2>
          <p>{history}</p>
          <p>{experience} Au fil des missions, nous avons construit une organisation qui associe proximité, réactivité et précision opérationnelle.</p>
        </div>
      </section>
      <section className="section">
        <SectionHeading eyebrow="Nos engagements" title="Ce qui guide chaque mission." text="Derrière chaque trajet, la même attention portée au véhicule, aux délais et aux personnes qui nous font confiance." />
        <div className="feature-grid">{commitments.map(({ Icon, title, text }) => <article key={title}><Icon /><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>
      <section className="about-manifesto">
        <span className="eyebrow light-eye">Notre rôle</span>
        <h2>Faire avancer votre véhicule, sans compliquer votre quotidien.</h2>
        <p>De la première demande jusqu’à la remise des clés, nous coordonnons les intervenants, centralisons les informations et veillons au bon déroulement de la mission. Vous gardez une vision claire, sans avoir à piloter la logistique.</p>
        <Link className="btn ivory" href="/qualite-securite">Découvrir notre méthode</Link>
      </section>
      <section className="final-cta compact">
        <div><span className="eyebrow light-eye">Votre prochain trajet</span><h2>Un véhicule à déplacer ?</h2><p>Présentez-nous votre besoin et recevez une réponse adaptée à votre mission.</p></div>
        <Link className="btn ivory" href="/devis">Demander un devis</Link>
      </section>
    </div>
  </>;
}
