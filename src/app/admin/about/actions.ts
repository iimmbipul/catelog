"use server";
import { revalidatePath } from "next/cache";
import { getSettings, saveSettings } from "@/lib/db";

export async function saveAboutAction(fd: FormData) {
  const s = await getSettings();
  const next = {
    ...s,
    about: {
      eyebrow: String(fd.get("eyebrow") ?? ""),
      heading: String(fd.get("heading") ?? ""),
      intro: String(fd.get("intro") ?? ""),
      image: String(fd.get("image") ?? ""),
      craftEyebrow: String(fd.get("craftEyebrow") ?? ""),
      craftBody: String(fd.get("craftBody") ?? ""),
      quoteEyebrow: String(fd.get("quoteEyebrow") ?? ""),
      quote: String(fd.get("quote") ?? ""),
    },
  };
  await saveSettings(next);
  revalidatePath("/about");
  revalidatePath("/admin/about");
  return { ok: true };
}
