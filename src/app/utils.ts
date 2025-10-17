export async function fetchCatalog() {
  const res = await fetch('/api/catalog');
  if (!res.ok) throw new Error('Failed to fetch catalog');
  return res.json();
}
