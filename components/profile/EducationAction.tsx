"use client";

import { useState } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EditEducationPopover from "./EditEducationPopover";
import { deleteEducation } from "@/actions/moreProfile";

export default function EducationActions({ edu }: { edu: any }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="p-1 rounded hover:bg-slate-100"
        >
          <MoreVertical className="w-4 h-4 text-slate-500" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-md z-20">
            <button
              onClick={() => {
                setEditOpen(true);
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-slate-50"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </button>

            <button
              onClick={() => {
                setConfirmOpen(true);
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        )}
      </div>

      {editOpen && (
        <EditEducationPopover
          education={edu}
          onClose={() => setEditOpen(false)}
        />
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete education?"
        description="This education will be permanently removed."
        confirmText="Delete"
        danger
        onCancel={() => setConfirmOpen(false)}
        onConfirm={async () => {
          await deleteEducation(edu.id);
          window.location.reload();
        }}
      />
    </>
  );
}
