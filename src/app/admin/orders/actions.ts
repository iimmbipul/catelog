"use server";
import { revalidatePath } from "next/cache";
import { getOrders, saveOrders } from "@/lib/db";
import type { OrderStatus, PaymentStatus } from "@/lib/types";

export async function updateOrderStatusAction(orderNumber: string, status: OrderStatus) {
  const orders = await getOrders();
  const idx = orders.findIndex((o) => o.orderNumber === orderNumber);
  if (idx < 0) return { ok: false };
  orders[idx].orderStatus = status;
  await saveOrders(orders);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderNumber}`);
  return { ok: true };
}

export async function updatePaymentStatusAction(orderNumber: string, status: PaymentStatus) {
  const orders = await getOrders();
  const idx = orders.findIndex((o) => o.orderNumber === orderNumber);
  if (idx < 0) return { ok: false };
  orders[idx].paymentStatus = status;
  await saveOrders(orders);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderNumber}`);
  return { ok: true };
}
