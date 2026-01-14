import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { title, contentUrl, position } = await req.json();

    if (!title || !contentUrl || position === undefined) {
      return NextResponse.json(
        { message: "title, contentUrl, position required" },
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

      const module = await tx.module.create({
        data: {
          title,
          contentUrl,
          courseId: params.courseId,
        },
      });

      await tx.courseItem.create({
        data: {
          courseId: params.courseId,
          position,
          type: "MODULE",
          moduleId: module.id,
        },
      });
    });

    return NextResponse.json({ message: "Module added" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
