import Link from "next/link";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { getOrders } from "@/lib/db";
import { money, shortDate } from "@/lib/format";

export const metadata = { title: "My account" };

export default async function AccountPage() {
  // Demo — show orders from any customer as example
  const orders = (await getOrders()).slice(0, 5);
  return (
    <div className="container-page pt-8 lg:pt-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Account" }]} />

      <div className="mt-8 grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border hairline bg-ivory-50 p-5">
          <p className="eyebrow">Hello,</p>
          <p className="mt-2 font-serif text-2xl text-cocoa-700">Ananya</p>
          <p className="text-sm text-cocoa-500">ananya.sharma@example.com</p>
          <nav className="mt-6 space-y-2 text-sm">
            <Link href="/account" className="block rounded-lg bg-cocoa-700 px-3 py-2 text-ivory-50">Orders</Link>
            <Link href="/account/wishlist" className="block rounded-lg px-3 py-2 text-cocoa-700 hover:bg-cocoa-500/5">Wishlist</Link>
            <Link href="/account/addresses" className="block rounded-lg px-3 py-2 text-cocoa-700 hover:bg-cocoa-500/5">Saved addresses</Link>
            <Link href="/account/profile" className="block rounded-lg px-3 py-2 text-cocoa-700 hover:bg-cocoa-500/5">Profile</Link>
            <button className="mt-4 block w-full text-left rounded-lg px-3 py-2 text-xs uppercase tracking-widish text-rose-500 hover:bg-cocoa-500/5">Sign out</button>
          </nav>
        </aside>

        <div>
          <h1 className="mb-6 heading-serif text-hero">Your orders</h1>
          <ul className="space-y-4">
            {orders.map((o) => (
              <li key={o.id} className="rounded-2xl border hairline bg-ivory-50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-serif text-xl text-cocoa-700">{o.orderNumber}</p>
                    <p className="text-xs text-cocoa-400">Placed {shortDate(o.createdAt)}</p>
                  </div>
                  <div className="text-sm">
                    <span className="rounded-full border hairline px-3 py-1 uppercase tracking-widish text-[11px] text-cocoa-700">{o.orderStatus.replace("_", " ")}</span>
                  </div>
                  <p className="font-serif text-xl text-cocoa-700">{money(o.total)}</p>
                  <Link href={`/order/${o.orderNumber}`} className="text-xs uppercase tracking-widish text-cocoa-700 link-underline">
                    View details
                  </Link>
                </div>
                <ul className="mt-4 flex gap-2 text-xs text-cocoa-500">
                  {o.items.map((i) => (
                    <li key={i.productId} className="rounded-full bg-white px-3 py-1">{i.name} × {i.qty}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
