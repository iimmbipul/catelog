"use server";
import { revalidatePath } from "next/cache";
import { getGiftEnquiries, saveGiftEnquiries } from "@/lib/db";
import type { GiftEnquiry } from "@/lib/types";

export async function setEnquiryStatusAction(id: string, status: GiftEnquiry["status"]) {
  const list = await getGiftEnquiries();
  const idx = list.findIndex((g) => g.id === id);
  if (idx < 0) return { ok: false };
  list[idx].status = status;
  await saveGiftEnquiries(list);
  revalidatePath("/admin/enquiries");
  return { ok: true };
}
