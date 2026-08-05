const fallbackUrl = "https://www.paris-service-voiturier.com";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? fallbackUrl).replace(/\/$/, "");
export const siteName = "Signature Convoyage";
export const siteDescription = "Convoyage automobile partout en France pour les professionnels et les particuliers, avec un suivi clair de la prise en charge à la livraison.";

