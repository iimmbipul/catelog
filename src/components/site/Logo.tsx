import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

/* Renders the brand mark from /public/logo.jpeg — the image already contains
 * the wordmark, so no accompanying text is rendered next to it. */

export function Logo({ className, small }: { className?: string; small?: boolean }) {
  const size = small ? 36 : 48;
  return (
    <Link href="/" aria-label="White & Wick — home" className={cn("inline-flex items-center", className)}>
      <Image
        src="/logo.jpeg"
        alt="White & Wick"
        width={size * 2}
        height={size * 2}
        priority={!small}
        sizes={`${size}px`}
        style={{ width: size, height: size }}
        className="rounded-full object-contain"
      />
    </Link>
  );
}
