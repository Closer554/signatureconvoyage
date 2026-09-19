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
- `src/lib/lead-service.ts` : envoi des demandes de devis, de contact et professionnelles par Resend

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

Le devis utilise la route serveur `/api/leads` ; les formulaires de contact et professionnels utilisent `/api/contact`. Les données et l’accord de confidentialité sont validés côté serveur avant l’envoi par Resend. Chaque demande est envoyée dans un e-mail HTML accompagné d’une version texte, avec un objet distinct selon le formulaire. L’adresse du demandeur est configurée comme adresse de réponse. Le succès n’est affiché qu’après confirmation de Resend.

En local, copier `.env.example` vers `.env.local`, puis renseigner `RESEND_API_KEY`. Les adresses `RESEND_FROM_EMAIL` et `RESEND_TO_EMAIL` sont configurées sur `contact@signature-convoyage.fr`. Sans destinataire explicite, l’adresse de contact définie dans `src/config/brand.ts` est utilisée. Le domaine de l’expéditeur doit être vérifié dans Resend : `onboarding@resend.dev` est réservé aux tests vers l’adresse du titulaire du compte. En l’absence de configuration ou si Resend refuse l’envoi, le formulaire retourne une erreur et conserve les saisies.

Sur Cloudflare, les adresses d’expédition et de réception sont définies dans `wrangler.jsonc`. Configurer la clé privée sur le Worker `signatureconvoyage` avec `npx wrangler secret put RESEND_API_KEY`, puis déployer avec `npm run deploy`. Ne pas ajouter la clé API au dépôt. Les variables locales `.env` ne remplacent pas la configuration des secrets du Worker. Si d’anciens secrets `RESEND_FROM_EMAIL` ou `RESEND_TO_EMAIL` existent sur le Worker, les remplacer par les variables correspondantes avant le déploiement.

Le formulaire de candidature `/devenir-convoyeur` est hébergé par Jotform (formulaire `262104829585059`) et n’utilise pas Resend. Dans l’éditeur Jotform, ouvrir **Settings → Emails → Notification Email → Recipients**, renseigner `contact@signature-convoyage.fr` dans **Recipient Email**, puis enregistrer. Cette configuration est gérée dans le compte Jotform et ne peut pas être changée dans le code d’intégration du site. Guide : https://www.jotform.com/help/41-how-to-change-the-email-address-used-for-notification-email/.

Vérifier la réception réelle des notifications après validation du domaine et déploiement, ainsi que celle des candidatures après le réglage Jotform.

Tests des formulaires (Node.js ≥ 22.15) : `node scripts/test-forms.mjs`. Ils vérifient la validation, les destinataires, le contenu des e-mails et les échecs de transmission avec Resend simulé, sans envoi réel ni clé API.

## Avant mise en production

- [ ] Nom définitif
- [ ] Logo définitif
- [ ] Téléphone
- [x] E-mail de contact et destinataire des formulaires locaux
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
- [x] Service d’envoi raccordé aux formulaires de contact et professionnels
- [ ] Destinataire des notifications Jotform configuré
- [ ] Domaine et URL `metadataBase`, sitemap et robots
- [ ] Analytics et consentement éventuel
- [ ] Test réel des notifications et du traitement des erreurs
