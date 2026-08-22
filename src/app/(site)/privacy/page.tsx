import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="container-page pt-8 lg:pt-14 max-w-3xl">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy" }]} />
      <h1 className="mt-6 heading-serif text-hero">Privacy Policy</h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-cocoa-500">
        <p>We collect only the information we need to process your order — name, address, contact details, and payment confirmation from our payment provider. We never sell your details.</p>
        <p>You can request a copy or deletion of your data at any time by writing to hello@whiteandwick.co.</p>
        <p>For payment processing we use Razorpay. Payment details are handled directly on Razorpay&apos;s secure servers and never touch our system.</p>
      </div>
    </div>
  );
}
