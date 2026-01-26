"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  XCircle,
  ExternalLink,
} from "lucide-react";

interface CourseItemViewerProps {
  item: {
    id: string;
    title: string;
    type: "MODULE" | "WORKSHOP";
    module?: {
      id: string;
      contentUrl: string;
    } | null;
    workshop?: {
      id: string;
      instructions: string;
    } | null;
  };
  courseSlug: string;
  isCompleted: boolean;
  submission?: {
    submissionUrl: string;
    score?: number | null;
    feedback?: string | null;
  } | null;
  prevItem?: { slug: string; title: string } | null;
  nextItem?: { slug: string; title: string } | null;
}

export default function CourseItemViewer({
  item,
  courseSlug,
  isCompleted: initialCompleted,
  prevItem,
  nextItem,
}: CourseItemViewerProps) {
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(initialCompleted);

  const handleComplete = async () => {
    const newStatus = !isCompleted;
    setIsCompleted(newStatus);

    try {
      if (newStatus) {
        if (item.type === "MODULE" && item.module) {
          await fetch(`/api/modules/${item.module.id}/complete`, {
            method: "POST",
          });
        } else if (item.type === "WORKSHOP" && item.workshop) {
          await fetch(`/api/workshops/${item.workshop.id}/submissions`, {
            method: "POST",
            body: JSON.stringify({ submissionUrl: "MARKED_AS_COMPLETE" }),
          });
        }
      } else {
        
      }
      
      router.refresh();
    } catch (error) {
      console.error("Error updating status:", error);
      setIsCompleted(!newStatus);
    }
  };

  const isVideo = (url: string) => {
    return (
      url.includes("youtube.com") ||
      url.includes("youtu.be") ||
      url.includes("vimeo.com") ||
      url.endsWith(".mp4")
    );
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <Link
              href={`/courses/${courseSlug}`}
              className="text-sm text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 font-medium"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Course
            </Link>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                item.type === "MODULE"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              {item.type}
            </span>
            {isCompleted && (
              <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold uppercase tracking-wider">
                <CheckCircle className="w-3 h-3" /> Completed
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-slate-900">{item.title}</h1>
            {item.type === "MODULE" &&
              item.module &&
              !isVideo(item.module.contentUrl) && (
                <a
                  href={item.module.contentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  Open in new tab <ExternalLink className="w-4 h-4" />
                </a>
              )}
          </div>
        </div>

        {item.type === "MODULE" && item.module && (
          <div className="p-0">
            {isVideo(item.module.contentUrl) ? (
              <div className="aspect-video bg-black">
                <iframe
                  src={item.module.contentUrl.replace("watch?v=", "embed/")}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            ) : (
              <div className="flex flex-col h-[600px] border-b border-slate-200">
                <iframe
                  src={item.module.contentUrl}
                  className="w-full flex-1 border-0 bg-white"
                  title="Module Content"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                />
              </div>
            )}

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleComplete}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                  isCompleted
                    ? "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-red-600 hover:border-red-200"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                }`}
              >
                {isCompleted ? (
                  <>
                    <XCircle className="w-5 h-5" />
                    Mark as Incomplete
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Mark as Complete
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {item.type === "WORKSHOP" && item.workshop && (
          <div className="p-0">
            <div className="p-8 space-y-8">
              <div className="prose prose-slate max-w-none">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Instructions
                </h3>
                <div className="whitespace-pre-wrap text-slate-600 leading-relaxed">
                  {item.workshop.instructions}
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleComplete}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                  isCompleted
                    ? "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-red-600 hover:border-red-200"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                }`}
              >
                {isCompleted ? (
                  <>
                    <XCircle className="w-5 h-5" />
                    Mark as Incomplete
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Mark as Complete
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-4">
        {prevItem ? (
          <Link
            href={`/courses/${courseSlug}/${prevItem.slug}`}
            className="flex-1 group flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-600 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">
                Previous
              </p>
              <p className="text-slate-900 font-semibold truncate">
                {prevItem.title}
              </p>
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}

        {nextItem ? (
          <Link
            href={`/courses/${courseSlug}/${nextItem.slug}`}
            className="flex-1 group flex items-center justify-end gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all text-right"
          >
            <div className="overflow-hidden">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">
                Next
              </p>
              <p className="text-slate-900 font-semibold truncate">
                {nextItem.title}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-600 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </div>
          </Link>
        ) : (
          <Link
            href={`/courses/${courseSlug}`}
            className="flex-1 group flex items-center justify-end gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-md transition-all text-right"
          >
            <div className="overflow-hidden">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">
                Finish
              </p>
              <p className="text-slate-900 font-semibold truncate">
                Back to Course
              </p>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-emerald-50 text-slate-400 group-hover:text-emerald-600 transition-colors">
              <CheckCircle className="w-5 h-5" />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}