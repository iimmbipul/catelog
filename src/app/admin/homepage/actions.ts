"use server";
import { revalidatePath } from "next/cache";
import { getSettings, saveSettings } from "@/lib/db";

export async function saveHomepageAction(fd: FormData) {
  const s = await getSettings();
  const str = (name: string, fallback = "") => String(fd.get(name) ?? fallback);
  const next = {
    ...s,
    announcementBar: str("announcementBar", s.announcementBar),
    homepage: {
      ...s.homepage,
      heroHeading: str("heroHeading", s.homepage.heroHeading),
      heroSubheading: str("heroSubheading", s.homepage.heroSubheading),
      heroImage: str("heroImage", s.homepage.heroImage),
      heroCtaLabel: str("heroCtaLabel", s.homepage.heroCtaLabel),
      heroCtaHref: str("heroCtaHref", s.homepage.heroCtaHref),
      secondaryCtaLabel: str("secondaryCtaLabel", s.homepage.secondaryCtaLabel),
      secondaryCtaHref: str("secondaryCtaHref", s.homepage.secondaryCtaHref),
      story: {
        eyebrow: str("storyEyebrow"),
        heading: str("storyHeading"),
        body1: str("storyBody1"),
        body2: str("storyBody2"),
        image: str("storyImage"),
        ctaLabel: str("storyCtaLabel"),
        ctaHref: str("storyCtaHref"),
      },
      giftingBanner: {
        eyebrow: str("giftEyebrow"),
        heading: str("giftHeading"),
        body: str("giftBody"),
        image: str("giftImage"),
        ctaLabel: str("giftCtaLabel"),
        ctaHref: str("giftCtaHref"),
      },
    },
  };
  await saveSettings(next);
  revalidatePath("/");
  revalidatePath("/admin/homepage");
  return { ok: true };
}
