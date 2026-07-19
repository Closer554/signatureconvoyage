import Link from "next/link";import { Phone } from "lucide-react";import { brand } from "@/config/brand";
export function MobileActionBar(){return <div className="mobile-action">{brand.phone&&<a href={`tel:${brand.phone}`}><Phone size={18}/>Appeler</a>}<Link href="/devis">Demander un devis</Link></div>}
