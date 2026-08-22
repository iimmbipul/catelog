import { PageHeader } from "@/components/admin/ui";
import { getCollections, getProducts } from "@/lib/db";
import { CollectionsClient } from "./CollectionsClient";

export const metadata = { title: "Admin — Collections" };

export default async function AdminCollectionsPage() {
  const [collections, products] = await Promise.all([getCollections(), getProducts()]);
  // Overlay live product counts. Parent collections include products from
  // their child categories too.
  const withCounts = collections.map((c) => {
    const kids = collections.filter((x) => x.parentSlug === c.slug).map((x) => x.slug);
    const set = new Set([c.slug, ...kids]);
    return {
      ...c,
      productIds: products
        .filter((p) => p.collections.some((s) => set.has(s)) && p.status !== "archived" && p.status !== "draft")
        .map((p) => p.id),
    };
  });
  return (
    <>
      <PageHeader
        title="Collections"
        subtitle="Group products into edits. Any collection can have categories (e.g. Birthdays, Weddings under Gift Sets)."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Collections" }]}
      />
      <CollectionsClient collections={withCounts} />
    </>
  );
}
