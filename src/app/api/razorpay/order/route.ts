import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: "Razorpay credentials are not configured on the server." },
      { status: 500 },
    );
  }

  let body: { amount?: number; currency?: string; receipt?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const amount = Number(body.amount);
  const currency = (body.currency || "INR").toUpperCase();
  const receipt = body.receipt?.slice(0, 40);

  if (!Number.isFinite(amount) || amount < 100 || !Number.isInteger(amount)) {
    return NextResponse.json(
      { error: "Amount must be an integer of at least 100 paise." },
      { status: 400 },
    );
  }

  try {
    const client = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await client.orders.create({
      amount,
      currency,
      receipt: receipt || `wnw_${Date.now()}`,
    });
    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    const status =
      typeof err === "object" && err !== null && "statusCode" in err
        ? Number((err as { statusCode?: number }).statusCode)
        : 500;
    const message =
      err instanceof Error ? err.message : "Failed to create Razorpay order.";
    return NextResponse.json(
      { error: message },
      { status: status === 401 ? 401 : 500 },
    );
  }
}
