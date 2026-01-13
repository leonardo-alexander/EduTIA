import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminUser } from "@/lib/auth";
import { slugify } from "@/lib/slugify";
import { Prisma, CourseLevel } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search");
    const keywords = search?.trim().split(/\s+/) ?? [];
    const category = searchParams.get("category");
    const levels = searchParams.getAll("level");
    const durations = searchParams.getAll("duration");
    const rate = Number(searchParams.get("rate"));
    const sort = searchParams.get("sort");

    let orderBy: Prisma.CourseOrderByWithRelationInput = { title: "asc" };
    if (sort === "rating") {
      orderBy = { avgRating: "desc" };
    } else if (sort === "review") {
      orderBy = { reviewCount: "desc" };
    } else if (sort === "newest") {
      orderBy = { createdAt: "desc" };
    }

    const courses = await prisma.course.findMany({
      where: {
        ...(keywords.length && {
          AND: keywords.map((word) => ({
            OR: [
              { title: { contains: word, mode: "insensitive" } },
              { description: { contains: word, mode: "insensitive" } },
            ],
          })),
        }),

        ...(category && {
          category: {
            slug: category,
          },
        }),

        ...(levels.length && {
          level: {
            in: levels as CourseLevel[],
          },
        }),

        ...(durations.length && {
          OR: durations.map((d) => {
            switch (d) {
              case "extraShort":
                return { duration: { gte: 0, lte: 120 } };
              case "short":
                return { duration: { gt: 120, lte: 300 } };
              case "medium":
                return { duration: { gt: 300, lte: 600 } };
              case "long":
                return { duration: { gt: 600, lte: 1200 } };
              case "extraLong":
                return { duration: { gt: 1200 } };
              default:
                return {};
            }
          }),
        }),

        ...(rate && { rate: { gte: rate } }),

        isPublished: true,
      },
      orderBy,
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
        slug: slugify(title),
        description,
        level,
        duration,
        thumbnailUrl,
        isPublished,

        category: {
          connect: {
            slug: category,
          },
        },
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
