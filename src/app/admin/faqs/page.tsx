import { PageHeader, Card } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { getFaqs } from "@/lib/db";
import { FaqsClient } from "./FaqsClient";

export const metadata = { title: "Admin — FAQs" };

export default async function FaqsAdminPage() {
  await requireAdmin();
  const faqs = await getFaqs();
  return (
    <>
      <PageHeader
        title="FAQs"
        subtitle="Answers shown on the /faqs page and on product details."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "FAQs" }]}
      />
      <Card>
        <FaqsClient faqs={faqs} />
      </Card>
    </>
  );
}
