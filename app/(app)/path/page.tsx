import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import LearningPaths from "@/components/LearningPaths";

export const metadata: Metadata = {
  title: "Learning Paths | EduTIA",
  description: "Structured paths to help you master new skills and technologies.",
};

export default async function LearningPathsPage() {
  const learningPaths = await prisma.learningPath.findMany({
    where: {
      status: "PUBLISHED",
    },
    include: {
      items: {
        include: {
          course: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <LearningPaths learningPaths={learningPaths} />;
}