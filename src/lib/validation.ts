import { z } from "zod";

export const quoteSchema = z.object({
  profile: z.enum(["Entreprise", "Particulier"]),
  departure: z.string().trim().min(3, "Indiquez une adresse de départ").max(200),
  arrival: z.string().trim().min(3, "Indiquez une adresse d’arrivée").max(200),
  vehicleCategory: z.string().trim().min(2, "Choisissez une catégorie").max(40),
  vehicleMake: z.string().trim().min(1, "Choisissez une marque").max(80),
  vehicleModel: z.string().trim().max(80).optional(),
  vehicleYear: z.string().trim().max(4).optional(),
  running: z.enum(["Oui", "Non"]),
  date: z.string().trim().min(1, "Choisissez une date").max(10),
  name: z.string().trim().min(2, "Indiquez votre nom").max(120),
  company: z.string().trim().max(120).optional(),
  phone: z.string().trim().min(6, "Numéro incomplet").max(30),
  email: z.string().trim().email("Adresse e-mail invalide").max(254),
  comment: z.string().trim().max(2_000).optional(),
  consent: z.literal(true, { message: "Votre accord est nécessaire" }),
});

export type QuoteData = z.infer<typeof quoteSchema>;

const contactFields = {
  firstname: z.string().trim().min(1, "Indiquez votre prénom").max(100),
  lastname: z.string().trim().min(1, "Indiquez votre nom").max(100),
  phone: z.string().trim().min(6, "Numéro incomplet").max(40),
  email: z.string().trim().email("Adresse e-mail invalide").max(254),
  message: z.string().trim().min(1, "Décrivez votre besoin").max(5_000),
  consent: z.literal(true, { message: "Votre accord est nécessaire" }),
};

export const contactSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("contact"), ...contactFields }),
  z.object({
    type: z.literal("b2b"),
    ...contactFields,
    company: z.string().trim().min(1, "Indiquez votre société").max(200),
    volume: z.string().trim().max(100).optional(),
  }),
  z.object({
    type: z.literal("driver"),
    ...contactFields,
    city: z.string().trim().min(1, "Indiquez votre ville").max(200),
    radius: z.string().trim().min(1, "Indiquez votre rayon de mobilité").max(200),
    status: z.enum(["Micro-entreprise", "Société", "En création"]),
    licence: z.string().trim().min(1, "Indiquez votre ancienneté de permis").max(100),
  }),
]);

export type ContactData = z.infer<typeof contactSchema>;
