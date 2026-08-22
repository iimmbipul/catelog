import { CartClient } from "@/components/site/CartClient";
import { getCoupons, getSettings } from "@/lib/db";

export const metadata = { title: "Cart" };

export default async function CartPage() {
  const [coupons, settings] = await Promise.all([getCoupons(), getSettings()]);
  return <CartClient coupons={coupons} freeShippingAbove={settings.freeShippingAbove} />;
}
