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

  return <><p className="privacy-notice">Les informations saisies sont traitées par SERVICE VOITURIER PARIS afin d’étudier votre candidature. Le formulaire est fourni par Jotform. <Link href="/politique-confidentialite" target="_blank">Consulter vos droits et les modalités de conservation</Link>.</p><div ref={containerRef} className={styles.container} aria-label="Formulaire de candidature convoyeur" /></>;
}
