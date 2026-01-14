import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export async function POST(
  _: Request,
  { params }: { params: { workshopId: string } }
) {
  try {
    const user = await requireUser();

    const workshop = await prisma.workshop.findFirst({
      where: {
        id: params.workshopId,
        course: { isPublished: true },
      },
      select: { id: true, courseId: true },
    });

    if (!workshop) {
      return NextResponse.json(
        { message: "Workshop not found" },
        { status: 404 }
      );
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: workshop.courseId,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { message: "Not enrolled in this course" },
        { status: 403 }
      );
    }

    await prisma.workshopRegistration.create({
      data: {
        userId: user.id,
        workshopId: workshop.id,
      },
    });

    return NextResponse.json(
      { message: "Workshop registered" },
      { status: 200 }
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "Already registered" },
        { status: 409 }
      );
    }

    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
