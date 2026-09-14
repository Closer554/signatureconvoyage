// All public brand uses share the same version, including browser/share caches.
const base = "/images/logos";
const version = "voiture-or-v3";
const asset = (file: string) => `${base}/${file}?v=${version}`;

export const brandAssets = {
  logo: { src: asset("svg/logo-complet.svg"), width: 1120, height: 560 },
  share: { src: asset("reseaux/partage-1200x630.jpg"), width: 1200, height: 630 },
  favicon: asset("icones/favicon.svg"),
  icon: (size: number) => asset(`icones/icone-${size}.png`),
  maskableIcon: asset("icones/icone-maskable-512.png"),
};
