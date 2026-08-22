import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export const metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <div className="container-page pt-8 lg:pt-14 max-w-3xl">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms" }]} />
      <h1 className="mt-6 heading-serif text-hero">Terms of Service</h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-cocoa-500">
        <p>By placing an order on whiteandwick.co you agree to our shipping, returns, and privacy terms as listed on this site. Prices are quoted in INR and inclusive of applicable taxes.</p>
        <p>We reserve the right to cancel any order at our discretion — for example, on suspected fraud, or on items priced incorrectly due to a technical error — and refund any amount paid.</p>
      </div>
    </div>
  );
}
