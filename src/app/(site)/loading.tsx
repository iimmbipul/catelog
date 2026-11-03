/* Shown the moment a link is clicked, for pages that can't be served from a
 * prefetch (search, account, order status). */
export default function Loading() {
  return (
    <div className="container-page pt-8 lg:pt-14" role="status" aria-label="Loading">
      <div className="h-3 w-32 animate-pulse rounded-full bg-ivory-100" />
      <div className="mt-6 h-10 w-2/3 max-w-md animate-pulse rounded-xl bg-ivory-100" />
      <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-ivory-100" />
        ))}
      </div>
    </div>
  );
}
