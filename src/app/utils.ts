export async function fetchCatalog() {
  const res = await fetch('/newData.json');
  if (!res.ok) throw new Error('Failed to fetch catalog');
  return res.json();
}
