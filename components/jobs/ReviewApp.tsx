"use client";

import { reviewApplication, rejectApplication } from "@/actions/jobManagement";

export function ReviewApp({ app }: { app: any }) {
  return (
    <div className="flex items-center gap-6">
      <form action={reviewApplication.bind(null, app.id)}>
        <button
          disabled={app.status !== "APPLIED"}
          className="px-10 py-2 rounded-full font-semibold text-sm bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Review
        </button>
      </form>

      <form action={rejectApplication.bind(null, app.id)}>
        <button
          disabled={app.status !== "APPLIED"}
          className="px-10 py-2 rounded-full font-semibold text-sm bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reject
        </button>
      </form>
    </div>
  );
}