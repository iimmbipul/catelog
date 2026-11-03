"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { getReviews, saveReviews } from "@/lib/db";

export async function toggleReviewApprovalAction(id: string) {
  await requireAdmin();
  const list = await getReviews();
  const idx = list.findIndex((r) => r.id === id);
  if (idx < 0) return { ok: false };
  list[idx].approved = !list[idx].approved;
  await saveReviews(list);
  revalidatePath("/admin/reviews");
  return { ok: true };
}

export async function deleteReviewAction(id: string) {
  await requireAdmin();
  const list = await getReviews();
  await saveReviews(list.filter((r) => r.id !== id));
  revalidatePath("/admin/reviews");
  return { ok: true };
}
