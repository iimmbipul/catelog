"use server";
import { revalidatePath } from "next/cache";
import { getFaqs, saveFaqs } from "@/lib/db";
import type { FAQ } from "@/lib/types";

export async function saveFaqAction(fd: FormData) {
  const id = String(fd.get("id") ?? "") || `f_${Date.now()}`;
  const list = await getFaqs();
  const existing = list.find((f) => f.id === id);
  const next: FAQ = {
    id,
    question: String(fd.get("question") ?? ""),
    answer: String(fd.get("answer") ?? ""),
    category: String(fd.get("category") ?? "") || undefined,
    order: Number(fd.get("order") ?? existing?.order ?? list.length + 1),
  };
  const idx = list.findIndex((f) => f.id === id);
  if (idx >= 0) list[idx] = next;
  else list.push(next);
  await saveFaqs(list);
  revalidatePath("/admin/faqs");
  revalidatePath("/faqs");
  return { ok: true };
}

export async function deleteFaqAction(id: string) {
  const list = await getFaqs();
  await saveFaqs(list.filter((f) => f.id !== id));
  revalidatePath("/admin/faqs");
  return { ok: true };
}
