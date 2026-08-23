import { PageHeader } from "@/components/admin/ui";
import { getInstagramPosts } from "@/lib/db";
import { InstagramClient } from "./InstagramClient";

export const metadata = { title: "Admin — Instagram gallery" };

export default async function InstagramAdminPage() {
  const posts = await getInstagramPosts();
  return (
    <>
      <PageHeader
        title="Instagram gallery"
        subtitle="Manually curate the @whiteandwick strip that appears on the home page. Paste each post's image URL and its Instagram post link."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Instagram" }]}
      />
      <InstagramClient posts={posts} />
    </>
  );
}
