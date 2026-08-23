"use server";
import { revalidatePath } from "next/cache";
import { getInstagramPosts, saveInstagramPosts } from "@/lib/db";
import type { InstagramPost } from "@/lib/types";

export async function saveInstagramPostAction(fd: FormData) {
  const id = String(fd.get("id") ?? "") || `ig_${Date.now()}`;
  const list = await getInstagramPosts();
  const existing = list.find((p) => p.id === id);
  const next: InstagramPost = {
    id,
    image: String(fd.get("image") ?? "").trim(),
    link: String(fd.get("link") ?? "").trim(),
    caption: String(fd.get("caption") ?? "").trim() || undefined,
    order: Number(fd.get("order") ?? existing?.order ?? list.length + 1),
  };
  const idx = list.findIndex((p) => p.id === id);
  if (idx >= 0) list[idx] = next;
  else list.push(next);
  await saveInstagramPosts(list);
  revalidatePath("/");
  revalidatePath("/admin/instagram");
  return { ok: true };
}

export async function deleteInstagramPostAction(id: string) {
  const list = await getInstagramPosts();
  await saveInstagramPosts(list.filter((p) => p.id !== id));
  revalidatePath("/");
  revalidatePath("/admin/instagram");
  return { ok: true };
}
