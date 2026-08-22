import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { getProducts } from "@/lib/db";
import { WishlistClient } from "@/components/site/WishlistClient";

export const metadata = { title: "Wishlist" };

export default async function WishlistPage() {
  const products = await getProducts();
  return (
    <div className="container-page pt-8 lg:pt-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Account", href: "/account" }, { label: "Wishlist" }]} />
      <h1 className="mt-6 heading-serif text-hero">Your wishlist</h1>
      <div className="mt-10">
        <WishlistClient products={products} />
      </div>
    </div>
  );
}
