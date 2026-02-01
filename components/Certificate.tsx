import React from "react";

interface CertificateProps {
  userName: string;
  courseTitle: string;
  completionDate: Date;
  certificateId?: string;
}

export default function CertificateComponent({
  userName,
  courseTitle,
  completionDate,
  certificateId,
}: CertificateProps) {
  return (
    <div className="max-w-5xl mx-auto print:max-w-full">
      <div className="bg-white p-4 rounded-xl shadow-xl print:shadow-none">
        <div className="relative border-14 border-double border-eduBlue/20 p-12 md:p-16 bg-[#fafafa] text-center overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-120 h-120 rounded-full bg-eduBlue/5 blur-3xl" />
          </div>

          <div className="relative z-10 mb-12">
            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-wide uppercase text-slate-900">
              Certificate
            </h1>
            <p className="mt-2 text-xl tracking-[0.25em] uppercase text-slate-500">
              of Completion
            </p>
          </div>

          <div className="relative z-10 space-y-10">
            <div>
              <p className="text-lg italic text-slate-500">
                This certifies that
              </p>

              <h2 className="mt-3 text-3xl md:text-5xl font-serif font-bold text-eduBlue border-b-2 border-slate-200 inline-block px-10 pb-3">
                {userName}
              </h2>
            </div>

            <div>
              <p className="text-lg italic text-slate-500">
                has successfully completed the course
              </p>

              <h3 className="mt-3 text-2xl md:text-4xl font-bold text-slate-800 font-serif">
                {courseTitle}
              </h3>
            </div>
          </div>

          <div className="relative z-10 mt-20 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="text-center">
              <p className="text-xl font-serif font-semibold">
                {completionDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-xs uppercase tracking-wider text-slate-400">
                Date Issued
              </p>
            </div>

            {certificateId && (
              <div className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full border-4 border-eduBlue/30 flex items-center justify-center bg-white shadow">
                  <span className="text-2xl">🎓</span>
                </div>
                <p className="mt-2 text-xs font-mono text-slate-400">
                  ID: {certificateId}
                </p>
              </div>
            )}

            <div className="text-center">
              <img
                src="/logo/blue.svg"
                alt="Organization Logo"
                className="h-12 mx-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
