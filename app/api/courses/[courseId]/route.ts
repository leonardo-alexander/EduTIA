import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminUser } from "@/lib/auth";

type Context = {
  params: { courseId: string };
};

export async function GET(_: Request, { params }: Context) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: params.courseId },
    });

    if (!course) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch course" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: Context) {
  try {
    await requireAdminUser();

    const body = await req.json();
    const { title, description, price } = body;

    if (!title || !description || typeof price !== "number") {
      return NextResponse.json(
        { message: "Invalid course data" },
        { status: 400 }
      );
    }

    const course = await prisma.course.update({
      where: { id: params.courseId },
      data: { title, description },
    });

    return NextResponse.json(course);
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (error.message === "FORBIDDEN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 }
      );
    }

    console.error(error);
    return NextResponse.json(
      { message: "Failed to update course" },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: Context) {
  try {
    await requireAdminUser();

    await prisma.course.delete({
      where: { id: params.courseId },
    });

    return NextResponse.json({
      message: "Course deleted successfully",
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (error.message === "FORBIDDEN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 }
      );
    }

    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete course" },
      { status: 500 }
    );
  }
}
