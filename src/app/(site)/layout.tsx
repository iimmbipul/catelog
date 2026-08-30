import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { LeafBranch } from "@/components/site/Illustrations";
import { Toaster } from "@/components/site/Toaster";
import { getSettings } from "@/lib/db";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <>
      <AnnouncementBar text={settings.announcementBar} />
      <Header />
      <main className="home-canvas relative min-h-[60vh] overflow-hidden">
        {/* Ambient leaf flourishes on the edges. Mobile shows a couple of
         * small hints; desktop gets the full alternating chain top-to-bottom. */}
        <LeafBranch className="pointer-events-none absolute -left-16 top-[42vh] h-16 w-40 opacity-25 sm:h-20 sm:w-56 sm:opacity-30 lg:h-24 lg:w-72 lg:opacity-40" />
        <LeafBranch
          className="pointer-events-none absolute -right-16 top-[80vh] h-16 w-40 opacity-25 sm:h-20 sm:w-56 sm:opacity-30 lg:h-24 lg:w-72 lg:opacity-40"
          style={{ transform: "scaleX(-1)" }}
        />
        <LeafBranch className="pointer-events-none absolute -left-20 top-[140vh] hidden h-20 w-56 opacity-30 sm:block lg:h-24 lg:w-80 lg:opacity-35" />
        <LeafBranch
          className="pointer-events-none absolute -right-20 top-[200vh] hidden h-20 w-56 opacity-30 sm:block lg:h-24 lg:w-72 lg:opacity-40"
          style={{ transform: "scaleX(-1)" }}
        />
        <LeafBranch className="pointer-events-none absolute -left-24 top-[260vh] hidden h-24 w-72 opacity-35 lg:block" />
        <LeafBranch
          className="pointer-events-none absolute -right-20 top-[320vh] hidden h-24 w-72 opacity-40 lg:block"
          style={{ transform: "scaleX(-1)" }}
        />
        <LeafBranch className="pointer-events-none absolute -left-24 top-[380vh] hidden h-24 w-80 opacity-35 lg:block" />
        <LeafBranch
          className="pointer-events-none absolute -right-24 top-[440vh] hidden h-24 w-72 opacity-40 lg:block"
          style={{ transform: "scaleX(-1)" }}
        />

        {children}
      </main>
      <Footer />
      <Toaster />
    </>
  );
}
