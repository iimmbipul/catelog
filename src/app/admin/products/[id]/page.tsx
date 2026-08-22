import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/ui";
import { ProductForm } from "@/components/admin/ProductForm";
import { getCollections, getProductById } from "@/lib/db";

type Props = { params: Promise<{ id: string }> };

export const metadata = { title: "Admin — Edit product" };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const [product, collections] = await Promise.all([getProductById(id), getCollections()]);
  if (!product) return notFound();
  return (
    <>
      <PageHeader
        title={product.name}
        subtitle={`SKU ${product.sku}`}
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Products", href: "/admin/products" }, { label: product.name }]}
      />
      <ProductForm product={product} collections={collections} />
    </>
  );
}
