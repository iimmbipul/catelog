import Image from "next/image";
import { PageHeader, Card } from "@/components/admin/ui";
import { getBanners } from "@/lib/db";
import { BannerActions } from "./BannerActions";

export const metadata = { title: "Admin — Banners" };

export default async function BannersPage() {
  const banners = await getBanners();
  return (
    <>
      <PageHeader
        title="Banners"
        subtitle="Promotional banners shown across the storefront."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Banners" }]}
      />
      <BannerActions />
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {banners.map((b) => (
          <Card key={b.id} className="!p-0 overflow-hidden">
            <div className="relative aspect-[16/8]">
              <Image src={b.image} alt={b.title} fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="eyebrow">{b.active ? "Active" : "Inactive"}</p>
                  <p className="mt-2 font-serif text-xl text-cocoa-700">{b.title}</p>
                </div>
                <span className="text-xs text-cocoa-400">#{b.order}</span>
              </div>
              {b.subtitle && <p className="mt-2 text-sm text-cocoa-500">{b.subtitle}</p>}
              <p className="mt-3 text-xs text-cocoa-400">→ {b.link} · CTA: {b.cta}</p>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
