"use client";

import { useActionState, useEffect, useState } from "react";
import { updateJob } from "@/actions/jobManagement";
import { useRouter } from "next/navigation";
import { JobCategory } from "@prisma/client";
import { JobUI } from "@/types/job.ui";
import { Pencil } from "lucide-react";

export default function UpdateJobPopover({
  job,
  categories,
}: {
  job: JobUI;
  categories: JobCategory[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [state, formAction, isPending] = useActionState(updateJob, null);

  useEffect(() => {
    if (state?.success) {
      setOpen(false);
      router.refresh();
    }
  }, [state, router]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const inputClasses =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-eduBlue/20 focus:border-eduBlue transition-all";
  const selectClasses =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-eduBlue/20 focus:border-eduBlue transition-all appearance-none cursor-pointer";
  const labelClasses =
    "text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-eduBlue px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
      >
        <Pencil className="w-4 h-4" />
        Edit Job
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] rounded-2xl bg-white shadow-2xl flex flex-col overflow-hidden">
            <form
              id="job-form"
              action={formAction}
              className="flex-1 overflow-y-auto px-6 py-6 space-y-6"
            >
              <input type="hidden" name="slug" defaultValue={job.slug} />

              <div>
                <label className={labelClasses}>
                  Job Title
                </label>
                <input
                  name="title"
                  defaultValue={job.title}
                  placeholder="e.g. Senior Frontend Developer"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className={labelClasses}>
                  Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={job.description}
                  placeholder="Describe the role, responsibilities, and requirements..."
                  className={`${inputClasses} resize-none`}
                />
              </div>

              <div>
                <label className={labelClasses}>
                  Location
                </label>
                <input
                  name="location"
                  defaultValue={job.location || ""}
                  placeholder="e.g. Jakarta, Indonesia"
                  className={inputClasses}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>
                    Category
                  </label>
                  <select
                    name="categoryId"
                    defaultValue={job.category.id}
                    className={selectClasses}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClasses}>
                    Job Type
                  </label>
                  <select
                    name="type"
                    defaultValue={job.type}
                    className={selectClasses}
                  >
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="FREELANCE">Freelance</option>
                    <option value="INTERNSHIP">Internship</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>
                    Work Mode
                  </label>
                  <select
                    name="mode"
                    defaultValue={job.workMode}
                    className={selectClasses}
                  >
                    <option value="ONSITE">Onsite</option>
                    <option value="REMOTE">Remote</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className={labelClasses}>
                    Experience Level
                  </label>
                  <select
                    name="level"
                    defaultValue={job.level ?? ""}
                    className={selectClasses}
                  >
                    <option value="">Any</option>
                    <option value="JUNIOR">Junior</option>
                    <option value="MID">Mid</option>
                    <option value="SENIOR">Senior</option>
                    <option value="LEAD">Lead</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClasses}>
                  Salary Range
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    name="paycheckMin"
                    defaultValue={job.paycheckMin ?? ""}
                    placeholder="Min salary"
                    className={inputClasses}
                  />
                  <input
                    type="number"
                    name="paycheckMax"
                    defaultValue={job.paycheckMax ?? ""}
                    placeholder="Max salary"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    name="expiredDate"
                    defaultValue={
                      job.expiresAt
                        ? new Date(job.expiresAt).toISOString().split("T")[0]
                        : ""
                    }
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className={labelClasses}>
                    Status
                  </label>
                  <select
                    name="status"
                    defaultValue={job.status}
                    className={selectClasses}
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </div>
              </div>
            </form>

            {state?.error && (
              <div className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600 font-medium">{state.error}</p>
              </div>
            )}

            <div className="shrink-0 border-t border-slate-200 bg-slate-50 px-6 py-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                form="job-form"
                disabled={isPending}
                className="rounded-xl bg-eduBlue px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
              >
                {isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}