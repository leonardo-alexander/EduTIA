import { Metadata } from "next";
import LearningPaths from "@/components/path/LearningPaths";
import { getPaths } from "@/lib/data/paths";

export const metadata: Metadata = {
  title: "Learning Paths | EduTIA",
  description:
    "Explore curated learning paths on EduTIA to follow a structured journey and master new skills.",
  openGraph: {
    title: "Learning Paths | EduTIA",
    description:
      "Explore curated learning paths on EduTIA to follow a structured journey and master new skills.",
    type: "website",
  },
};

export default async function PathsPage() {
  const learningPaths = await getPaths();

  return <LearningPaths learningPaths={learningPaths} />;
}
