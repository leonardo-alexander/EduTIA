"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Plus } from "lucide-react";

type EducationForm = {
  institution: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  description?: string;
};

export default function AddEducationsPopover({
  onAdd,
}: {
  onAdd: (data: EducationForm) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [form, setForm] = useState<EducationForm>({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const isValid = form.institution.trim() !== "" && form.startDate !== "";

  const openPopover = () => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();

    const popoverWidth = 320;
    const margin = 12;

    const spaceRight = window.innerWidth - rect.left;
    const spaceLeft = rect.right;

    let left;

    if (spaceRight < popoverWidth + margin && spaceLeft > popoverWidth) {
      left = rect.right + window.scrollX - popoverWidth;
    } else {
      left = rect.left + window.scrollX;
    }

    setPos({
      top: rect.bottom + window.scrollY + 8,
      left,
    });

    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={openPopover}
        className="flex items-center gap-1 text-sm font-medium text-eduBlue hover:underline"
      >
        <Plus className="w-4 h-4" />
        Add Education
      </button>

      {open &&
        createPortal(
          <div
            ref={popoverRef}
            className="absolute z-50 w-80 bg-white rounded-xl shadow-xl p-4 space-y-3"
            style={{ top: pos.top, left: pos.left }}
          >
            <div>
              <label className="text-sm font-medium text-slate-700">
                Institution <span className="text-red-500">*</span>
              </label>
              <input
                className="mt-1 w-full px-4 py-3 rounded-xl bg-slate-50 text-sm text-slate-800 border border-slate-200 focus:outline-none focus:border-[#2269e9] focus:bg-white focus:ring-2 focus:ring-[#2269e9]/10 transition-all"
                value={form.institution}
                onChange={(e) =>
                  setForm({ ...form, institution: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Degree
              </label>
              <input
                className="mt-1 w-full px-4 py-3 rounded-xl bg-slate-50 text-sm text-slate-800 border border-slate-200 focus:outline-none focus:border-[#2269e9] focus:bg-white focus:ring-2 focus:ring-[#2269e9]/10 transition-all"
                value={form.degree}
                onChange={(e) => setForm({ ...form, degree: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Field of Study
              </label>
              <input
                className="mt-1 w-full px-4 py-3 rounded-xl bg-slate-50 text-sm text-slate-800 border border-slate-200 focus:outline-none focus:border-[#2269e9] focus:bg-white focus:ring-2 focus:ring-[#2269e9]/10 transition-all"
                value={form.fieldOfStudy}
                onChange={(e) =>
                  setForm({ ...form, fieldOfStudy: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="mt-1 w-full px-4 py-3 rounded-xl bg-slate-50 text-sm text-slate-800 border border-slate-200 focus:outline-none focus:border-[#2269e9] focus:bg-white focus:ring-2 focus:ring-[#2269e9]/10 transition-all"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm({ ...form, startDate: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  End Date
                </label>
                <input
                  type="date"
                  className="mt-1 w-full px-4 py-3 rounded-xl bg-slate-50 text-sm text-slate-800 border border-slate-200 focus:outline-none focus:border-[#2269e9] focus:bg-white focus:ring-2 focus:ring-[#2269e9]/10 transition-all"
                  value={form.endDate}
                  onChange={(e) =>
                    setForm({ ...form, endDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>

              <button
                disabled={!isValid}
                onClick={async () => {
                  await onAdd(form);
                  setOpen(false);
                }}
                className={`px-4 py-2 text-sm rounded-xl font-semibold transition-all ${
                  isValid
                    ? "bg-eduBlue text-white hover:shadow-md"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Add
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}