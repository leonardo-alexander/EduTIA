import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params;

    if (!courseId) {
      return NextResponse.json(
        { message: "Course ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { title, contentUrl, position } = body;

    if (!title || !contentUrl || position === undefined) {
      return NextResponse.json(
        { message: "title, contentUrl, and position are required" },
        { status: 400 }
      );
    }

    const module = await prisma.module.create({
      data: {
        title,
        contentUrl,
        courseId,
      },
    });

    await prisma.courseItem.create({
      data: {
        courseId,
        position,
        type: "MODULE",
        moduleId: module.id,
      },
    });

    return NextResponse.json(module, { status: 201 });
  } catch (error) {
    console.error("Create module error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
