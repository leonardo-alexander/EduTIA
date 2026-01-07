import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminUser } from "@/lib/auth";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await requireAdminUser();

    const body = await req.json();
    const {
      title,
      description,
      category,
      level,
      duration,
      thumbnailUrl,
      isPublished,
    } = body;

    if (!title || !description || !category || !duration) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        category,
        level,
        duration,
        thumbnailUrl,
        isPublished,
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to create course" },
      { status: 500 }
    );
  }
}
