import { Resend } from "resend";

import { brand } from "@/config/brand";
import type { QuoteData } from "@/lib/validation";

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

  const htmlRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:12px 16px;border-bottom:1px solid #d8e3e9;color:#52687a;font-size:13px;width:34%;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:12px 16px;border-bottom:1px solid #d8e3e9;color:#0b2033;font-size:14px;font-weight:600;vertical-align:top;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  const comment = data.comment?.trim() || "Aucune précision complémentaire.";

  return {
    html: `<!doctype html>
      <html lang="fr">
        <body style="margin:0;padding:0;background:#e8f4f9;font-family:Arial,sans-serif;color:#0b2033;">
          <div style="padding:32px 16px;">
            <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 16px 45px rgba(11,32,51,.10);">
              <div style="padding:28px 32px;background:#0b2033;color:#ffffff;">
                <p style="margin:0 0 8px;color:#b9ddee;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">${escapeHtml(brand.brandName)}</p>
                <h1 style="margin:0;font-size:26px;line-height:1.25;">Nouvelle demande de devis</h1>
              </div>
              <div style="padding:28px 32px;">
                <p style="margin:0 0 24px;color:#52687a;line-height:1.6;">Une nouvelle demande de convoyage a été envoyée depuis le site.</p>
                <table role="presentation" style="width:100%;border-collapse:collapse;border:1px solid #d8e3e9;border-radius:10px;overflow:hidden;">
                  ${htmlRows}
                </table>
                <div style="margin-top:24px;padding:18px;background:#f7f4ee;border-radius:10px;">
                  <p style="margin:0 0 8px;color:#52687a;font-size:12px;font-weight:700;text-transform:uppercase;">Précisions</p>
                  <p style="margin:0;white-space:pre-wrap;line-height:1.6;">${escapeHtml(comment)}</p>
                </div>
                <p style="margin:24px 0 0;color:#52687a;font-size:12px;line-height:1.5;">Le demandeur a accepté la politique de confidentialité. Répondez à cet e-mail pour le contacter à ${escapeHtml(data.email)}.</p>
              </div>
            </div>
          </div>
        </body>
      </html>`,
    text: [
      `Nouvelle demande de devis — ${brand.brandName}`,
      "",
      ...rows.map(([label, value]) => `${label} : ${value}`),
      "",
      "Précisions :",
      comment,
      "",
      "Le demandeur a accepté la politique de confidentialité.",
    ].join("\n"),
  };
}

export async function submitLead(data: QuoteData) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  const recipients = (process.env.RESEND_TO_EMAIL ?? "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  if (!apiKey || !from || recipients.length === 0) {
    console.error(
      "[Resend] Configuration incomplète : RESEND_API_KEY, RESEND_FROM_EMAIL et un destinataire sont requis.",
    );
    return {
      ok: false as const,
      error: "Le formulaire n’est pas encore configuré. Contactez-nous directement.",
    };
  }

  const resend = new Resend(apiKey);
  const email = buildQuoteEmail(data);

  try {
    const { data: sentEmail, error } = await resend.emails.send({
      from,
      to: recipients,
      replyTo: data.email,
      subject: `Nouvelle demande de devis — ${brand.brandName}`,
      html: email.html,
      text: email.text,
    });

    if (error) {
      console.error("[Resend] Échec de l’envoi du devis", error);
      return {
        ok: false as const,
        error: "La transmission a échoué. Réessayez ou contactez-nous directement.",
      };
    }

    console.info("[Resend] Demande de devis envoyée", { emailId: sentEmail?.id });
    return { ok: true as const };
  } catch (error) {
    console.error("[Resend] Erreur inattendue pendant l’envoi du devis", error);
    return {
      ok: false as const,
      error: "La transmission a échoué. Réessayez ou contactez-nous directement.",
    };
  }
}
