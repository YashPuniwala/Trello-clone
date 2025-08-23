import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ENTITY_TYPE } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ cardId: string }> } // ✅ params is a Promise
) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // ✅ Await the params before using
    const { cardId } = await params;

    const auditLogs = await db.auditLog.findMany({
      where: {
        orgId,
        entityId: cardId,
        entityType: ENTITY_TYPE.CARD,
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    return NextResponse.json(auditLogs);
  } catch (error) {
    console.error("[AUDIT_LOGS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
