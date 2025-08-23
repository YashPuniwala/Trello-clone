"use server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ReturnType } from "./types";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { RazorpayRedirect } from "./schema";
import { absoluteUrl } from "@/lib/utils";
import { razorpay } from "@/lib/razorpay";
import { revalidatePath } from "next/cache";

const handler = async (): Promise<ReturnType> => {
  const { orgId, userId } = await auth();
  const user = await currentUser();
  
  if (!userId || !orgId || !user) {
    return {
      errors: "Unauthorized",
    };
  }

  const settingsUrl = absoluteUrl(`/organization/${orgId}`);
  
  try {
    const orgSubscription = await db.orgSubscription.findUnique({
      where: {
        orgId,
      }
    });

    if (orgSubscription && orgSubscription.razorpayCustomerId) {
      // User already has made payment (using existing field as indicator)
      return {
        data: settingsUrl
      };
    } else {
      // Create a one-time payment link
      const paymentLink = await razorpay.paymentLink.create({
        amount: 200000, // ₹2000 in paisa (2000 * 100)
        currency: "INR",
        accept_partial: false,
        description: "Trellux Pro - One-time Payment",
        customer: {
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
          email: user.emailAddresses[0].emailAddress,
        },
        notify: {
          sms: true,
          email: true
        },
        reminder_enable: true,
        callback_url: settingsUrl,
        callback_method: "get",
        notes: {
          orgId: orgId,
          userId: userId,
          type: "one_time_payment"
        }
      });

      revalidatePath(`/organization/${orgId}`);
      return { data: paymentLink.short_url };
    }
  } catch (error) {
    console.error("Razorpay error:", error);
    return {
      errors: "Something went wrong!"
    };
  }
};

export const razorpayRedirect = createSafeAction(RazorpayRedirect, handler);