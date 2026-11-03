import type { MetadataRoute } from "next";
import { getCollections, getProducts } from "@/lib/catalog";
import { absoluteUrl, isPublicProduct } from "@/lib/seo";

const PAGES = ["/", "/shop", "/collections", "/gifting", "/about", "/contact", "/faqs", "/shipping", "/returns", "/privacy", "/terms"];

/* No lastModified: products don't record when they last changed, and a made-up
 * date is worse than none. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections] = await Promise.all([getProducts(), getCollections()]);

  // Two products can share a slug by mistake, but a URL may only be listed once.
  const seen = new Set<string>();
  const productEntries = products
    .filter((p) => isPublicProduct(p) && !seen.has(p.slug) && seen.add(p.slug))
    .map((p) => ({
      url: absoluteUrl(`/product/${p.slug}`),
      images: p.images.map((img) => img.url),
    }));

  return [
    ...PAGES.map((path) => ({ url: absoluteUrl(path) })),
    ...collections.map((c) => ({ url: absoluteUrl(`/collections/${c.slug}`) })),
    ...productEntries,
  ];
}
