// app/api/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // Verify signature
  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);

  try {
    switch (event.event) {
      case "payment_link.paid": {
        const paymentData = event.payload.payment.entity;
        const notes = paymentData.notes;

        if (!notes?.orgId) {
          console.error("Webhook error: Missing orgId in notes");
          return NextResponse.json({ error: "Org ID is required" }, { status: 400 });
        }

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

        console.log("Payment link paid processed for org:", notes.orgId);
        break;
      }

      case "subscription.charged": {
        const sub = event.payload.subscription.entity;

        await db.orgSubscription.update({
          where: { orgId: sub.notes.orgId },
          data: {
            razorpaySubscriptionId: sub.id,
            razorpayPlanId: sub.plan_id,
            razorpayCurrentPeriodEnd: new Date(sub.current_end * 1000),
          },
        });

        console.log("Subscription charged processed for org:", sub.notes.orgId);
        break;
      }

      case "subscription.activated": {
        const sub = event.payload.subscription.entity;
        console.log("Subscription activated:", sub.id);
        // (Optional) update DB if you need to track activation state
        break;
      }

      case "payment.failed": {
        const payment = event.payload.payment.entity;
        console.warn("Payment failed:", payment.id);
        // (Optional) log failures or notify admins
        break;
      }

      default:
        console.log("Unhandled event:", event.event);
    }

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
