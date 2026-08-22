"use server";
import { revalidatePath } from "next/cache";
import { getSettings, saveSettings } from "@/lib/db";

export async function saveSettingsAction(fd: FormData) {
  const s = await getSettings();
  const next = {
    ...s,
    freeShippingAbove: Number(fd.get("freeShippingAbove") ?? s.freeShippingAbove) || s.freeShippingAbove,
    announcementBar: String(fd.get("announcementBar") ?? s.announcementBar),
    socials: {
      instagram: String(fd.get("instagram") ?? s.socials.instagram),
      whatsapp: String(fd.get("whatsapp") ?? s.socials.whatsapp),
      pinterest: String(fd.get("pinterest") ?? "") || undefined,
      facebook: String(fd.get("facebook") ?? "") || undefined,
    },
    contact: {
      email: String(fd.get("email") ?? s.contact.email),
      phone: String(fd.get("phone") ?? s.contact.phone),
      address: String(fd.get("address") ?? s.contact.address),
    },
  };
  await saveSettings(next);
  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { ok: true };
}
