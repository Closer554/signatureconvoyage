import type { Metadata } from "next";import { QuoteWizard } from "@/components/forms/QuoteWizard";
export const metadata:Metadata={title:"Demande de devis",description:"Demandez un devis de convoyage automobile en quelques étapes.",alternates:{canonical:"/devis"}};
export default function Page(){return <div className="form-page" id="adresses"><div className="page-intro"><span className="eyebrow">Votre trajet</span><h1>Organisons le déplacement de votre véhicule.</h1><p>Aucun prix automatique : votre demande est vérifiée par une personne avant toute proposition.</p></div><QuoteWizard/></div>}
