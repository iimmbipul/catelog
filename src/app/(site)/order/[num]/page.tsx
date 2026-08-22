import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { getOrderByNumber } from "@/lib/db";
import { money, shortDate } from "@/lib/format";

type Props = { params: Promise<{ num: string }> };

export const metadata = { title: "Order confirmation" };

export default async function OrderConfirmation({ params }: Props) {
  const { num } = await params;
  const order = await getOrderByNumber(num);
  if (!order) return notFound();

  return (
    <div className="container-page pt-8 lg:pt-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: `Order ${order.orderNumber}` }]} />

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="eyebrow">Thank you</p>
          <h1 className="mt-3 heading-serif text-hero">Your order is confirmed.</h1>
          <p className="mt-4 max-w-md text-sm text-cocoa-500">
            We&apos;ll email you a receipt shortly. You can track your order status in your account.
          </p>

          <div className="mt-8 rounded-3xl border hairline bg-ivory-50 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="eyebrow">Order</p>
                <p className="mt-1 font-serif text-2xl text-cocoa-700">{order.orderNumber}</p>
              </div>
              <div>
                <p className="eyebrow">Placed</p>
                <p className="mt-1 text-sm text-cocoa-700">{shortDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="eyebrow">Payment</p>
                <p className="mt-1 text-sm capitalize text-cocoa-700">{order.paymentStatus}</p>
              </div>
              <div>
                <p className="eyebrow">Status</p>
                <p className="mt-1 text-sm capitalize text-cocoa-700">{order.orderStatus.replace("_", " ")}</p>
              </div>
            </div>

            <ul className="mt-8 divide-y hairline">
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
          </div>
        </div>

        <aside className="space-y-4 rounded-3xl border hairline bg-ivory-50 p-6">
          <div>
            <p className="eyebrow">Shipping to</p>
            <p className="mt-2 text-sm text-cocoa-700">{order.address.name}</p>
            <p className="text-sm text-cocoa-500">
              {order.address.line1}, {order.address.area}, {order.address.city},
              {" "}{order.address.state} {order.address.pincode}
            </p>
            <p className="mt-1 text-sm text-cocoa-500">{order.address.phone}</p>
          </div>

          <div>
            <p className="eyebrow">Estimated delivery</p>
            <p className="mt-2 text-sm text-cocoa-700">3–6 business days</p>
          </div>

          {order.giftMessage && (
            <div>
              <p className="eyebrow">Gift note</p>
              <p className="mt-2 text-sm text-cocoa-700 italic">“{order.giftMessage}”</p>
            </div>
          )}

          <Link href="/shop" className="mt-4 block rounded-full border border-cocoa-700 py-3 text-center text-xs uppercase tracking-widish text-cocoa-700 hover:bg-cocoa-700 hover:text-ivory-50">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
