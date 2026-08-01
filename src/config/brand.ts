export type BusinessHours = { day: number; label: string; open: string; close: string };

export const brand = {
  brandName: "Signature Convoyage",
  legalName: "SERVICE VOITURIER PARIS" as string | null,
  foundingYear: null as number | null,
  experienceYears: null as number | null,
  phone: null as string | null,
  email: "contact@paris-service-voiturier.com" as string | null,
  address: "5 Avenue Chausson, 92230 Gennevilliers, France" as string | null,
  responseSlaMinutes: null as number | null,
  businessHours: [] as BusinessHours[],
  emergencyPhone: null as string | null,
  coverageClaim: "Nous organisons des prises en charge dans toute la France métropolitaine, y compris en Corse, avec un pilotage centralisé et des convoyeurs mobilisés au plus près des besoins.",
  verifiedStats: [] as { value: string; label: string }[],
  customerLogos: [] as { src: string; alt: string }[],
  insuranceCopy: null as string | null,
  socialLinks: [] as { label: string; url: string }[],
  leadWebhookUrl: process.env.LEAD_WEBHOOK_URL ?? null,
  crmProvider: null as string | null,
};
