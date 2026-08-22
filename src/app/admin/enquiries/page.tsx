import { PageHeader, Card, StatusPill } from "@/components/admin/ui";
import { getGiftEnquiries } from "@/lib/db";
import { shortDate } from "@/lib/format";
import { EnquiryActions } from "./EnquiryActions";

export const metadata = { title: "Admin — Gift enquiries" };

export default async function EnquiriesPage() {
  const list = await getGiftEnquiries();
  return (
    <>
      <PageHeader
        title="Gift enquiries"
        subtitle="Custom hamper requests from the storefront gifting form."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Gift Enquiries" }]}
      />
      <div className="grid gap-4">
        {list.map((g) => (
          <Card key={g.id}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-serif text-2xl text-cocoa-700">{g.name}</p>
                <p className="text-xs text-cocoa-400">{g.email} · {g.phone} · {shortDate(g.createdAt)}</p>
              </div>
              <StatusPill status={g.status} />
            </div>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <Row label="Occasion" value={g.occasion} />
              <Row label="Quantity" value={g.quantity} />
              <Row label="Budget" value={g.budget} />
              <Row label="Fragrance" value={g.fragrance ?? "—"} />
              <Row label="Preferred candle" value={g.candle ?? "—"} />
              <Row label="Card message" value={g.message ?? "—"} />
              <Row label="Additional" value={g.additional ?? "—"} span2 />
            </div>
            <div className="mt-5">
              <EnquiryActions id={g.id} current={g.status} />
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

function Row({ label, value, span2 }: { label: string; value: string; span2?: boolean }) {
  return (
    <div className={`rounded-xl border hairline bg-ivory-50 p-3 ${span2 ? "sm:col-span-2 lg:col-span-2" : ""}`}>
      <p className="eyebrow">{label}</p>
      <p className="mt-1 text-cocoa-700">{value}</p>
    </div>
  );
}
