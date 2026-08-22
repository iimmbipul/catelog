import { PageHeader, Card } from "@/components/admin/ui";
import { getProducts, getReviews } from "@/lib/db";
import { shortDate } from "@/lib/format";
import { Star } from "@/components/ui/Icons";
import { ReviewActions } from "./ReviewActions";

export const metadata = { title: "Admin — Reviews" };

export default async function ReviewsPage() {
  const [reviews, products] = await Promise.all([getReviews(), getProducts()]);
  return (
    <>
      <PageHeader
        title="Reviews"
        subtitle="Moderate customer reviews. Only approved reviews show on the storefront."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Reviews" }]}
      />

      <div className="grid gap-4">
        {reviews.map((r) => {
          const product = products.find((p) => p.id === r.productId);
          return (
            <Card key={r.id}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-cocoa-700">
                    {Array.from({ length: r.rating }).map((_, i) => <Star key={i} filled />)}
                  </div>
                  <p className="mt-2 font-serif text-xl text-cocoa-700">{r.title}</p>
                  <p className="mt-1 text-xs text-cocoa-400">
                    {r.customerName} · {shortDate(r.createdAt)} · {product?.name ?? "—"}
                  </p>
                </div>
                <span className={`rounded-full border hairline px-3 py-1 text-[11px] uppercase tracking-widish ${r.approved ? "bg-sage-100 text-sage-300" : "text-cocoa-500"}`}>
                  {r.approved ? "Approved" : "Pending"}
                </span>
              </div>
              <p className="mt-4 text-sm text-cocoa-700">“{r.body}”</p>
              <div className="mt-5">
                <ReviewActions id={r.id} approved={r.approved} />
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
