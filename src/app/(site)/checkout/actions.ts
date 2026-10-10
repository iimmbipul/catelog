"use server";
import { getCouponByCode, getOrders, saveOrders } from "@/lib/db";
import type { CartItem } from "@/lib/store";
import type { Order } from "@/lib/types";

function nextOrderNumber(existing: Order[]) {
  const nums = existing
    .map((o) => Number(o.orderNumber.replace(/^WW-/, "")))
    .filter((n) => Number.isFinite(n));
  const max = nums.length ? Math.max(...nums) : 1042;
  return `WW-${max + 1}`;
}

interface CheckoutInput {
  items: CartItem[];
  coupon?: string | null;
  giftMessage?: string;
  notes?: string;
  address: {
    name: string;
    email: string;
    phone: string;
    line1: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export async function placeOrder(input: CheckoutInput) {
  const items = input.items;
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  let discount = 0;
  if (input.coupon) {
    const c = await getCouponByCode(input.coupon);
    if (c && c.active) {
      if (c.type === "percent")
        discount = Math.min(c.maxDiscount ?? Infinity, Math.round(subtotal * (c.value / 100)));
      else discount = Math.min(c.value, subtotal);
    }
  }
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 60;
  const total = Math.max(0, subtotal - discount + shipping);

  const orders = await getOrders();
  const number = nextOrderNumber(orders);
  const order: Order = {
    id: `o_${Date.now()}`,
    orderNumber: number,
    customerId: `cus_${Date.now()}`,
    customerName: input.address.name,
    createdAt: new Date().toISOString(),
    items: items.map((i) => ({
      productId: i.productId,
      name: i.name,
      image: i.image,
      qty: i.qty,
      price: i.price,
      fragrance: i.fragrance,
      color: i.color,
    })),
    subtotal,
    discount,
    shipping,
    total,
    paymentStatus: "pending",
    orderStatus: "new",
    coupon: input.coupon ?? undefined,
    address: {
      name: input.address.name,
      phone: input.address.phone,
      email: input.address.email,
      line1: input.address.line1,
      area: input.address.area,
      city: input.address.city,
      state: input.address.state,
      pincode: input.address.pincode,
    },
    giftMessage: input.giftMessage || undefined,
    notes: input.notes || undefined,
  };
  await saveOrders([order, ...orders]);
  return { orderNumber: number };
}
