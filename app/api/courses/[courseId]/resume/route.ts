import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";

export async function GET(
  _: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await requireUser();

    const nextItem = await prisma.courseItem.findFirst({
      where: {
        courseId: params.courseId,
        OR: [
          {
            type: "MODULE",
            module: {
              progresses: {
                none: { userId: user.id },
              },
            },
          },
          {
            type: "WORKSHOP",
            workshop: {
              submissions: {
                none: { userId: user.id },
              },
            },
          },
        ],
      },
      orderBy: { position: "asc" },
      include: {
        module: true,
        workshop: true,
      },
    });

    return NextResponse.json(nextItem);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch resume item" },
      { status: 500 }
    );
  }
}
