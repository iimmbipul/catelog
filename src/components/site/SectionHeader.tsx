import Link from "next/link";
import { Arrow } from "@/components/ui/Icons";

export function SectionHeader({
  eyebrow,
  title,
  description,
  href,
  cta,
  align = "between",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  cta?: string;
  align?: "between" | "center";
}) {
  if (align === "center") {
    return (
      <div className="mb-10 text-center">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="heading-serif text-editorial max-w-3xl mx-auto">{title}</h2>
        {description && (
          <p className="mx-auto mt-4 max-w-xl text-sm text-cocoa-500">{description}</p>
        )}
      </div>
    );
  }
  return (
    <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="heading-serif text-editorial">{title}</h2>
        {description && <p className="mt-4 text-sm text-cocoa-500 max-w-lg">{description}</p>}
      </div>
      {href && cta && (
        <Link href={href} className="inline-flex items-center gap-2 text-sm uppercase tracking-widish text-cocoa-700">
          {cta} <Arrow />
        </Link>
      )}
    </div>
  );
}
