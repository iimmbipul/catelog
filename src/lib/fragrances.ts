/* Canonical list of fragrances offered by White & Wick.
 * Used by the admin product form dropdown and the storefront filters. */
export const FRAGRANCES = [
  "Lavender",
  "Rose",
  "Sandalwood",
  "Jasmine",
  "Orange",
  "Rosemary",
  "Lemongrass",
  "Ylang Ylang",
  "Tea Tree",
  "Peppermint",
  "Eucalyptus",
  "Lemon",
  "Frankincense",
  "Vanilla",
  "Citronella",
  "Coffee",
] as const;

export type Fragrance = (typeof FRAGRANCES)[number];
