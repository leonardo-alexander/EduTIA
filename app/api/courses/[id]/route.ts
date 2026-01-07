import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromCookie } from "@/lib/auth";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: Context) {
  try {
    const { id } = await context.params;

    const course = await prisma.course.findUnique({
      where: { id },
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

export async function PUT(req: Request, context: Context) {
  try {
    const user = await getUserFromCookie();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await req.json();

    const course = await prisma.course.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to update course" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, context: Context) {
  try {
    const { id } = await context.params;
    const user = await getUserFromCookie();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    await prisma.course.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete course" },
      { status: 500 }
    );
  }
}
