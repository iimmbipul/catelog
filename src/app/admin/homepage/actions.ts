"use server";
import { revalidatePath } from "next/cache";
import { getSettings, saveSettings } from "@/lib/db";

export async function saveHomepageAction(fd: FormData) {
  const s = await getSettings();
  const next = {
    ...s,
    announcementBar: String(fd.get("announcementBar") ?? s.announcementBar),
    homepage: {
      ...s.homepage,
      heroHeading: String(fd.get("heroHeading") ?? s.homepage.heroHeading),
      heroSubheading: String(fd.get("heroSubheading") ?? s.homepage.heroSubheading),
      heroImage: String(fd.get("heroImage") ?? s.homepage.heroImage),
      heroCtaLabel: String(fd.get("heroCtaLabel") ?? s.homepage.heroCtaLabel),
      heroCtaHref: String(fd.get("heroCtaHref") ?? s.homepage.heroCtaHref),
      secondaryCtaLabel: String(fd.get("secondaryCtaLabel") ?? s.homepage.secondaryCtaLabel),
      secondaryCtaHref: String(fd.get("secondaryCtaHref") ?? s.homepage.secondaryCtaHref),
    },
  };
  await saveSettings(next);
  revalidatePath("/");
  revalidatePath("/admin/homepage");
  return { ok: true };
}
