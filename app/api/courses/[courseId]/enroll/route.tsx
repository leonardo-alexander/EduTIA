import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function POST(
  _: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await requireUser();

    const course = await prisma.course.findFirst({
      where: {
        id: params.courseId,
        isPublished: true,
      },
      select: { id: true },
    });

    if (!course) {
      return NextResponse.json(
        { message: "Course not found or not published" },
        { status: 404 }
      );
    }

    await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: params.courseId,
        progressPercent: 0,
        status: "IN_PROGRESS",
      },
    });

    return NextResponse.json(
      { message: "Enrollment successful" },
      { status: 201 }
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "Already enrolled" },
        { status: 409 }
      );
    }

    console.error("Enrollment error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
