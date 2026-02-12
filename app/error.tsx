"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-white via-slate-50 to-red-50 px-6">
      <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-xl border border-slate-100 p-10">
        <div className="text-4xl mb-4">⚠️</div>

        <h1 className="text-2xl font-bold text-slate-900 mb-3">
          Something went wrong
        </h1>

        <p className="text-slate-600 text-sm mb-6">
          An unexpected error occurred. Please try again.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-lg bg-eduBlue text-white font-medium hover:opacity-90 transition"
          >
            Try Again
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className="px-5 py-2.5 rounded-lg bg-slate-200 text-slate-700 font-medium hover:bg-slate-300 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
