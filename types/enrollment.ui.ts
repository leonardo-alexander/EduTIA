import { Enrollment, Course, Category } from "@prisma/client";

export type EnrollmentUI = Enrollment & {
  course: Course & {
    category: Category;
  };
  isFavorite: boolean;
};
