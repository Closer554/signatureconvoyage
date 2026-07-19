import Image from "next/image";
import Link from "next/link";
import { brand } from "@/config/brand";

export function Logo() {
  return (
    <Link className="logo" href="/" aria-label={`${brand.brandName}, accueil`}>
      <span className="logo-mark" aria-hidden="true">
        <Image
          src="/signature-mark.png"
          alt=""
          width={348}
          height={304}
          priority
        />
      </span>
      <span className="logo-name">
        <span>Signature</span>
        <span>Convoyage</span>
      </span>
    </Link>
  );
}
