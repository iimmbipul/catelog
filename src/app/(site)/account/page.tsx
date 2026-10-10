import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignOutButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { getOrders } from "@/lib/db";
import { money, shortDate } from "@/lib/format";

export const metadata = { title: "My account" };

export default async function AccountPage() {
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress?.toLowerCase() ?? null;
  const firstName = user?.firstName ?? user?.fullName?.split(" ")[0] ?? null;
  const greeting = firstName || email?.split("@")[0] || "there";

  // Only show orders the signed-in user actually placed.
  const allOrders = email ? await getOrders() : [];
  const orders = allOrders
    .filter((o) => (o.address?.email ?? "").toLowerCase() === email)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 20);

  return (
    <div className="container-page pt-8 lg:pt-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Account" }]} />

      <SignedOut>
        <div className="mx-auto mt-16 max-w-md rounded-3xl border hairline bg-ivory-50 p-10 text-center">
          <p className="eyebrow">My account</p>
          <h1 className="mt-3 font-serif text-3xl text-cocoa-700">Sign in to see your orders.</h1>
          <p className="mt-3 text-sm text-cocoa-500">
            Track previous orders, save your addresses, and manage your profile.
          </p>
          <div className="mt-6">
            <SignInButton mode="redirect">
              <button className="rounded-full bg-cocoa-700 px-7 py-3 text-sm uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500">
                Sign in
              </button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="mt-8 grid gap-10 lg:grid-cols-[240px_1fr]">
          <aside className="rounded-2xl border hairline bg-ivory-50 p-5">
            <p className="eyebrow">Hello,</p>
            <p className="mt-2 font-serif text-2xl text-cocoa-700">{greeting}</p>
            {email && <p className="text-sm text-cocoa-500 break-all">{email}</p>}
            <nav className="mt-6 space-y-2 text-sm">
              <Link href="/account" className="block rounded-lg bg-cocoa-700 px-3 py-2 text-ivory-50">
                Orders
              </Link>
              <Link href="/account/wishlist" className="block rounded-lg px-3 py-2 text-cocoa-700 hover:bg-cocoa-500/5">
                Wishlist
              </Link>
              <SignOutButton>
                <button className="mt-4 block w-full text-left rounded-lg px-3 py-2 text-xs uppercase tracking-widish text-rose-500 hover:bg-cocoa-500/5">
                  Sign out
                </button>
              </SignOutButton>
            </nav>
          </aside>

          <div>
            <h1 className="mb-6 heading-serif text-hero">Your orders</h1>
            {orders.length === 0 ? (
              <div className="rounded-2xl border hairline bg-ivory-50 p-10 text-center">
                <p className="font-serif text-xl text-cocoa-700">No orders yet.</p>
                <p className="mt-2 text-sm text-cocoa-500">
                  Once you check out, your orders will appear here.
                </p>
                <Link
                  href="/shop"
                  className="mt-6 inline-block rounded-full bg-cocoa-700 px-6 py-3 text-xs uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500"
                >
                  Shop candles
                </Link>
              </div>
            ) : (
              <ul className="space-y-4">
                {orders.map((o) => (
                  <li key={o.id} className="rounded-2xl border hairline bg-ivory-50 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="font-serif text-xl text-cocoa-700">{o.orderNumber}</p>
                        <p className="text-xs text-cocoa-400">Placed {shortDate(o.createdAt)}</p>
                      </div>
                      <span className="rounded-full border hairline px-3 py-1 uppercase tracking-widish text-[11px] text-cocoa-700">
                        {o.orderStatus.replace("_", " ")}
                      </span>
                      <p className="font-serif text-xl text-cocoa-700">{money(o.total)}</p>
                      <Link
                        href={`/order/${o.orderNumber}`}
                        className="text-xs uppercase tracking-widish text-cocoa-700 link-underline"
                      >
                        View details
                      </Link>
                    </div>
                    <ul className="mt-4 flex flex-wrap gap-2 text-xs text-cocoa-500">
                      {o.items.map((i) => (
                        <li key={i.productId} className="rounded-full bg-white px-3 py-1">
                          {i.name} × {i.qty}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </SignedIn>
    </div>
  );
}
