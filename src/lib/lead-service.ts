import { Resend } from "resend";

import { brand } from "@/config/brand";
import type { ContactData, QuoteData } from "@/lib/validation";

const vehicleCategoryLabels: Record<string, string> = {
  voiture: "Voiture",
  utilitaire: "Utilitaire / SUV",
  moto: "Moto",
  poids_lourd: "Poids lourd",
  bus: "Bus / autocar",
};

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#039;",
      '"': "&quot;",
    };

    return entities[character];
  });
}

function formatDate(value: string) {
  const date = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(date);
}

function buildQuoteEmail(data: QuoteData) {
  const vehicle = [
    vehicleCategoryLabels[data.vehicleCategory] ?? data.vehicleCategory,
    data.vehicleMake,
    data.vehicleModel,
    data.vehicleYear,
  ]
    .filter(Boolean)
    .join(" · ");

  const rows = [
    ["Profil", data.profile],
    ["Société", data.company || "Non renseignée"],
    ["Départ", data.departure],
    ["Arrivée", data.arrival],
    ["Véhicule", vehicle],
    ["Véhicule roulant", data.running],
    ["Date souhaitée", formatDate(data.date)],
    ["Nom", data.name],
    ["Téléphone", data.phone],
    ["E-mail", data.email],
  ] as const;

  return buildFormEmail({
    title: "Nouvelle demande de devis",
    introduction: "Une nouvelle demande de convoyage a été envoyée depuis le site.",
    rows,
    message: data.comment?.trim() || "Aucune précision complémentaire.",
    replyTo: data.email,
  });
}

function buildContactEmail(data: ContactData) {
  const titles = {
    contact: "Nouvelle demande de contact",
    b2b: "Nouvelle demande professionnelle",
    driver: "Nouvelle candidature convoyeur",
  };
  const rows: [string, string][] = [
    ["Prénom", data.firstname],
    ["Nom", data.lastname],
    ["Téléphone", data.phone],
    ["E-mail", data.email],
  ];

  if (data.type === "b2b") {
    rows.push(
      ["Société", data.company],
      ["Volume mensuel approximatif", data.volume || "Non renseigné"],
    );
  }
  if (data.type === "driver") {
    rows.push(
      ["Ville", data.city],
      ["Rayon de mobilité", data.radius],
      ["Statut professionnel", data.status],
      ["Ancienneté de permis", data.licence],
    );
  }

  return buildFormEmail({
    title: titles[data.type],
    introduction: "Une nouvelle demande a été envoyée depuis le site.",
    rows,
    message: data.message,
    replyTo: data.email,
  });
}

function buildFormEmail({ title, introduction, rows, message, replyTo }: {
  title: string;
  introduction: string;
  rows: readonly (readonly [string, string])[];
  message: string;
  replyTo: string;
}) {
  const htmlRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:12px 16px;border-bottom:1px solid #d8e3e9;color:#52687a;font-size:13px;width:34%;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:12px 16px;border-bottom:1px solid #d8e3e9;color:#0b2033;font-size:14px;font-weight:600;vertical-align:top;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  return {
    subject: `${title} — ${brand.brandName}`,
    replyTo,
    html: `<!doctype html>
      <html lang="fr">
        <body style="margin:0;padding:0;background:#e8f4f9;font-family:Arial,sans-serif;color:#0b2033;">
          <div style="padding:32px 16px;">
            <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 16px 45px rgba(11,32,51,.10);">
              <div style="padding:28px 32px;background:#0b2033;color:#ffffff;">
                <p style="margin:0 0 8px;color:#b9ddee;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">${escapeHtml(brand.brandName)}</p>
                <h1 style="margin:0;font-size:26px;line-height:1.25;">${escapeHtml(title)}</h1>
              </div>
              <div style="padding:28px 32px;">
                <p style="margin:0 0 24px;color:#52687a;line-height:1.6;">${escapeHtml(introduction)}</p>
                <table role="presentation" style="width:100%;border-collapse:collapse;border:1px solid #d8e3e9;border-radius:10px;overflow:hidden;">
                  ${htmlRows}
                </table>
                <div style="margin-top:24px;padding:18px;background:#f7f4ee;border-radius:10px;">
                  <p style="margin:0 0 8px;color:#52687a;font-size:12px;font-weight:700;text-transform:uppercase;">Précisions</p>
                  <p style="margin:0;white-space:pre-wrap;line-height:1.6;">${escapeHtml(message)}</p>
                </div>
                <p style="margin:24px 0 0;color:#52687a;font-size:12px;line-height:1.5;">Le demandeur a accepté la politique de confidentialité. Répondez à cet e-mail pour le contacter à ${escapeHtml(replyTo)}.</p>
              </div>
            </div>
          </div>
        </body>
      </html>`,
    text: [
      `${title} — ${brand.brandName}`,
      "",
      ...rows.map(([label, value]) => `${label} : ${value}`),
      "",
      "Précisions :",
      message,
      "",
      "Le demandeur a accepté la politique de confidentialité.",
    ].join("\n"),
  };
}

export async function submitLead(data: QuoteData) {
  return sendFormEmail(buildQuoteEmail(data));
}

export async function submitContact(data: ContactData) {
  return sendFormEmail(buildContactEmail(data));
}

async function sendFormEmail(email: ReturnType<typeof buildFormEmail>) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  const recipients = (process.env.RESEND_TO_EMAIL?.trim() || brand.email)
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  if (!apiKey || !from || recipients.length === 0) {
    console.error(
      "[Resend] Configuration incomplète : RESEND_API_KEY, RESEND_FROM_EMAIL et un destinataire sont requis.",
    );
    return {
      ok: false as const,
      error: `L’envoi est momentanément indisponible. Contactez-nous à ${brand.email}.`,
    };
  }

  const resend = new Resend(apiKey);

  try {
    const { data: sentEmail, error } = await resend.emails.send({
      from,
      to: recipients,
      replyTo: email.replyTo,
      subject: email.subject,
      html: email.html,
      text: email.text,
    });

    if (error) {
      console.error("[Resend] Échec de l’envoi du formulaire", error);
      return {
        ok: false as const,
        error: `La transmission a échoué. Réessayez ou écrivez-nous à ${brand.email}.`,
      };
    }

    if (!sentEmail?.id) {
      return {
        ok: false as const,
        error: `La transmission n’a pas été confirmée. Contactez-nous à ${brand.email}.`,
      };
    }

    console.info("[Resend] Formulaire envoyé", { emailId: sentEmail.id });
    return { ok: true as const };
  } catch (error) {
    console.error("[Resend] Erreur inattendue pendant l’envoi du formulaire", error);
    return {
      ok: false as const,
      error: `La transmission a échoué. Réessayez ou écrivez-nous à ${brand.email}.`,
    };
  }
}
