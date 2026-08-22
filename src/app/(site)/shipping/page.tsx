import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export const metadata = { title: "Shipping" };

export default function ShippingPage() {
  return (
    <div className="container-page pt-8 lg:pt-14 max-w-3xl">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shipping" }]} />
      <h1 className="mt-6 heading-serif text-hero">Shipping</h1>
      <div className="prose mt-8 max-w-none text-sm leading-relaxed text-cocoa-500">
        <p>We ship pan-India. Standard delivery takes 3–6 business days depending on your city. Orders above ₹999 ship free — a flat ₹60 applies below that.</p>
        <p className="mt-4">Orders placed before 2pm IST are typically dispatched the same day. You&apos;ll receive a tracking link on WhatsApp and email as soon as the parcel leaves our studio.</p>
        <p className="mt-4">During festive season (Diwali, Rakhi), please add 1–2 days for delivery due to courier volume.</p>
      </div>
    </div>
  );
}
