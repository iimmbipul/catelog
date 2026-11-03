/* Search and social metadata for storefront pages. */

import type { Metadata } from "next";
import { cleanWax } from "./format";
import type { Collection, Product } from "./types";

export const SITE_URL = "https://whiteandwick.com";
export const SITE_NAME = "White & Wick";
export const DEFAULT_IMAGE = "/logo.jpeg";

const BRAND_SUFFIX = ` • ${SITE_NAME}`;
const TITLE_LIMIT = 60;
const DESCRIPTION_LIMIT = 160;

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

/* Next replaces a parent's openGraph and twitter objects rather than merging
 * them, so each public page sets the full set. Titles too long to carry the
 * brand suffix go without it, so search results don't cut them off. */
export function pageMetadata({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  return {
    title: title.length + BRAND_SUFFIX.length <= TITLE_LIMIT ? title : { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_IN",
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

/* For pages that are useless in search results, such as cart and account.
 * Links are still followed, and robots.ts must not block these pages or Google
 * would never see this tag. */
export function privateMetadata(title: string): Metadata {
  return { title, robots: { index: false, follow: true } };
}

export function isPublicProduct(p: Product) {
  return p.status !== "draft" && p.status !== "archived";
}

/* Only 8 of 41 product names say what the product is ("Daisy Floaters"), so
 * titles add the words people search for. Fragrance stays out of the title
 * because buyers choose their own on the product page. */
function productSearchName(name: string) {
  if (/\bcandle\b/i.test(name)) return name.replace(/\bcandle\b/i, "Scented Candle");
  if (/wax sachet/i.test(name)) return name.replace(/wax sachet/i, "Scented Wax Sachet");
  if (/hamper/i.test(name)) return name.replace(/hamper/i, "Candle Hamper");
  if (/favour/i.test(name)) return name.replace(/favour/i, "Candle Favour");
  if (/floaters/i.test(name)) return name.replace(/floaters/i, "Floating Candles");
  const pack = name.match(/^(.*?)(\s[-–]\s(?:set|pack) of \d+)$/i);
  if (pack) return `${pack[1]} Scented Candle${pack[2]}`;
  return `${name} Scented Candle`;
}

/* Adds whole sentences until the next one would be cut off in search results. */
function fitDescription(sentences: string[]) {
  const first = sentences[0].trim();
  let out =
    first.length <= DESCRIPTION_LIMIT
      ? first
      : `${first.slice(0, DESCRIPTION_LIMIT - 1).replace(/\s+\S*$/, "")}…`;
  for (const s of sentences.slice(1)) {
    if (out.length + s.length + 1 > DESCRIPTION_LIMIT) break;
    out += ` ${s}`;
  }
  return out;
}

function productDescription(p: Product) {
  const hours = p.burnTimeHours === 1 ? "1 hour" : `${p.burnTimeHours} hours`;
  const wax = cleanWax(p.waxType).toLowerCase();
  const makeup = /sachet/i.test(p.name)
    ? `Made with ${wax}.`
    : `Made with ${wax}, with about ${hours} of burn time.`;
  return fitDescription([p.shortDescription, makeup, "Free shipping over ₹999."]);
}

/* Admin's SEO fields win when they're filled in. */
export function productMetadata(p: Product): Metadata {
  const metadata = pageMetadata({
    title: p.seoTitle?.trim() || productSearchName(p.name),
    description: p.seoDescription?.trim() || productDescription(p),
    path: `/product/${p.slug}`,
    image: p.images[0]?.url,
  });
  return isPublicProduct(p) ? metadata : { ...metadata, robots: { index: false, follow: true } };
}

/* Search copy per collection. `intro` and `related` also appear on the page, as
 * a short section below the products. */
export const COLLECTION_SEO: Record<
  string,
  { title: string; description: string; intro?: string; related?: string[] }
> = {
  "best-sellers": {
    title: "Best-Selling Scented Candles",
    description:
      "Our most-loved candles, from floating daisies to bouquet and crystal gel candles. Hand-poured in small batches, with free shipping above ₹999.",
  },
  "new-arrivals": {
    title: "New Scented Candles",
    description:
      "The latest candles from White & Wick, hand-poured in small batches in Bengaluru. See what's new and choose from 16 fragrances.",
  },
  floral: {
    title: "Floral Candles & Candle Bouquets",
    description:
      "Tulip bouquets, daisy candles, peonies and lotus blooms made in wax. Hand-poured floral candles in 16 fragrances, for your home or as a gift.",
    intro:
      "Our floral candles are wax flowers first and candles second: tulip bouquets, daisy arrangements, peonies and lotus blooms that look lovely on a shelf before you ever light them. You can choose any of our 16 fragrances on each product page, so the look and the scent are both yours to pick.",
    related: ["gift-sets", "minimal"],
  },
  "gift-sets": {
    title: "Candle Gift Sets & Bouquet Gifts",
    description:
      "Candle gifts for birthdays, anniversaries, friends and festivals, from wax bouquets to hampers. Hand-poured by White & Wick, shipped across India.",
    intro:
      "Looking for a candle gift that feels considered? This edit brings together wax bouquets, diyas and small sets for birthdays, anniversaries, friends and festivals. For something bigger, we also make custom hampers for weddings and corporate gifting, with complimentary gift-wrap.",
    related: ["birthday-gifts", "anniversary-gifts", "wedding-gifts"],
  },
  luxury: {
    title: "Luxury Scented Candles",
    description:
      "Our statement candles: crystal-detailed gel candles and sculpted floral soy candles with longer burn times. Made to gift or to keep.",
    intro:
      "These are the candles we reach for when the occasion deserves more: crystal-detailed gel candles with around 35 hours of burn time, alongside sculpted floral soy candles. Each one is made to be displayed as much as lit.",
    related: ["floral", "gift-sets"],
  },
  minimal: {
    title: "Minimal & Aesthetic Candles",
    description:
      "Bubble candles, latte candles and simple sculptural shapes for shelves and bedside tables. Hand-poured candles with a clean, modern look.",
    intro:
      "Not every candle needs to be the centre of attention. These are simple shapes, from bubble candles to latte-inspired jars and dipped tulips, made for coffee tables, shelves and bedside tables.",
    related: ["floral", "luxury"],
  },
  "the-occasion-edit": {
    title: "Candles for Festivals & Occasions",
    description:
      "Candles picked for Diwali, Rakhi, Christmas, Friendship Day and other moments worth marking. Hand-poured, easy to gift and shipped across India.",
  },
  diwali: {
    title: "Diwali Candles, Diyas & Floating Candles",
    description:
      "Wax diyas, lotus candles, rangoli candles and floating daisies for Diwali decor and gifting. Hand-poured by White & Wick and shipped across India.",
    intro:
      "Light up your Diwali with wax diyas, lotus candles, rangoli candles and laddoo-shaped candles. Floating designs work beautifully in an urli, and small sets make easy gifts for family and friends. During the festive season, please allow 1 to 2 extra days for delivery.",
    related: ["festive-gifts", "gift-sets"],
  },
  rakhi: {
    title: "Rakhi Candle Gift Hampers",
    description:
      "A candle hamper to send with your rakhi. Hand-poured by White & Wick, with free shipping across India on orders above ₹999.",
  },
  christmas: {
    title: "Christmas Candles",
    description:
      "Tree-shaped Christmas candles for your table or as a small gift. Hand-poured by White & Wick and shipped across India.",
  },
  "festive-gifts": {
    title: "Festive Candle Gifts",
    description:
      "Festive candle gifts for Diwali, Rakhi and Christmas, from lotus diyas to dessert-shaped candles. Hand-poured, ready to gift and shipped across India.",
  },
  "friendship-day": {
    title: "Friendship Day Candles",
    description:
      "Playful character candles for Friendship Day, made for your favourite people. Hand-poured, ready to gift and shipped across India.",
  },
  "friendship-gifts": {
    title: "Candle Gifts for Friends",
    description:
      "Candle gifts for your favourite people, from playful friendship candles to wax bouquets. Hand-poured by White & Wick and shipped across India.",
  },
  "birthday-gifts": {
    title: "Birthday Candle Gifts",
    description:
      "Birthday gifts that look as good as they smell: wax bouquets and floral candles, hand-poured by White & Wick. Choose from 16 fragrances.",
  },
  "anniversary-gifts": {
    title: "Anniversary Candle Gifts",
    description:
      "Wax bouquets and heart candles for anniversaries, hand-poured by White & Wick. Choose from 16 fragrances, with delivery across India.",
  },
  "wedding-gifts": {
    title: "Wedding Favour Candles & Return Gifts",
    description:
      "Small candles for wedding favours and return gifts, plus heart candles for the couple. Hand-poured; ask us about custom hampers for larger orders.",
    intro:
      "Small, ready-to-give candles for wedding favours and return gifts, plus heart candles for the couple themselves. For larger orders or custom hampers, send us an enquiry and we'll help you plan.",
    related: ["gift-sets", "anniversary-gifts"],
  },
};

export function collectionMetadata(c: Collection): Metadata {
  const seo = COLLECTION_SEO[c.slug];
  return pageMetadata({
    title: seo?.title ?? c.title,
    description: seo?.description ?? c.description,
    path: `/collections/${c.slug}`,
    image: c.image,
  });
}
