import Image from "next/image";
import Link from "next/link";
import { brand } from "@/config/brand";
import { brandAssets } from "@/config/brand-assets";

export function Logo() {
  return (
    <Link className="logo" href="/" aria-label={`${brand.brandName}, accueil`}>
      <Image
        src={brandAssets.logo.src}
        alt={brand.brandName}
        width={brandAssets.logo.width}
        height={brandAssets.logo.height}
        unoptimized
        priority
      />
    </Link>
  );
}
