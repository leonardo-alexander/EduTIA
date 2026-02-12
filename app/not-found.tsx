export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-eduBlue mb-4">404</h1>
        <p className="text-slate-600 mb-6">
          The page you’re looking for doesn’t exist.
        </p>
        <a
          href="/"
          className="px-6 py-3 bg-eduBlue text-white rounded-lg font-medium"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}
