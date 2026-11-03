/* Shown the moment an admin link is clicked, while the page reads Firestore. */
export default function AdminLoading() {
  return (
    <div role="status" aria-label="Loading">
      <div className="h-3 w-32 animate-pulse rounded-full bg-ivory-100" />
      <div className="mt-4 h-9 w-64 max-w-full animate-pulse rounded-xl bg-ivory-100" />
      <div className="mt-8 h-96 animate-pulse rounded-2xl bg-ivory-100" />
    </div>
  );
}
