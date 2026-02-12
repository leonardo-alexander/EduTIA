export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-white via-slate-50 to-blue-50">
      <div className="flex flex-col items-center gap-8">
        <div className="text-2xl font-bold text-eduBlue tracking-tight">
          EduTIA
        </div>

        <div className="w-10 h-10 border-4 border-eduBlue border-t-transparent rounded-full animate-spin"></div>

        <p className="text-slate-500 text-sm">Preparing your experience...</p>
      </div>
    </div>
  );
}
