import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ cardId: string }> } // 👈 params is a Promise
) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 👇 Await the params before using
    const { cardId } = await params;

    const card = await db.card.findFirst({
      where: {
        id: cardId,
        list: {
          board: {
            orgId,
          },
        },
      },
      include: {
        list: {
          select: { title: true },
        },
      },
    });

    return NextResponse.json(card);
  } catch (error) {
    console.error("Error fetching card:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
