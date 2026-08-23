import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Facebook, Instagram, Youtube } from "@/components/ui/Icons";
import { getSettings } from "@/lib/db";

export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const settings = await getSettings();
  const s = settings.socials;
  const socials: { href: string; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [];
  if (s.instagram?.trim()) socials.push({ href: s.instagram, label: "Instagram", Icon: Instagram });
  if (s.youtube?.trim()) socials.push({ href: s.youtube, label: "YouTube", Icon: Youtube });
  if (s.facebook?.trim()) socials.push({ href: s.facebook, label: "Facebook", Icon: Facebook });
  // WhatsApp intentionally excluded from Contact page — still shown in the Footer.

  return (
    <div className="container-page pt-8 lg:pt-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="eyebrow">Say hello</p>
          <h1 className="mt-4 heading-serif text-hero">We&apos;d love to hear from you.</h1>
          <p className="mt-4 text-sm text-cocoa-500 max-w-md">
            For orders, gifting or a plain hello — write to us or say hi over Instagram.
            We reply within a working day.
          </p>

          <div className="mt-10 space-y-4">
            {settings.contact.email?.trim() && <Row label="Email" value={settings.contact.email} />}
            {settings.contact.phone?.trim() && <Row label="Phone" value={settings.contact.phone} />}
            {settings.contact.address?.trim() && <Row label="Studio" value={settings.contact.address} />}
          </div>

          {socials.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center gap-3">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border hairline px-5 py-3 text-xs uppercase tracking-widish text-cocoa-700"
                >
                  <Icon /> {label}
                </a>
              ))}
            </div>
          )}
        </div>

        <form className="rounded-3xl border hairline bg-ivory-50 p-8">
          <h2 className="font-serif text-2xl text-cocoa-700">Send us a note</h2>
          <div className="mt-6 grid gap-4">
            <input placeholder="Your name" className="rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500" />
            <input placeholder="Email" type="email" className="rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500" />
            <input placeholder="Subject" className="rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500" />
            <textarea rows={5} placeholder="Message" className="rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500" />
            <button className="rounded-full bg-cocoa-700 py-3.5 text-sm uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500">
              Send message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border hairline bg-ivory-50 p-5">
      <p className="eyebrow">{label}</p>
      <p className="mt-2 font-serif text-lg text-cocoa-700">{value}</p>
    </div>
  );
}
