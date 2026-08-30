"use client";
import Image from "next/image";
import Link from "next/link";
import { useUI } from "@/lib/store";
import { Close } from "@/components/ui/Icons";

export function Toaster() {
  const { toasts, dismissToast, setCartOpen } = useUI();
  if (toasts.length === 0) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-3 sm:bottom-6 sm:right-6 sm:left-auto sm:items-end sm:px-0">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border hairline bg-white p-3 shadow-card animate-fade-up"
        >
          {t.image && (
            <div className="relative h-14 w-12 flex-none overflow-hidden rounded-lg bg-ivory-100">
              <Image src={t.image} alt="" fill className="object-cover" sizes="48px" />
            </div>
          )}
          <div className="flex-1 pt-0.5">
            <p className="eyebrow text-sage-300">Added to cart</p>
            <p className="mt-1 font-serif text-base text-cocoa-700 leading-tight">{t.title}</p>
            {t.subtitle && <p className="mt-0.5 text-xs text-cocoa-400">{t.subtitle}</p>}
            <div className="mt-2 flex items-center gap-3 text-xs uppercase tracking-widish">
              <button
                onClick={() => { setCartOpen(true); dismissToast(t.id); }}
                className="text-cocoa-700 link-underline"
              >
                View cart
              </button>
              <Link
                href="/checkout"
                onClick={() => dismissToast(t.id)}
                className="text-cocoa-500 link-underline"
              >
                Checkout
              </Link>
            </div>
          </div>
          <button
            aria-label="Dismiss"
            onClick={() => dismissToast(t.id)}
            className="grid h-7 w-7 flex-none place-items-center rounded-full text-cocoa-400 hover:text-cocoa-700"
          >
            <Close className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
