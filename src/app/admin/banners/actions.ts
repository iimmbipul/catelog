"use server";
import { revalidatePath } from "next/cache";
import { getBanners, saveBanners } from "@/lib/db";
import type { Banner } from "@/lib/types";

export async function saveBannerAction(fd: FormData) {
  const id = String(fd.get("id") ?? "") || `b_${Date.now()}`;
  const banners = await getBanners();
  const existing = banners.find((b) => b.id === id);
  const next: Banner = {
    id,
    title: String(fd.get("title") ?? ""),
    subtitle: String(fd.get("subtitle") ?? "") || undefined,
    image: String(fd.get("image") ?? ""),
    link: String(fd.get("link") ?? "/"),
    cta: String(fd.get("cta") ?? "Explore"),
    active: fd.get("active") === "on",
    order: Number(fd.get("order") ?? existing?.order ?? banners.length + 1),
  };
  const idx = banners.findIndex((b) => b.id === id);
  if (idx >= 0) banners[idx] = next;
  else banners.push(next);
  await saveBanners(banners);
  revalidatePath("/admin/banners");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteBannerAction(id: string) {
  const banners = await getBanners();
  await saveBanners(banners.filter((b) => b.id !== id));
  revalidatePath("/admin/banners");
  return { ok: true };
}
