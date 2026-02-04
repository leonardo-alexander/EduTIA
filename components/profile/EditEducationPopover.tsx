"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { updateEducation } from "@/actions/moreProfile";

export default function EditEducationPopover({
  education,
  onClose,
}: {
  education: any;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    institution: education.institution,
    degree: education.degree,
    fieldOfStudy: education.fieldOfStudy,
    startDate: new Date(education.startDate).toISOString().slice(0, 10),
    endDate: education.endDate
      ? new Date(education.endDate).toISOString().slice(0, 10)
      : "",
    description: education.description,
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
        <h3 className="font-semibold text-lg">Edit Education</h3>

        <input
          className="w-full border rounded px-3 py-2 text-sm"
          value={form.institution}
          onChange={(e) => setForm({ ...form, institution: e.target.value })}
        />

        <input
          className="w-full border rounded px-3 py-2 text-sm"
          value={form.degree}
          onChange={(e) => setForm({ ...form, degree: e.target.value })}
        />

        <input
          className="w-full border rounded px-3 py-2 text-sm"
          value={form.fieldOfStudy}
          onChange={(e) => setForm({ ...form, fieldOfStudy: e.target.value })}
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

        <input
          className="w-full border rounded px-3 py-2 text-sm"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onClose} className="text-sm text-gray-500">
            Cancel
          </button>
          <button
            onClick={async () => {
              await updateEducation(education.id, form);
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
