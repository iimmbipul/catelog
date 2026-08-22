import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CheckoutClient } from "@/components/site/CheckoutClient";
import { getCoupons } from "@/lib/db";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const coupons = await getCoupons();
  return (
    <div className="container-page pt-8 lg:pt-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
      <h1 className="mt-6 heading-serif text-hero">Checkout</h1>
      <p className="mt-2 max-w-lg text-sm text-cocoa-500">Almost there — we&apos;ll hand-pack, gift-wrap, and dispatch your order within a working day.</p>
      <div className="mt-10">
        <CheckoutClient coupons={coupons} />
      </div>
    </div>
  );
}
