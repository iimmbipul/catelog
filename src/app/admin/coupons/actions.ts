"use server";
import { revalidatePath } from "next/cache";
import { getCoupons, saveCoupons } from "@/lib/db";
import type { Coupon } from "@/lib/types";

export async function saveCouponAction(fd: FormData) {
  const id = String(fd.get("id") ?? "") || `cp_${Date.now()}`;
  const coupons = await getCoupons();
  const existing = coupons.find((c) => c.id === id);
  const parsedValue = Number(fd.get("value") ?? 0);
  const next: Coupon = {
    id,
    code: String(fd.get("code") ?? "").toUpperCase().trim(),
    type: (String(fd.get("type") ?? "percent") as Coupon["type"]),
    value: Number.isFinite(parsedValue) ? parsedValue : 0,
    minOrder: Number(fd.get("minOrder") ?? 0) || undefined,
    maxDiscount: Number(fd.get("maxDiscount") ?? 0) || undefined,
    usageLimit: Number(fd.get("usageLimit") ?? 0) || undefined,
    perCustomerLimit: Number(fd.get("perCustomerLimit") ?? 0) || undefined,
    usedCount: existing?.usedCount ?? 0,
    active: fd.get("active") === "on",
  };
  const idx = coupons.findIndex((c) => c.id === id);
  if (idx >= 0) coupons[idx] = next;
  else coupons.unshift(next);
  await saveCoupons(coupons);
  revalidatePath("/admin/coupons");
  return { ok: true };
}

export async function deleteCouponAction(id: string) {
  const coupons = await getCoupons();
  await saveCoupons(coupons.filter((c) => c.id !== id));
  revalidatePath("/admin/coupons");
  return { ok: true };
}

export async function toggleCouponAction(id: string) {
  const coupons = await getCoupons();
  const idx = coupons.findIndex((c) => c.id === id);
  if (idx < 0) return { ok: false };
  coupons[idx].active = !coupons[idx].active;
  await saveCoupons(coupons);
  revalidatePath("/admin/coupons");
  return { ok: true };
}
