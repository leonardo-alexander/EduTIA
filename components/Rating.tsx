"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";

type RatingProps = {
  userRating?: number;
  onRate?: (rating: number, comment: string) => void;
  isAuthenticated: boolean;
};

export default function RatingPopover({
  userRating,
  onRate,
  isAuthenticated,
}: RatingProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [rating, setRating] = useState(userRating ?? 0);

  const [comment, setComment] = useState("");

  useEffect(() => {
    setRating(userRating ?? 0);
  }, [userRating]);

  const closeModal = () => {
    setOpen(false);
    setHovered(null);
    setComment("");
  };

  return (
    <>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              if (!isAuthenticated) {
                router.push("/login");
                return;
              }

              setRating(i);
              setHovered(null);
              setOpen(true);
            }}
            onMouseEnter={() => {
              if (!open) setHovered(i);
            }}
            onMouseLeave={() => {
              if (!open) setHovered(null);
            }}
            className="p-0 transition-transform hover:scale-110"
          >
            <Star
              className={`h-4 w-4 transition-colors ${
                isAuthenticated &&
                i <= (open ? rating : (hovered ?? userRating ?? 0))
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-slate-300"
              }`}
            />
          </button>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />

          <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Rate this course
            </h3>

            <p className="text-sm text-slate-500 mb-4">Share your experience</p>

            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setRating(i)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-7 w-7 transition-all duration-150 ${
                      i <= (hovered ?? rating)
                        ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.6)]"
                        : "text-slate-300"
                    }`}
                  />
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              placeholder="Leave a comment (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full resize-none rounded-lg border border-slate-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-eduBlue"
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm rounded-lg border text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                disabled={rating === 0}
                onClick={() => {
                  onRate?.(rating, comment);
                  closeModal();
                  router.refresh();
                }}
                className={`px-4 py-2 text-sm font-semibold rounded-lg ${
                  rating === 0
                    ? "bg-slate-300 text-slate-500"
                    : "bg-eduBlue text-white hover:bg-blue-700"
                }`}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
