import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site Signature Convoyage.",
  alternates: { canonical: "/mentions-legales" },
};

export default function Page() {
  return <article className="legal-page">
    <span className="eyebrow">Informations légales</span>
    <h1>Mentions légales</h1>
    <p className="legal-updated">Dernière mise à jour : 1er août 2026</p>

    <h2>1. Éditeur du site</h2>
    <p>Le site Signature Convoyage est édité par <strong>SERVICE VOITURIER PARIS</strong>, entreprise unipersonnelle à responsabilité limitée (EURL) au capital social de 5 000,00 €.</p>
    <ul>
      <li>Siège social : 5 Avenue Chausson, 92230 Gennevilliers, France</li>
      <li>SIREN : 795 280 080</li>
      <li>SIRET : 795 280 080 00032</li>
      <li>Immatriculation : RCS de Nanterre</li>
      <li>Numéro de TVA intracommunautaire : FR25795280080</li>
      <li>Code APE : 9609Z</li>
      <li>E-mail : <a href="mailto:contact@paris-service-voiturier.com">contact@paris-service-voiturier.com</a></li>
      <li>Site institutionnel : <a href="https://www.paris-service-voiturier.com" rel="noopener noreferrer">www.paris-service-voiturier.com</a></li>
    </ul>
    <p>Activités principales déclarées : service voiturier, chauffeur privé, convoyage de véhicules, ventousage, régie extérieure et gestion de flux.</p>

    <h2>2. Direction de la publication</h2>
    <p>Le directeur de la publication est le représentant légal de SERVICE VOITURIER PARIS.</p>

    <h2>3. Hébergement</h2>
    <p>Le site est hébergé par Cloudflare, Inc., 101 Townsend Street, San Francisco, California 94107, États-Unis — téléphone : +1 650 319 8930.</p>

    <h2>4. Propriété intellectuelle</h2>
    <p>L’ensemble du site, notamment sa structure, ses textes, éléments graphiques, logos, icônes, photographies, vidéos, sons et logiciels, est protégé par les règles françaises et internationales relatives à la propriété intellectuelle. Sauf mention contraire, ces contenus sont la propriété de SERVICE VOITURIER PARIS ou sont utilisés avec l’autorisation de leurs titulaires.</p>
    <p>Toute reproduction, représentation, adaptation, extraction ou exploitation, totale ou partielle, sur quelque support que ce soit, est interdite sans autorisation écrite préalable, hors exceptions prévues par la loi.</p>

    <h2>5. Responsabilité</h2>
    <p>SERVICE VOITURIER PARIS veille à l’exactitude et à l’actualisation des informations publiées, sans pouvoir garantir leur exhaustivité ni l’absence d’erreur. Les informations du site sont générales et ne constituent ni un devis, ni un engagement contractuel. L’éditeur ne saurait être responsable d’une interruption, d’un dysfonctionnement ou d’un dommage résultant de l’utilisation du site, sous réserve des dispositions légales impératives.</p>

    <h2>6. Liens externes</h2>
    <p>Le site peut contenir des liens vers des services tiers. SERVICE VOITURIER PARIS n’exerce aucun contrôle sur leurs contenus ou leurs pratiques et ne peut en être tenue responsable.</p>

    <h2>7. Données personnelles</h2>
    <p>Les modalités de traitement des données personnelles et d’utilisation des traceurs sont détaillées dans la <Link href="/politique-confidentialite">politique de confidentialité</Link>.</p>

    <h2>8. Droit applicable</h2>
    <p>Le site et les présentes mentions sont soumis au droit français. En cas de différend, les parties rechercheront d’abord une solution amiable avant toute action judiciaire.</p>
  </article>;
}
