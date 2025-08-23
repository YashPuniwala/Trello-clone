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
    if (event.event === "payment_link.paid") {
      const paymentData = event.payload.payment.entity;
      const notes = event.payload.payment.entity.notes;

      if (!notes?.orgId) {
        return new NextResponse("Org ID is required", { status: 400 });
      }

      // Save subscription/payment info
      await db.orgSubscription.upsert({
        where: { orgId: notes.orgId },
        update: {
          razorpayCustomerId: paymentData.customer_id,
          razorpaySubscriptionId: null,
          razorpayPlanId: null,
          razorpayCurrentPeriodEnd: null,
        },
        create: {
          orgId: notes.orgId,
          razorpayCustomerId: paymentData.customer_id,
        },
      });
    }

    if (event.event === "subscription.charged") {
      const sub = event.payload.subscription.entity;

      await db.orgSubscription.update({
        where: { orgId: sub.notes.orgId },
        data: {
          razorpaySubscriptionId: sub.id,
          razorpayPlanId: sub.plan_id,
          razorpayCurrentPeriodEnd: new Date(sub.current_end * 1000),
        },
      });
    }

    return new NextResponse("Webhook processed", { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return new NextResponse("Webhook processing failed", { status: 500 });
  }
}
