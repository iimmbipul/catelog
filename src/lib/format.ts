/* Average of the given reviews, to one decimal place. */
export function averageRating(reviews: { rating: number }[]) {
  return Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10;
}

/* Catalog wax values vary ("Soy wax ", "Soy Wax", "Soy wax , Gel wax"). */
export function cleanWax(wax: string) {
  const s = wax.trim().replace(/\s*,\s*/g, ", ").toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function money(n: number) {
  return INR.format(n);
}

export function pct(n: number) {
  return `${Math.round(n)}%`;
}

export function computeDiscount(mrp: number, price: number) {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

export function shortDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function relative(iso: string) {
  const d = new Date(iso).getTime();
  const diff = Date.now() - d;
  const day = 86400000;
  if (diff < day) return "today";
  if (diff < 2 * day) return "yesterday";
  const days = Math.floor(diff / day);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}
