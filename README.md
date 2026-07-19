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
- `src/lib/lead-service.ts` : abstraction webhook / simulation de développement

## Personnalisation

- **Nom et identité** : modifier `brandName` dans `src/config/brand.ts`. Le wordmark et le monogramme isolé sont dans `src/components/layout/Logo.tsx`.
- **Couleurs** : modifier les variables en tête de `src/app/globals.css`.
- **Téléphone, e-mail, adresse** : renseigner les valeurs actuellement `null` dans `brand.ts`. Les blocs restent masqués sinon.
- **Horaires et SLA** : renseigner `businessHours` et `responseSlaMinutes` uniquement après validation opérationnelle.
- **Carte** : adapter `coverageClaim` et les points de `src/data/network.ts`. La carte SVG est illustrative et sa liste mobile reste accessible.
- **Témoignages** : ajouter uniquement des témoignages autorisés dans `src/data/testimonials.ts` avec `authorized: true`.
- **Logos et statistiques** : ajouter de vrais fichiers autorisés et des chiffres vérifiés dans `brand.ts`.
- **Photos** : la photo éditoriale distante de démonstration dans `globals.css` doit être remplacée par un fichier optimisé et licencié dans `public/images` avant publication. Le dégradé reste un fallback visuel.

## Formulaires et CRM

Le devis utilise une route serveur et `src/lib/lead-service.ts`. En développement sans webhook, l’envoi est une simulation explicite dans les logs. En production sans webhook, aucun faux succès n’est retourné.

Définir `LEAD_WEBHOOK_URL` dans `.env.local` pour transmettre les demandes. Valider le format attendu, l’authentification, le stockage, les durées de conservation et la conformité RGPD avec le futur CRM. Les formulaires courts sont des démonstrations front-end et doivent être raccordés au même service avant publication.

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
- [ ] Webhook ou CRM pour tous les formulaires
- [ ] Domaine et URL `metadataBase`, sitemap et robots
- [ ] Analytics et consentement éventuel
- [ ] Test réel des notifications et du traitement des erreurs
