import { requireAdminUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { pathId: string } }
) {
  try {
    await requireAdminUser();

    const { courseId, position } = await req.json();

    if (!courseId) {
      return NextResponse.json(
        { message: "courseId is required" },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      const count = await tx.learningPathItem.count({
        where: { learningPathId: params.pathId },
      });

      const insertPosition =
        position && position >= 1 && position <= count + 1
          ? position
          : count + 1;

      await tx.learningPathItem.updateMany({
        where: {
          learningPathId: params.pathId,
          position: { gte: insertPosition },
        },
        data: {
          position: { increment: 1 },
        },
      });

      await tx.learningPathItem.create({
        data: {
          learningPathId: params.pathId,
          courseId,
          position: insertPosition,
        },
      });
    });

    return NextResponse.json(
      { message: "Course added and reordered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add + reorder error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
