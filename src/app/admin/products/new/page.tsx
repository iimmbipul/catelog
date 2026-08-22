import { PageHeader } from "@/components/admin/ui";
import { ProductForm } from "@/components/admin/ProductForm";
import { getCollections } from "@/lib/db";

export const metadata = { title: "Admin — New product" };

export default async function NewProductPage() {
  const collections = await getCollections();
  return (
    <>
      <PageHeader
        title="New product"
        subtitle="Add a candle, hamper, or seasonal launch."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Products", href: "/admin/products" }, { label: "New" }]}
      />
      <ProductForm collections={collections} />
    </>
  );
}
