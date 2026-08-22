import { PageHeader, Card } from "@/components/admin/ui";
import { getSettings } from "@/lib/db";
import { SettingsForm } from "./SettingsForm";

export const metadata = { title: "Admin — Settings" };

export default async function SettingsPage() {
  const settings = await getSettings();
  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Store contact details, shipping thresholds, and integration credentials."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Settings" }]}
      />
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <SettingsForm settings={settings} />
        </Card>
        <div className="space-y-5">
          <Card>
            <p className="eyebrow">Integrations</p>
            <p className="mt-3 text-sm text-cocoa-500">
              Add API credentials as environment variables. The system is wired for these to work once keys are supplied.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-cocoa-500">
              <li className="rounded-xl border hairline px-4 py-3">
                <p className="text-cocoa-700">Razorpay (payments)</p>
                <p className="text-xs text-cocoa-400 font-mono">RAZORPAY_KEY_ID · RAZORPAY_KEY_SECRET</p>
              </li>
              <li className="rounded-xl border hairline px-4 py-3">
                <p className="text-cocoa-700">Shiprocket (shipping)</p>
                <p className="text-xs text-cocoa-400 font-mono">SHIPROCKET_TOKEN</p>
              </li>
              <li className="rounded-xl border hairline px-4 py-3">
                <p className="text-cocoa-700">WhatsApp (notifications)</p>
                <p className="text-xs text-cocoa-400 font-mono">WA_PHONE_ID · WA_TOKEN</p>
              </li>
              <li className="rounded-xl border hairline px-4 py-3">
                <p className="text-cocoa-700">Email (Resend / Postmark)</p>
                <p className="text-xs text-cocoa-400 font-mono">EMAIL_API_KEY · EMAIL_FROM</p>
              </li>
              <li className="rounded-xl border hairline px-4 py-3">
                <p className="text-cocoa-700">Storage (Supabase / S3)</p>
                <p className="text-xs text-cocoa-400 font-mono">STORAGE_URL · STORAGE_KEY</p>
              </li>
            </ul>
          </Card>
          <Card>
            <p className="eyebrow">Danger zone</p>
            <p className="mt-3 text-sm text-cocoa-500">Reset demo data or reseed the store from the seed file. Use with care.</p>
            <button className="mt-4 rounded-full border border-rose-500 px-4 py-2 text-xs uppercase tracking-widish text-rose-500 opacity-60 cursor-not-allowed">
              Reseed store (disabled)
            </button>
          </Card>
        </div>
      </div>
    </>
  );
}
