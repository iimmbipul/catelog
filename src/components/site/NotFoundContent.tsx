import Link from "next/link";

export function NotFoundContent() {
  return (
    <div className="container-page py-24 text-center">
      <p className="eyebrow">Page not found</p>
      <h1 className="mt-4 heading-serif text-hero">This page has burned out.</h1>
      <p className="mx-auto mt-4 max-w-md text-sm text-cocoa-500">
        The page you were looking for has moved or no longer exists. Our candles are still right here.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="rounded-full bg-cocoa-700 px-6 py-3 text-xs uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500">
          Shop candles
        </Link>
        <Link href="/collections" className="rounded-full border hairline px-6 py-3 text-xs uppercase tracking-widish text-cocoa-700 hover:bg-cocoa-500/5">
          Browse collections
        </Link>
      </div>
    </div>
  );
}
