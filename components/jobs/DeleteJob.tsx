"use client";

import { deleteJob } from "@/actions/jobManagement";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function DeleteJobButton({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
      >
        Delete Job
      </button>

      <ConfirmDialog
        open={open}
        title="Delete Job Posting"
        description="This action cannot be undone. All applications related to this job will be permanently deleted."
        confirmText="Delete Job"
        onCancel={() => setOpen(false)}
        onConfirm={async () => {
          await deleteJob(jobId);
          setOpen(false);
          router.push("/dashboard");
        }}
      />
    </>
  );
}
