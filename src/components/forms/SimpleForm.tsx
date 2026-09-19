"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { brand } from "@/config/brand";

export function SimpleForm({
  type = "contact",
}: {
  type?: "contact" | "driver" | "b2b";
}) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submitting = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;

    const fields = new FormData(event.currentTarget);
    const value = (name: string) => String(fields.get(name) ?? "").trim();
    submitting.current = true;
    setSending(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          firstname: value("firstname"),
          lastname: value("lastname"),
          phone: value("phone"),
          email: value("email"),
          message: value("message"),
          consent: fields.get("consent") === "on",
          ...(type === "b2b" && {
            company: value("company"),
            volume: value("volume"),
          }),
          ...(type === "driver" && {
            city: value("city"),
            radius: value("radius"),
            status: value("status"),
            licence: value("licence"),
          }),
        }),
      });
      const result = await response.json();

      if (!response.ok || result?.ok !== true) {
        setError(
          typeof result?.error === "string"
            ? result.error
            : "Votre demande n’a pas pu être envoyée. Veuillez réessayer.",
        );
        return;
      }

      setSent(true);
    } catch {
      setError(
        `L’envoi a échoué. Vérifiez votre connexion et réessayez, ou contactez-nous à ${brand.email}.`,
      );
    } finally {
      submitting.current = false;
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="form-success" role="status">
        <h3>Votre demande a bien été envoyée.</h3>
        <p>Notre équipe vous recontactera dans les meilleurs délais.</p>
      </div>
    );
  }

  return (
    <form className="simple-form" onSubmit={handleSubmit} aria-busy={sending}>
      <div className="two-fields">
        <label>
          Prénom<input required name="firstname" maxLength={100} />
        </label>
        <label>
          Nom<input required name="lastname" maxLength={100} />
        </label>
      </div>
      {type === "b2b" && (
        <>
          <label>
            Société<input required name="company" maxLength={200} />
          </label>
          <label>
            Volume mensuel approximatif
            <input name="volume" inputMode="numeric" maxLength={100} />
          </label>
        </>
      )}
      {type === "driver" && (
        <>
          <div className="two-fields">
            <label>
              Ville<input required name="city" maxLength={200} />
            </label>
            <label>
              Rayon de mobilité<input required name="radius" maxLength={200} />
            </label>
          </div>
          <label>
            Statut professionnel
            <select required name="status" defaultValue="">
              <option value="" disabled>Sélectionner</option>
              <option>Micro-entreprise</option>
              <option>Société</option>
              <option>En création</option>
            </select>
          </label>
          <label>
            Ancienneté de permis<input required name="licence" maxLength={100} />
          </label>
        </>
      )}
      <div className="two-fields">
        <label>
          Téléphone<input required type="tel" name="phone" minLength={6} maxLength={40} />
        </label>
        <label>
          E-mail<input required type="email" name="email" maxLength={254} />
        </label>
      </div>
      <label>
        Votre besoin<textarea required name="message" rows={5} maxLength={5000} />
      </label>
      <p className="privacy-notice">
        Signature Convoyage utilise ces informations pour traiter votre demande et vous recontacter.{" "}
        <Link href="/politique-confidentialite" target="_blank">
          Consulter vos droits et les durées de conservation
        </Link>.
      </p>
      <label className="consent">
        <input required type="checkbox" name="consent" />
        J’ai pris connaissance de la politique de confidentialité.
      </label>
      {error && <p className="field-error" role="alert">{error}</p>}
      <button className="btn primary" type="submit" disabled={sending}>
        {sending ? "Envoi en cours…" : "Envoyer la demande"}
      </button>
    </form>
  );
}
