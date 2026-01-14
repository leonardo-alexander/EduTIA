import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawLimit = Number(searchParams.get("limit"));
    const limit = rawLimit > 0 && rawLimit <= 20 ? rawLimit : 3;

    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
      },
      orderBy: [
        { avgRating: "desc" },
        { reviewCount: "desc" },
        { title: "asc" },
      ],
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        thumbnailUrl: true,
        avgRating: true,
        reviewCount: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: courses,
    });
  } catch (error) {
    console.error("[COURSES_TOP]", error);
    return NextResponse.json(
      { message: "Failed to fetch top courses" },
      { status: 500 }
    );
  }
}
