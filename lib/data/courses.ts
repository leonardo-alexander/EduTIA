import { prisma } from "@/lib/prisma";
import { CourseLevel, Prisma } from "@prisma/client";
import { CourseUI } from "@/types/course-ui";

export async function getCourses(params: URLSearchParams): Promise<CourseUI[]> {
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

  return prisma.course.findMany({
    where: {
      isPublished: true,

      AND: [
        ...keywords.map((word) => ({
          OR: [
            {
              title: {
                contains: word,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              description: {
                contains: word,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        })),

        ...(category
          ? [
              {
                category: {
                  slug: category,
                },
              },
            ]
          : []),

        ...(levels.length
          ? [
              {
                level: {
                  in: levels,
                },
              },
            ]
          : []),

        ...(durations.length
          ? [
              {
                OR: durations.flatMap<Prisma.CourseWhereInput>((d) => {
                  if (d === "extraShort")
                    return [{ duration: { gte: 0, lte: 120 } }];
                  if (d === "short")
                    return [{ duration: { gt: 120, lte: 300 } }];
                  if (d === "medium")
                    return [{ duration: { gt: 300, lte: 600 } }];
                  if (d === "long")
                    return [{ duration: { gt: 600, lte: 1200 } }];
                  if (d === "extraLong") return [{ duration: { gt: 1200 } }];
                  return [];
                }),
              },
            ]
          : []),

        ...(rating !== undefined
          ? [
              {
                avgRating: {
                  gte: rating,
                },
              },
            ]
          : []),
      ],
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
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy,
  });
}
