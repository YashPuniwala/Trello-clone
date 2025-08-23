import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ENTITY_TYPE } from "@prisma/client";
import { NextResponse } from "next/server";

type LogsRouteContext = {
  params: {
    cardId: string;
  };
};

export async function GET(
  request: Request,
  context: LogsRouteContext
) {
  try {
    const { userId, orgId } = await auth();
    const { cardId } = context.params;

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

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
