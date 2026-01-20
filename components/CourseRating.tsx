"use client";

import { useTransition } from "react";
import RatingPopover from "./Rating";
import { rateCourse } from "@/actions/rate-course";

type Props = {
  courseId: string;
  userRating?: number;
  isAuthenticated: boolean;
};

export default function CourseRating({
  courseId,
  userRating = 0,
  isAuthenticated,
}: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <RatingPopover
      userRating={userRating}
      isAuthenticated={isAuthenticated}
      onRate={(rating, comment) => {
        startTransition(() => {
          rateCourse(courseId, rating, comment);
        });
      }}
    />
  );
}
