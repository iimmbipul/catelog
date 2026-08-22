import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { getFaqs } from "@/lib/db";
import { FaqAccordion } from "@/components/site/FaqAccordion";

export const metadata = { title: "FAQs" };

export default async function FaqsPage() {
  const faqs = await getFaqs();
  return (
    <div className="container-page pt-8 lg:pt-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "FAQs" }]} />
      <div className="mt-6 max-w-2xl">
        <p className="eyebrow">Answers</p>
        <h1 className="mt-3 heading-serif text-hero">Everything you might want to know.</h1>
      </div>
      <div className="mt-10 max-w-3xl">
        <FaqAccordion faqs={faqs} />
      </div>
    </div>
  );
}
