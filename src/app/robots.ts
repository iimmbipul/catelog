import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/* Cart, checkout, account, order and search pages aren't blocked here: they
 * carry a noindex tag, which Google can only see if it may crawl them. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
