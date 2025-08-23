// app/api/webhook/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  if (!signature) {
    return new NextResponse("Missing signature", { status: 400 });
  }

  // Verify signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  // Parse event
  const event = JSON.parse(body);

  try {
  console.log("Webhook event received:", event);

  if (event.event === "payment_link.paid") {
    const paymentData = event.payload.payment.entity;
    console.log("Payment entity:", paymentData);

    const notes = paymentData.notes;
    console.log("Notes:", notes);

    if (!notes?.orgId) {
      console.error("No orgId in notes!");
      return new NextResponse("Org ID missing", { status: 400 });
    }

    await db.orgSubscription.upsert({
      where: { orgId: notes.orgId },
      update: {
        razorpayCustomerId: paymentData.customer_id,
      },
      create: {
        orgId: notes.orgId,
        razorpayCustomerId: paymentData.customer_id,
      },
    });

    console.log("DB updated successfully for org:", notes.orgId);
  }

  return new NextResponse("Webhook processed", { status: 200 });
} catch (err) {
  console.error("Webhook error:", err);
  return new NextResponse("Webhook processing failed", { status: 500 });
}
}
