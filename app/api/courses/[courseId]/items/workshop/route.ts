import { requireAdminUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    await requireAdminUser();

    const { title, instructions, position } = await req.json();

    if (!title || !instructions || position === undefined) {
      return NextResponse.json(
        { message: "title, instruction, position required" },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.courseItem.updateMany({
        where: {
          courseId: params.courseId,
          position: { gte: position },
        },
        data: {
          position: { increment: 1 },
        },
      });

      const workshop = await tx.workshop.create({
        data: {
          title,
          instructions,
          courseId: params.courseId,
        },
      });

      await tx.courseItem.create({
        data: {
          courseId: params.courseId,
          position,
          type: "WORKSHOP",
          moduleId: workshop.id,
        },
      });
    });

    return NextResponse.json({ message: "Workshop added" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
