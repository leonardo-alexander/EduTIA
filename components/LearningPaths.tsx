"use client";

import { BookOpen, Rocket } from "lucide-react";
import LearningPathCard from "@/components/LearningPathCard";
import { LearningPath, LearningPathItem, Course } from "@prisma/client";

type LearningPathWithItems = LearningPath & {
  items: (LearningPathItem & {
    course: Course;
  })[];
};

type LearningPathsProps = {
  learningPaths: LearningPathWithItems[];
};

export default function LearningPaths({ learningPaths }: LearningPathsProps) {
  const showComingSoon = learningPaths.length < 4;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between h-10">
            <h1 className="text-lg font-bold text-slate-900">Learning Paths</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {learningPaths.length > 0 ? (
          <div className="grid grid-cols-1 gap-8">
            {learningPaths.map((path) => (
              <LearningPathCard key={path.id} learningPath={path} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No paths published yet</h3>
          </div>
        )}

        {/* coming soon indicator */}
        {showComingSoon && learningPaths.length > 0 && (
          <div className="mt-12 md:mt-16 flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-3xl bg-white border border-slate-200 border-dashed">
            <div className="mb-4 transform rotate-3">
              <Rocket className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-300">More Paths Await</h3>
          </div>
        )}
      </div>
    </div>
  );
}