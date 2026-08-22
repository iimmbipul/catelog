import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export const metadata = { title: "Returns" };

export default function ReturnsPage() {
  return (
    <div className="container-page pt-8 lg:pt-14 max-w-3xl">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Returns" }]} />
      <h1 className="mt-6 heading-serif text-hero">Returns</h1>
      <div className="prose mt-8 max-w-none text-sm leading-relaxed text-cocoa-500">
        <p>For hygiene reasons we can&apos;t accept returns on candles that have been burned. Unopened, unused candles can be returned within 7 days of delivery for a full refund or exchange.</p>
        <p className="mt-4">If your parcel arrives damaged, please photograph it and email hello@whiteandwick.co within 48 hours — we&apos;ll replace it right away.</p>
      </div>
    </div>
  );
}
