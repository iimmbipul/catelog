import { PageHeader, Card } from "@/components/admin/ui";
import { getSettings } from "@/lib/db";
import { AboutForm } from "./AboutForm";

export const metadata = { title: "Admin — About page" };

export default async function AboutAdminPage() {
  const settings = await getSettings();
  return (
    <>
      <PageHeader
        title="About page"
        subtitle="Edit the copy and studio image shown at /about."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "About page" }]}
      />
      <Card>
        <AboutForm settings={settings} />
      </Card>
    </>
  );
}
