"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Card } from "@/components/admin/ui";
import type { OrderStatus, PaymentStatus } from "@/lib/types";
import { updateOrderStatusAction, updatePaymentStatusAction } from "../actions";

const ORDER_STATUSES: OrderStatus[] = [
  "new", "confirmed", "processing", "packed", "shipped", "out_for_delivery", "delivered", "cancelled", "returned",
];
const PAYMENT_STATUSES: PaymentStatus[] = ["pending", "paid", "failed", "refunded"];

export function OrderStatusControls({
  orderNumber,
  orderStatus,
  paymentStatus,
}: {
  orderNumber: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
}) {
  const [oStatus, setOStatus] = useState<OrderStatus>(orderStatus);
  const [pStatus, setPStatus] = useState<PaymentStatus>(paymentStatus);
  const [pending, start] = useTransition();
  const router = useRouter();

  return (
    <Card>
      <p className="eyebrow">Status</p>
      <div className="mt-4 grid gap-4">
        <div>
          <label className="text-xs text-cocoa-500">Order status</label>
          <select
            value={oStatus}
            onChange={(e) => setOStatus(e.target.value as OrderStatus)}
            className="mt-1.5 w-full rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500"
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-cocoa-500">Payment</label>
          <select
            value={pStatus}
            onChange={(e) => setPStatus(e.target.value as PaymentStatus)}
            className="mt-1.5 w-full rounded-xl border hairline bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-cocoa-500"
          >
            {PAYMENT_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() =>
            start(async () => {
              await Promise.all([
                updateOrderStatusAction(orderNumber, oStatus),
                updatePaymentStatusAction(orderNumber, pStatus),
              ]);
              router.refresh();
            })
          }
          disabled={pending || (oStatus === orderStatus && pStatus === paymentStatus)}
          className="rounded-full bg-cocoa-700 py-3 text-sm uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save status"}
        </button>
      </div>
    </Card>
  );
}
