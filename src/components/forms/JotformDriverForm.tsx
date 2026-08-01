"use client";

import { useEffect, useRef } from "react";
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

  return <div ref={containerRef} className={styles.container} aria-label="Formulaire de candidature convoyeur" />;
}
