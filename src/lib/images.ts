/* Decorative image URLs used by hardcoded UI sections
 * (home hero background, gallery grid, about-page studio shot, gifting banner).
 * Product / collection images live in Firestore; this file only holds
 * placeholders for the site's editorial framing. */

const pic = (seed: string, w = 1200, h = 1500) =>
  `https://picsum.photos/seed/ww-${seed}/${w}/${h}`;

export const IMG = {
  hero: pic("hero-candle", 1600, 1900),
  gifting: "https://res.cloudinary.com/yeioefmb/image/upload/v1787486106/Gift_banner.png",
  studio: pic("studio", 1600, 2000),
  handpour: pic("handpour", 1600, 1200),
  florals: pic("florals", 1600, 1200),
  social1: pic("social-1", 800, 800),
  social2: pic("social-2", 800, 800),
  social3: pic("social-3", 800, 800),
  social4: pic("social-4", 800, 800),
  social5: pic("social-5", 800, 800),
  social6: pic("social-6", 800, 800),
};
