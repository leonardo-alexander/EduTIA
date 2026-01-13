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
    const { title, instructions, position } = body;

    if (!title || !instructions || position === undefined) {
      return NextResponse.json(
        { message: "title, instructions ,and position are required" },
        { status: 400 }
      );
    }

    const workshop = await prisma.workshop.create({
      data: {
        title,
        instructions,
        courseId,
      },
    });

    await prisma.courseItem.create({
      data: {
        courseId,
        position,
        type: "WORKSHOP",
        workshopId: workshop.id,
      },
    });

    return NextResponse.json(workshop, { status: 201 });
  } catch (error) {
    console.error("Create workshop error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
