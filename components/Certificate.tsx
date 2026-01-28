import React from "react";

interface CertificateProps {
  userName: string;
  courseTitle: string;
  completionDate: Date;
  certificateId?: string;
}

export default function Certificate({
  userName,
  courseTitle,
  completionDate,
  certificateId,
}: CertificateProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white p-2 rounded-xl shadow-lg print:shadow-none print:w-full">
        <div className="border-[12px] border-double border-eduBlue/20 p-8 md:p-16 text-center relative overflow-hidden bg-[#fafafa]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-eduBlue/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4 mb-12">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 tracking-wider uppercase">
              Certificate
            </h1>
            <p className="text-xl md:text-2xl font-serif text-slate-500 uppercase tracking-[0.2em]">
              of Completion
            </p>
          </div>

          <div className="relative z-10 space-y-8">
            <div className="space-y-4">
              <p className="text-slate-500 text-lg font-medium italic">
                This certifies that
              </p>
              <h2 className="text-3xl md:text-5xl font-bold text-eduBlue font-serif border-b-2 border-slate-200 inline-block px-12 pb-4">
                {userName}
              </h2>
            </div>

            <div className="space-y-4 py-4">
              <p className="text-slate-500 text-lg font-medium italic">
                Has successfully completed the course
              </p>
              <h3 className="text-2xl md:text-4xl font-bold text-slate-800 font-serif">
                {courseTitle}
              </h3>
            </div>
          </div>

          <div className="relative z-10 mt-20 pt-8 flex flex-col md:flex-row justify-between items-end md:items-center gap-10 text-slate-600">
            <div className="text-center">
              <div className="px-8 py-2">
                <p className="text-2xl font-serif font-bold text-slate-800">
                  {completionDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <p className="text-xs uppercase tracking-wider text-slate-400">
                Date Issued
              </p>
            </div>

            {certificateId && (
              <div className="order-first md:order-none">
                <div className="w-24 h-24 mx-auto border-4 border-eduBlue/20 rounded-full flex items-center justify-center bg-white shadow-sm">
                  <div className="text-center">
                    <span className="block text-2xl">🎓</span>
                  </div>
                </div>
                <p className="mt-2 font-mono text-xs text-slate-400">
                  ID: {certificateId}
                </p>
              </div>
            )}

            <div className="text-center">
              <div className="px-8 py-2 flex items-center justify-center">
                <img 
                  src="/logo/blue.svg" 
                  alt="Organization Logo" 
                  className="h-12 w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}