/* Loading state for routes that render on request. Keep it off prerendered
 * pages: a loading.tsx wraps a page in Suspense, so its real content ships in a
 * hidden div and this skeleton takes its place in the page's main content,
 * which is what crawlers that don't run JavaScript read. */
export function PageSkeleton() {
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
