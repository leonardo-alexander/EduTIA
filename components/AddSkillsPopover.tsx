"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Plus } from "lucide-react";

export default function AddSkillPopover({
  onAdd,
}: {
  onAdd: (name: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

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
        Add Skill
      </button>

      {open &&
        createPortal(
          <div
            ref={popoverRef}
            className="skill-popover absolute z-9999 w-64 bg-white border rounded-xl shadow-xl p-4"
            style={{
              top: pos.top,
              left: pos.left,
            }}
          >
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g. React, Python"
              className="w-full border rounded-md px-3 py-2 text-sm"
            />

            <div className="mt-3 flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="text-sm text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!value.trim()) return;
                  await onAdd(value);
                  setValue("");
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
