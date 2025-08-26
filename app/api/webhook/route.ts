import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

export const config = {
  api: {
    bodyParser: false, // ensure raw body
  },
};

export async function POST(req: Request) {
  const body = await req.text();
const incomingHeaders = await headers();
  const signature = incomingHeaders.get("Stripe-Signature");

  if (!signature) {
    return new NextResponse("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log("✅ Received event:", event.type);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error verifying signature";
    console.error("❌ Webhook signature verification failed:", errorMessage);
    return new NextResponse(`Webhook Error: ${errorMessage}`, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      if (!session?.metadata?.orgId) {
        return new NextResponse("Org ID is required", { status: 400 });
      }

      await db.orgSubscription.create({
        data: {
          orgId: session.metadata.orgId,
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        },
      });
    }

    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as Stripe.Invoice;
      const subscription = await stripe.subscriptions.retrieve(
        invoice.subscription as string
      );

      await db.orgSubscription.update({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        },
      });
    }

    return new NextResponse(null, { status: 200 });
  } catch (err) {
    console.error("❌ Error handling webhook:", err);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }
}
