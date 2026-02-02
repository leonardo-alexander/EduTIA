"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { updateExperience } from "@/actions/moreProfile";

export default function EditExperiencePopover({
  experience,
  onClose,
}: {
  experience: any;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    jobTitle: experience.jobTitle,
    companyName: experience.companyName,
    startDate: new Date(experience.startDate).toISOString().slice(0, 10),
    endDate: experience.endDate
      ? new Date(experience.endDate).toISOString().slice(0, 10)
      : "",
  });

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-96 p-6 space-y-4">
        <h3 className="font-semibold text-lg">Edit Experience</h3>

        <input
          className="w-full border rounded px-3 py-2 text-sm"
          value={form.jobTitle}
          onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
        />

        <input
          className="w-full border rounded px-3 py-2 text-sm"
          value={form.companyName}
          onChange={(e) => setForm({ ...form, companyName: e.target.value })}
        />

        <input
          type="date"
          className="w-full border rounded px-3 py-2 text-sm"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
        />

        <input
          type="date"
          className="w-full border rounded px-3 py-2 text-sm"
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
        />

        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onClose} className="text-sm text-gray-500">
            Cancel
          </button>
          <button
            onClick={async () => {
              await updateExperience(experience.id, form);
              window.location.reload();
            }}
            className="px-4 py-2 bg-eduBlue text-white rounded-md text-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
