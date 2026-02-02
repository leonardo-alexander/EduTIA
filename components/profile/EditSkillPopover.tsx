"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { updateSkill } from "@/actions/moreProfile";

export default function EditSkillPopover({
  skill,
  onClose,
}: {
  skill: { id: string; name: string };
  onClose: () => void;
}) {
  const [name, setName] = useState(skill.name);

  // lock background scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-80 rounded-xl p-5 space-y-4"
      >
        <h3 className="font-semibold text-lg">Edit Skill</h3>

        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm"
          placeholder="Skill name"
        />

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="text-sm text-gray-500">
            Cancel
          </button>

          <button
            onClick={async () => {
              if (!name.trim()) return;
              await updateSkill(skill.id, name);
              window.location.reload();
            }}
            className="px-4 py-2 text-sm bg-eduBlue text-white rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
