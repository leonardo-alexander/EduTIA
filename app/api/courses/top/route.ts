import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit")) || 3;

    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
        // Optional credibility guard (enable later if you want)
        // numberOfRate: { gt: 0 },
      },
      orderBy: [{ rate: "desc" }, { numberOfRate: "desc" }, { title: "asc" }],
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        thumbnailUrl: true,
        rate: true,
        numberOfRate: true,
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
