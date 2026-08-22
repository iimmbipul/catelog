import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHeader, Card } from "@/components/admin/ui";
import { getOrderByNumber } from "@/lib/db";
import { money, shortDate } from "@/lib/format";
import { OrderStatusControls } from "./OrderStatusControls";

type Props = { params: Promise<{ num: string }> };

export default async function OrderDetailPage({ params }: Props) {
  const { num } = await params;
  const order = await getOrderByNumber(num);
  if (!order) return notFound();

  return (
    <>
      <PageHeader
        title={order.orderNumber}
        subtitle={`Placed on ${shortDate(order.createdAt)} by ${order.customerName}`}
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Orders", href: "/admin/orders" }, { label: order.orderNumber }]}
      />

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <Card>
            <p className="eyebrow">Items</p>
            <ul className="mt-4 divide-y hairline">
              {order.items.map((i) => (
                <li key={`${i.productId}::${i.fragrance ?? ""}::${i.color ?? ""}`} className="flex items-center gap-4 py-4">
                  <div className="relative h-16 w-14 overflow-hidden rounded-lg bg-ivory-100">
                    <Image src={i.image} alt={i.name} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="flex-1">
                    <p className="font-serif text-lg text-cocoa-700">{i.name}</p>
                    <p className="text-xs text-cocoa-400">
                      {[i.color, i.fragrance, `Qty ${i.qty}`].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <span className="text-sm text-cocoa-700">{money(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-2 border-t hairline pt-6 text-sm text-cocoa-500">
              <div className="flex justify-between"><span>Subtotal</span><span className="text-cocoa-700">{money(order.subtotal)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-rose-500"><span>Discount {order.coupon ? `(${order.coupon})` : ""}</span><span>− {money(order.discount)}</span></div>}
              <div className="flex justify-between"><span>Shipping</span><span className="text-cocoa-700">{order.shipping === 0 ? "Free" : money(order.shipping)}</span></div>
              <div className="flex justify-between border-t hairline pt-3">
                <span className="font-serif text-lg text-cocoa-700">Total</span>
                <span className="font-serif text-2xl text-cocoa-700">{money(order.total)}</span>
              </div>
            </div>
          </Card>

          {order.giftMessage && (
            <Card>
              <p className="eyebrow">Gift message</p>
              <p className="mt-2 italic text-cocoa-700">“{order.giftMessage}”</p>
            </Card>
          )}
          {order.notes && (
            <Card>
              <p className="eyebrow">Customer notes</p>
              <p className="mt-2 text-cocoa-700">{order.notes}</p>
            </Card>
          )}
        </div>

        <div className="space-y-5">
          <OrderStatusControls orderNumber={order.orderNumber} orderStatus={order.orderStatus} paymentStatus={order.paymentStatus} />
          <Card>
            <p className="eyebrow">Shipping address</p>
            <p className="mt-2 text-sm text-cocoa-700">{order.address.name}</p>
            <p className="text-sm text-cocoa-500">
              {order.address.line1}, {order.address.area}, {order.address.city},
              {" "}{order.address.state} {order.address.pincode}
            </p>
            <p className="mt-1 text-sm text-cocoa-500">{order.address.phone}</p>
          </Card>
        </div>
      </div>
    </>
  );
}
