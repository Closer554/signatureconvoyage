# Signature Convoyage — nouveau logo

Source unique : `public/logo.png`, voiture bleu nuit, trajet et repère doré. L’ancien logo a été remplacé dans tous les fichiers du pack.

Ouvrir **APERCU.html** pour visualiser les versions sur fonds clair et sombre et télécharger les fichiers. Le pack complet est disponible dans `../pack-logos-signature-convoyage.zip`.

## Déclinaisons

- **logo-complet** : composition officielle, voiture au-dessus des deux lignes SIGNATURE / CONVOYAGE. Utilisée dans l’en-tête et le pied de page.
- **logo-horizontal** : voiture à gauche et lettrage d’origine à droite, pour les supports larges et signatures d’e-mail.
- **symbole** : voiture, trajet et repère, sans texte.
- **repere** : repère doré extrait du logo, disponible comme élément graphique secondaire.
- **icônes** : la voiture avec son trajet et son repère doré pour l’onglet (16/32/48 px et SVG), le logo complet pour les raccourcis et applications (180/192/512 px), sur fond crème. Les contours de la voiture sont légèrement renforcés aux petites tailles.
- **blanc** : version monochrome blanche, transparente, pour les fonds sombres.

## Formats

| Dossier | Contenu |
| --- | --- |
| `svg` | Tracés vectoriels transparents, sans police externe ni image incorporée |
| `pdf` | Mêmes tracés vectoriels, couleurs RVB |
| `png` | Transparence réelle, largeurs 1024, 2048 et 4096 px |
| `webp` | Transparence réelle, sans perte, largeur 1024 px |
| `jpg` | Fonds blanc ou crème, largeur 2048 px |
| `reseaux` | Avatar 1080 × 1080 et partage 1200 × 630 |
| `icones` | SVG, PNG 16/32/48/180/192/512 px et icône maskable 512 px |

Les dimensions dans les noms des déclinaisons correspondent à leur largeur. Conserver le rapport largeur/hauteur, les espacements et les marges. Les icônes maskable réservent une zone de sécurité pour les recadrages du système.

## Couleurs et reproduction

Bleu nuit **#0B2033**, or **#B79A68**, crème **#FBFAF7**, blanc **#FFFFFF**. L’or est une couleur plate, sans effet métallique. Pour l’impression, transmettre le PDF à l’imprimeur pour adaptation à son profil colorimétrique.

Les fichiers SVG sont une vectorisation du PNG fourni avec Potrace : les contours sont ajustés en courbes de Bézier, les couleurs uniformisées et les filets dorés redressés. Les PDF utilisent les mêmes courbes. Les lettres gardent leur forme et leur espacement, sans substitution de police. Le script et ses dépendances de préparation ne sont pas chargés par le site.

Les PNG, WebP et JPEG sont calculés depuis les vecteurs à deux fois leur largeur finale, puis réduits avec anticrénelage. Les JPEG conservent la précision des couleurs sur les bords (4:4:4). Les exports ne sont pas des agrandissements d’un petit bitmap. Cette vectorisation reste une reconstruction du PNG fourni, et non le fichier natif du créateur.

## Régénération

Depuis la racine du projet : `npm run brand:build`. Le script est prévu pour les dimensions et la composition de ce logo. Après un remplacement de la source, vérifier les zones d’extraction dans `scripts/build-brand-assets.mjs`, contrôler l’aperçu et incrémenter la version dans `src/config/brand-assets.ts`.

Pour mettre à jour l’archive sous PowerShell :

```powershell
Compress-Archive -Path public/images/logos -DestinationPath public/images/pack-logos-signature-convoyage.zip -Force
```

`inventaire.json` contient les dimensions, la transparence et l’empreinte SHA-256 de la source. `sources/PREPARATION.md` décrit la préparation et l’essai imagegen écarté.
