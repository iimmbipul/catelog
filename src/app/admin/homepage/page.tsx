import { PageHeader, Card } from "@/components/admin/ui";
import { getSettings } from "@/lib/db";
import { HomepageForm } from "./HomepageForm";

export const metadata = { title: "Admin — Homepage" };

export default async function HomepageAdminPage() {
  const settings = await getSettings();
  return (
    <>
      <PageHeader
        title="Homepage"
        subtitle="Edit the hero, announcement bar, and calls-to-action."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Homepage" }]}
      />
      <Card>
        <HomepageForm settings={settings} />
      </Card>
    </>
  );
}
