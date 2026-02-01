"use client";

import { Certificate } from "@prisma/client";

export default function PrintButton({
  certificate,
}: {
  certificate: Certificate;
}) {
  return (
    <div className="flex gap-4 print:hidden">
      <a
        href={certificate.fileUrl}
        download
        className="px-6 py-3 bg-eduBlue text-white rounded-lg font-semibold"
      >
        Download Certificate
      </a>

      <button
        onClick={() => window.print()}
        className="px-6 py-3 border border-slate-300 rounded-lg"
      >
        Print
      </button>
    </div>
  );
}
