"use server";
import { getGiftEnquiries, saveGiftEnquiries } from "@/lib/db";
import type { GiftEnquiry } from "@/lib/types";

export async function submitGiftEnquiry(input: Omit<GiftEnquiry, "id" | "createdAt" | "status">) {
  const list = await getGiftEnquiries();
  const enquiry: GiftEnquiry = {
    ...input,
    id: `g_${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "new",
  };
  await saveGiftEnquiries([enquiry, ...list]);
  return { id: enquiry.id };
}
