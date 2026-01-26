import { prisma } from "@/lib/prisma";
import { CourseLevel, Prisma } from "@prisma/client";
import { CourseUI } from "@/types/course.ui";
import { mapCourseToUI } from "../mappers/course";

export async function getCourses(
  params: URLSearchParams = new URLSearchParams(),
  userId?: string,
): Promise<CourseUI[]> {
  const search = params.get("search")?.trim();
  const keywords = search ? search.split(/\s+/) : [];

  const category = params.get("category");
  const levels = params.getAll("level") as CourseLevel[];
  const durations = params.getAll("duration");

  const rating = params.get("rating")
    ? Number(params.get("rating"))
    : undefined;

  const sort = params.get("sort");

  let orderBy: Prisma.CourseOrderByWithRelationInput = { title: "asc" };
  if (sort === "rating") orderBy = { avgRating: "desc" };
  if (sort === "review") orderBy = { reviewCount: "desc" };
  if (sort === "newest") orderBy = { createdAt: "desc" };

  const and: Prisma.CourseWhereInput[] = [];

  if (keywords.length) {
    for (const word of keywords) {
      and.push({
        OR: [
          {
            title: { contains: word, mode: "insensitive" },
          },
          {
            description: { contains: word, mode: "insensitive" },
          },
        ],
      });
    }
  }

  if (category) {
    and.push({
      category: {
        slug: category,
      },
    });
  }

  if (levels.length) {
    and.push({
      level: { in: levels },
    });
  }

  if (durations.length) {
    and.push({
      OR: durations.flatMap<Prisma.CourseWhereInput>((d) => {
        switch (d) {
          case "extraShort":
            return [{ duration: { gte: 0, lte: 120 } }];
          case "short":
            return [{ duration: { gt: 120, lte: 300 } }];
          case "medium":
            return [{ duration: { gt: 300, lte: 600 } }];
          case "long":
            return [{ duration: { gt: 600, lte: 1200 } }];
          case "extraLong":
            return [{ duration: { gt: 1200 } }];
          default:
            return [];
        }
      }),
    });
  }

  if (rating !== undefined) {
    and.push({
      avgRating: { gte: rating },
    });
  }

  const courses = await prisma.course.findMany({
    where: {
      isPublished: true,
      AND: and.length ? and : undefined,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      level: true,
      duration: true,
      thumbnailUrl: true,
      avgRating: true,
      reviewCount: true,
      category: {
        select: { id: true, name: true, slug: true },
      },
      favorites: userId
        ? { where: { userId }, select: { userId: true } }
        : false,
    },
    orderBy,
  });

  return courses.map((course) =>
    mapCourseToUI(course, userId ? { userId } : {}),
  );
}
