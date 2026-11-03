/* JSON-LD structured data. Every value must match what the page shows.
 *
 * Ratings come only from approved reviews. Never use Product.rating or
 * Product.reviewCount: they aren't based on real reviews (the admin form
 * defaults new products to 4.7), and marking them up would be fake ratings. */

import { averageRating, cleanWax } from "./format";
import { DEFAULT_IMAGE, SITE_NAME, SITE_URL, absoluteUrl } from "./seo";
import type { Product, Review, Settings } from "./types";

const CONTEXT = "https://schema.org";
const ORGANIZATION_ID = absoluteUrl("/#organization");

/* From the shipping page, and the same rule placeOrder charges. */
const FREE_SHIPPING_ABOVE = 999;
const FLAT_SHIPPING = 60;

export function organizationSchema(settings: Settings) {
  const { instagram, facebook, youtube } = settings.socials;
  return {
    "@context": CONTEXT,
    "@type": "OnlineStore",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl(DEFAULT_IMAGE),
    description: "Hand-poured scented candles and candle gifts, made in Bengaluru and shipped across India.",
    email: settings.contact.email?.trim() || undefined,
    sameAs: [instagram, facebook, youtube].filter((url) => url?.trim()),
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: "IN",
      returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: 7,
      merchantReturnLink: absoluteUrl("/returns"),
    },
  };
}

export function websiteSchema() {
  return {
    "@context": CONTEXT,
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "en-IN",
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export function breadcrumbSchema(items: { label: string; href?: string }[]) {
  return {
    "@context": CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.label,
      item: it.href ? absoluteUrl(it.href) : undefined,
    })),
  };
}

/* `reviews` must be the approved reviews shown on the product page. */
export function productSchema(p: Product, reviews: Review[]) {
  const url = absoluteUrl(`/product/${p.slug}`);
  const outOfStock = p.stock <= 0 || p.status === "out_of_stock";
  return {
    "@context": CONTEXT,
    "@type": "Product",
    name: p.name,
    description: p.description,
    image: p.images.map((img) => img.url),
    sku: p.sku,
    url,
    brand: { "@type": "Brand", name: SITE_NAME },
    material: cleanWax(p.waxType),
    weight: { "@type": "QuantitativeValue", value: p.weightGrams, unitCode: "GRM" },
    additionalProperty: [{ "@type": "PropertyValue", name: "Burn time", value: `${p.burnTimeHours} hours` }],
    offers: {
      "@type": "Offer",
      url,
      price: p.price,
      priceCurrency: "INR",
      availability: outOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": ORGANIZATION_ID },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: p.price >= FREE_SHIPPING_ABOVE ? 0 : FLAT_SHIPPING,
          currency: "INR",
        },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 3, maxValue: 6, unitCode: "DAY" },
        },
      },
    },
    ...(reviews.length > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: averageRating(reviews),
        reviewCount: reviews.length,
      },
      review: reviews.slice(0, 3).map((r) => ({
        "@type": "Review",
        name: r.title,
        reviewBody: r.body,
        datePublished: r.createdAt,
        author: { "@type": "Person", name: r.customerName },
        reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
      })),
    }),
  };
}
