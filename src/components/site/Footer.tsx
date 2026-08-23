import Link from "next/link";
import { Logo } from "./Logo";
import { Facebook, Instagram, Whatsapp, Youtube } from "@/components/ui/Icons";
import { getSettings } from "@/lib/db";

const col = "space-y-3 text-sm text-cocoa-500";
const heading = "eyebrow text-cocoa-400";

export async function Footer() {
  const settings = await getSettings();
  const s = settings.socials;
  const socials: { href: string; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [];
  if (s.instagram?.trim()) socials.push({ href: s.instagram, label: "Instagram", Icon: Instagram });
  if (s.youtube?.trim()) socials.push({ href: s.youtube, label: "YouTube", Icon: Youtube });
  if (s.facebook?.trim()) socials.push({ href: s.facebook, label: "Facebook", Icon: Facebook });
  if (s.whatsapp?.trim()) socials.push({ href: s.whatsapp, label: "WhatsApp", Icon: Whatsapp });

  return (
    <footer className="mt-24 border-t hairline bg-ivory-100/70">
      <div className="container-page py-16">
        <div className="grid gap-12 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="max-w-sm space-y-5">
            <Logo />
            <p className="text-sm leading-relaxed text-cocoa-500">
              White & Wick creates thoughtfully crafted candles designed to
              turn ordinary moments into warm, beautiful rituals.
            </p>
            {socials.length > 0 && (
              <div className="flex items-center gap-3">
                {socials.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noreferrer"
                    className="grid h-9 w-9 place-items-center rounded-full border hairline text-cocoa-500 hover:text-cocoa-700"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className={heading}>Shop</p>
            <ul className={"mt-4 " + col}>
              <li><Link className="hover:text-cocoa-700" href="/shop">All candles</Link></li>
              <li><Link className="hover:text-cocoa-700" href="/collections/best-sellers">Best Sellers</Link></li>
              <li><Link className="hover:text-cocoa-700" href="/collections/new-arrivals">New Arrivals</Link></li>
              <li><Link className="hover:text-cocoa-700" href="/collections/floral">Floral</Link></li>
              <li><Link className="hover:text-cocoa-700" href="/collections/luxury">Luxury</Link></li>
              <li><Link className="hover:text-cocoa-700" href="/collections/gift-sets">Gift Sets</Link></li>
            </ul>
          </div>

          <div>
            <p className={heading}>Company</p>
            <ul className={"mt-4 " + col}>
              <li><Link className="hover:text-cocoa-700" href="/about">About</Link></li>
              <li><Link className="hover:text-cocoa-700" href="/gifting">Gifting</Link></li>
              <li><Link className="hover:text-cocoa-700" href="/contact">Contact</Link></li>
              <li><Link className="hover:text-cocoa-700" href="/faqs">FAQs</Link></li>
            </ul>
          </div>

          <div>
            <p className={heading}>Help</p>
            <ul className={"mt-4 " + col}>
              <li><Link className="hover:text-cocoa-700" href="/shipping">Shipping</Link></li>
              <li><Link className="hover:text-cocoa-700" href="/returns">Returns</Link></li>
              <li><Link className="hover:text-cocoa-700" href="/privacy">Privacy Policy</Link></li>
              <li><Link className="hover:text-cocoa-700" href="/terms">Terms</Link></li>
              <li><Link className="hover:text-cocoa-700" href="/account">My account</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-3 border-t hairline pt-6 sm:flex-row text-xs text-cocoa-400">
          <p>© {new Date().getFullYear()} White & Wick. Hand-poured with love in India.</p>
          <p>Made with soy wax, cotton wicks, and care.</p>
        </div>
      </div>
    </footer>
  );
}
