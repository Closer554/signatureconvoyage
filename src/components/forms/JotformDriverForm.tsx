"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./JotformDriverForm.module.css";

const JOTFORM_SCRIPT_URL = "https://form.jotform.com/jsform/262104829585059";

export function JotformDriverForm() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const script = document.createElement("script");
    script.src = JOTFORM_SCRIPT_URL;
    script.type = "text/javascript";
    script.async = true;
    container.appendChild(script);

    return () => container.replaceChildren();
  }, []);

  return <div className={styles.formPanel}><div className={styles.formHeader}><span>Candidature</span><p>Complétez le formulaire ci-dessous. Nous reviendrons vers vous après étude de votre profil.</p></div><div ref={containerRef} className={styles.container} aria-label="Formulaire de candidature convoyeur" /><p className="privacy-notice">Vos informations sont utilisées par SERVICE VOITURIER PARIS uniquement pour étudier votre candidature. Le formulaire est hébergé par Jotform. <Link href="/politique-confidentialite" target="_blank">En savoir plus sur vos données et vos droits</Link>.</p></div>;
}
