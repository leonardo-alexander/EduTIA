import { CourseLevel } from "@prisma/client";

export type CourseUI = {
  id: string;
  title: string;
  description: string;
  level: CourseLevel;
  duration: number;
  thumbnailUrl: string;
  avgRating: number;
  reviewCount: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
};
