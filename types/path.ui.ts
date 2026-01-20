import {
  LearningPath,
  LearningPathItem,
  Course,
  Category,
} from "@prisma/client";

export type PathUI = LearningPath & {
  items: {
    id: string;
    position: number;
    course: {
      id: string;
      title: string;
      slug: string;
      duration: number;
    };
  }[];
};

type CourseWithMeta = Course & {
  category: Category;
  _count: {
    items: number;
    favorites: number;
  };
};

export type PathDetailUI = LearningPath & {
  items: (LearningPathItem & {
    course: CourseWithMeta & {
      isFavorite: boolean;
    };
  })[];
};
