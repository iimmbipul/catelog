export async function fetchCatalog() {
  const res = await fetch('/catalog.json');
  if (!res.ok) throw new Error('Failed to fetch catalog');
  return res.json();
}
