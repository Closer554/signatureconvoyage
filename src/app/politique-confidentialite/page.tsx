import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Informations sur le traitement de vos données personnelles par Signature Convoyage.",
  alternates: { canonical: "/politique-confidentialite" },
};

export default function Page() {
  return <article className="legal-page">
    <span className="eyebrow">Protection des données</span>
    <h1>Politique de confidentialité</h1>
    <p className="legal-updated">Dernière mise à jour : 1er août 2026</p>
    <p>La présente politique explique comment SERVICE VOITURIER PARIS traite les données personnelles recueillies sur le site Signature Convoyage, conformément au règlement général sur la protection des données (RGPD) et à la loi Informatique et Libertés.</p>

    <h2>1. Responsable du traitement</h2>
    <p>Le responsable du traitement est SERVICE VOITURIER PARIS, EURL au capital de 5 000,00 €, immatriculée au RCS de Nanterre sous le numéro 795 280 080, dont le siège social est situé 5 Avenue Chausson, 92230 Gennevilliers, France.</p>
    <p>Contact pour toute question ou demande relative aux données personnelles : <a href="mailto:contact@paris-service-voiturier.com">contact@paris-service-voiturier.com</a>.</p>

    <h2>2. Données traitées</h2>
    <p>Selon le service utilisé, nous pouvons traiter :</p>
    <ul>
      <li>vos données d’identification et de contact : nom, prénom, société, e-mail et téléphone ;</li>
      <li>les informations relatives à votre demande : message, profil professionnel ou particulier et volume estimé ;</li>
      <li>les informations nécessaires au devis et à la mission : adresses de départ et d’arrivée, date souhaitée, catégorie, marque, modèle, année et état roulant du véhicule ;</li>
      <li>les informations de candidature des convoyeurs saisies dans le formulaire Jotform ;</li>
      <li>les données techniques de connexion et de sécurité : adresse IP, journaux, type de navigateur et informations relatives à l’appareil, dans la mesure où elles sont générées par l’hébergement ou nécessaires à la sécurité du site.</li>
    </ul>
    <p>Les champs signalés comme obligatoires sont nécessaires pour traiter la demande. À défaut, nous ne pourrons pas y répondre ou établir le devis demandé.</p>

    <h2>3. Finalités, bases légales et durées</h2>
    <div className="legal-table-wrap"><table className="legal-table"><thead><tr><th>Traitement</th><th>Finalité</th><th>Base légale</th><th>Durée principale</th></tr></thead><tbody>
      <tr><td>Demandes de devis et de contact</td><td>Étudier la demande, répondre, établir un devis et assurer les échanges précontractuels.</td><td>Mesures précontractuelles prises à votre demande.</td><td>3 ans après le dernier contact si la demande n’aboutit pas.</td></tr>
      <tr><td>Gestion des clients et des missions</td><td>Organiser et exécuter le convoyage, assurer le suivi, la facturation et le service après-vente.</td><td>Exécution du contrat et obligations légales.</td><td>Durée de la relation contractuelle, puis archivage pendant les délais légaux applicables.</td></tr>
      <tr><td>Documents comptables</td><td>Tenir la comptabilité et répondre aux obligations fiscales.</td><td>Obligation légale.</td><td>10 ans à compter de la clôture de l’exercice concerné.</td></tr>
      <tr><td>Candidatures de convoyeurs</td><td>Évaluer une candidature, échanger avec le candidat et constituer un vivier.</td><td>Mesures précontractuelles ; consentement pour une conservation en vivier.</td><td>Durée du recrutement, puis jusqu’à 2 ans après le dernier contact avec l’accord du candidat.</td></tr>
      <tr><td>Sécurité et journaux techniques</td><td>Sécuriser le site, prévenir les abus et diagnostiquer les incidents.</td><td>Intérêt légitime à assurer la sécurité du service.</td><td>12 mois au maximum, sauf nécessité de conservation liée à un incident.</td></tr>
    </tbody></table></div>
    <p>À l’issue de ces durées, les données sont supprimées ou archivées avec un accès restreint lorsqu’une obligation légale ou la défense de droits en justice l’exige.</p>

    <h2>4. Destinataires et sous-traitants</h2>
    <p>Les données sont accessibles uniquement aux personnes habilitées de SERVICE VOITURIER PARIS et, dans la limite nécessaire à leurs missions, aux convoyeurs ou partenaires intervenant dans l’exécution du service.</p>
    <p>Elles peuvent également être traitées par nos prestataires techniques : hébergeur Cloudflare, outil de formulaire Jotform pour les candidatures, ainsi que le prestataire de messagerie ou le service de gestion des demandes effectivement connecté au site. Les suggestions d’adresses et de véhicules interrogent des bases externes à partir du texte saisi, sans transmission de vos coordonnées de contact.</p>
    <p>Nous ne vendons ni ne louons vos données personnelles. Elles peuvent être communiquées aux autorités lorsque la loi nous y oblige.</p>

    <h2>5. Transferts hors de l’Espace économique européen</h2>
    <p>Certains prestataires, notamment Cloudflare et Jotform, sont établis ou disposent d’infrastructures aux États-Unis. Lorsque des données sont traitées hors de l’Espace économique européen, le transfert repose sur une décision d’adéquation applicable ou sur les clauses contractuelles types de la Commission européenne, accompagnées si nécessaire de garanties supplémentaires. Vous pouvez demander des informations sur ces garanties à l’adresse indiquée ci-dessus.</p>

    <h2>6. Vos droits</h2>
    <p>Dans les conditions prévues par le RGPD, vous disposez des droits d’accès, de rectification, d’effacement et de limitation de vos données, ainsi que du droit à la portabilité lorsque celui-ci est applicable. Vous pouvez vous opposer aux traitements fondés sur l’intérêt légitime et retirer votre consentement à tout moment pour les traitements qui reposent sur celui-ci, sans affecter la licéité des opérations antérieures.</p>
    <p>Vous pouvez également définir des directives relatives au sort de vos données après votre décès. Nous répondons en principe dans un délai d’un mois, susceptible d’être prolongé de deux mois pour une demande complexe. Une preuve d’identité pourra être demandée uniquement en cas de doute raisonnable sur votre identité.</p>
    <p>Pour exercer vos droits, écrivez à <a href="mailto:contact@paris-service-voiturier.com">contact@paris-service-voiturier.com</a> ou à SERVICE VOITURIER PARIS, 5 Avenue Chausson, 92230 Gennevilliers, France.</p>
    <p>Si vous estimez que vos droits ne sont pas respectés après nous avoir contactés, vous pouvez adresser une réclamation à la <a href="https://www.cnil.fr" rel="noopener noreferrer">Commission nationale de l’informatique et des libertés (CNIL)</a>, 3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07.</p>

    <h2>7. Cookies et services tiers</h2>
    <p>Dans sa configuration actuelle, le site n’utilise pas de cookies publicitaires ni d’outil de mesure d’audience nécessitant votre consentement. Des traceurs strictement nécessaires peuvent être utilisés pour la sécurité, l’équilibrage de charge ou le fonctionnement des formulaires ; ils ne servent pas au ciblage publicitaire.</p>
    <p>Le formulaire de candidature Jotform est chargé depuis un service tiers lorsque vous consultez la page concernée. Jotform peut alors recevoir des données techniques nécessaires à son fonctionnement. Si des outils non essentiels sont ajoutés ultérieurement, ils seront bloqués jusqu’à votre choix et la présente politique sera actualisée.</p>

    <h2>8. Sécurité</h2>
    <p>Nous mettons en œuvre des mesures techniques et organisationnelles adaptées aux risques afin de préserver la confidentialité, l’intégrité et la disponibilité des données, notamment la limitation des accès, la sécurisation des échanges et la surveillance des incidents. Aucun système ne pouvant garantir une sécurité absolue, nous réévaluons régulièrement ces mesures.</p>

    <h2>9. Mise à jour de la politique</h2>
    <p>Cette politique peut être modifiée pour tenir compte d’une évolution légale, technique ou de nos traitements. La date figurant en tête de page indique sa dernière mise à jour.</p>
  </article>;
}
