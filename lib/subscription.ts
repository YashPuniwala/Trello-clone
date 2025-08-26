import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

const DAY_IN_MS = 84_400_000;

export const checkSubscription = async () => {
  const { orgId } = await auth();
  if (!orgId) return false;

  const orgSubscription = await db.orgSubscription.findUnique({
    where: { orgId },
  });

  if (!orgSubscription) return false;

  const periodEnd = orgSubscription.stripeCurrentPeriodEnd?.getTime() ?? 0;

  return (
    !!orgSubscription.stripePriceId &&
    periodEnd + DAY_IN_MS > Date.now()
  );
};
