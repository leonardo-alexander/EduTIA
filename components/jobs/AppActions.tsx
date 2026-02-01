"use client";

import { acceptApplication, rejectApplication } from "@/actions/jobManagement";

export function AppActions({ app }: { app: any }) {
  return (
    <div className="flex gap-2">
      <form action={acceptApplication.bind(null, app.id)}>
        <button
          disabled={app.status !== "APPLIED"}
          className="px-4 py-2 rounded-md bg-green-600 text-white text-sm hover:bg-green-700 disabled:opacity-50"
        >
          Accept
        </button>
      </form>

      <form action={rejectApplication.bind(null, app.id)}>
        <button
          disabled={app.status !== "APPLIED"}
          className="px-4 py-2 rounded-md bg-red-500 text-white text-sm hover:bg-red-600 disabled:opacity-50"
        >
          Reject
        </button>
      </form>
    </div>
  );
}
