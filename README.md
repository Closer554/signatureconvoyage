# Site de convoyage automobile

Site vitrine multi-page Next.js pour une future marque française de convoyage. Tous les contenus sensibles sont volontairement absents tant qu’ils ne sont pas vérifiés.

## Installation et commandes

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
```

## Structure

- `src/app` : routes, métadonnées, API de réception des demandes
- `src/components` : mise en page, sections, carte et formulaires
- `src/config/brand.ts` : identité, coordonnées et affirmations métier
- `src/content/site.ts` : services, qualité et cas d’usage
- `src/data/network.ts` : points de la carte
- `src/data/testimonials.ts` : témoignages autorisés uniquement
- `src/lib/lead-service.ts` : envoi des demandes de devis par Resend

## Personnalisation

- **Nom et identité** : modifier `brandName` dans `src/config/brand.ts`. Le logo source est `public/logo.png`. Le pack et son aperçu sont dans `public/images/logos`, les références du site dans `src/config/brand-assets.ts`. Régénérer les exports avec `npm run brand:build` ; les instructions de mise à jour de l’archive se trouvent dans `public/images/logos/LISEZ-MOI.md`.
- **Couleurs** : modifier les variables en tête de `src/app/globals.css`.
- **Téléphone, e-mail, adresse** : renseigner les valeurs actuellement `null` dans `brand.ts`. Les blocs restent masqués sinon.
- **Horaires et SLA** : renseigner `businessHours` et `responseSlaMinutes` uniquement après validation opérationnelle.
- **Carte** : adapter `coverageClaim` et les points de `src/data/network.ts`. La carte SVG est illustrative et sa liste mobile reste accessible.
- **Témoignages** : ajouter uniquement des témoignages autorisés dans `src/data/testimonials.ts` avec `authorized: true`.
- **Logos et statistiques** : ajouter de vrais fichiers autorisés et des chiffres vérifiés dans `brand.ts`.
- **Photos** : la photo éditoriale distante de démonstration dans `globals.css` doit être remplacée par un fichier optimisé et licencié dans `public/images` avant publication. Le dégradé reste un fallback visuel.

## Aperçus des liens partagés

L’image `public/images/logos/reseaux/partage-1200x630.jpg` est utilisée par les métadonnées Open Graph et Twitter pour les aperçus des liens. Les icônes du navigateur et du manifeste se trouvent dans `public/images/logos/icones`. Le domaine officiel utilisé par défaut est `https://signature-convoyage.fr`. Si `NEXT_PUBLIC_SITE_URL` est définie, sa valeur remplace ce domaine : la renseigner avec `https://signature-convoyage.fr` dans l’environnement de compilation. Après toute modification, relancer `npm run build` et redéployer le site : les métadonnées sont générées pendant le build. Incrémenter la version dans `src/config/brand-assets.ts` pour renouveler les URL des assets après une modification du logo.

Vérifier que l’URL absolue indiquée dans la balise `og:image` renvoie bien le logo (HTTP 200 et `Content-Type: image/jpeg`).

## Formulaires et e-mails

Le devis utilise la route serveur `/api/leads` et le SDK Resend. La clé API reste côté serveur et chaque demande est envoyée dans un e-mail HTML, accompagné d’une version texte. L’adresse du demandeur est configurée comme adresse de réponse.

Copier `.env.example` vers `.env.local`, puis renseigner `RESEND_API_KEY`, `RESEND_FROM_EMAIL` et `RESEND_TO_EMAIL`. Le domaine de `RESEND_FROM_EMAIL` doit être vérifié dans Resend. En l’absence de configuration ou si Resend refuse l’envoi, le formulaire retourne une erreur et n’affiche pas de faux succès.

Les formulaires courts sont encore des démonstrations front-end et doivent être raccordés à un service avant publication. Valider également les durées de conservation et la conformité RGPD des demandes envoyées par e-mail.

## Avant mise en production

- [ ] Nom définitif
- [ ] Logo définitif
- [ ] Téléphone
- [ ] E-mail
- [ ] Horaires
- [ ] SLA réel
- [ ] Couverture réelle
- [ ] Conditions d’assurance validées
- [ ] Mentions légales validées
- [ ] Politique de confidentialité validée
- [ ] Photos sous licence et optimisées localement
- [ ] Témoignages autorisés
- [ ] Logos clients autorisés
- [ ] Statistiques vérifiées
- [ ] Configuration Resend testée en production
- [ ] Service d’envoi raccordé aux autres formulaires
- [ ] Domaine et URL `metadataBase`, sitemap et robots
- [ ] Analytics et consentement éventuel
- [ ] Test réel des notifications et du traitement des erreurs
