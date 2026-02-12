"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Plus } from "lucide-react";

export default function AddExperiencePopover({
  onAdd,
}: {
  onAdd: (data: {
    jobTitle: string;
    companyName: string;
    startDate: string;
    endDate?: string;
  }) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [form, setForm] = useState({
    jobTitle: "",
    companyName: "",
    startDate: "",
    endDate: "",
  });

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
        Add Experience
      </button>

      {open &&
        createPortal(
          <div
            ref={popoverRef}
            className="absolute z-9999 w-72 bg-white border rounded-xl shadow-xl p-4 space-y-3"
            style={{
              top: pos.top,
              left: pos.left,
            }}
          >
            <div>
              <label
                htmlFor="jobTitle"
                className="text-xs font-medium text-slate-600"
              >
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                id="jobTitle"
                required
                className="mt-1 w-full border rounded px-3 py-2 text-sm"
                value={form.jobTitle}
                onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
              />
            </div>

            <div>
              <label
                htmlFor="companyName"
                className="text-xs font-medium text-slate-600"
              >
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                id="companyName"
                required
                className="mt-1 w-full border rounded px-3 py-2 text-sm"
                value={form.companyName}
                onChange={(e) =>
                  setForm({ ...form, companyName: e.target.value })
                }
              />
            </div>

            <div>
              <label
                htmlFor="startDate"
                className="text-xs font-medium text-slate-600"
              >
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                id="startDate"
                type="date"
                required
                className="mt-1 w-full border rounded px-3 py-2 text-sm"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
              />
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="text-xs font-medium text-slate-600"
              >
                End Date
              </label>
              <input
                id="endDate"
                type="date"
                className="mt-1 w-full border rounded px-3 py-2 text-sm"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setOpen(false)}
                className="text-sm text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await onAdd(form);
                  setOpen(false);
                }}
                className="px-3 py-1.5 text-sm bg-eduBlue text-white rounded-md"
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
