import { requireAdminUser } from "@/lib/auth";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminUser();

  return (
    <div className="min-h-screen flex overflow-clip">
      <aside className="w-64 bg-zinc-900 text-white p-6">
        <div className="flex flex-col h-full justify-between">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Admin Panel</h2>

            <nav className="space-y-2">
              <Link href="/admin" className="block hover:underline">
                Dashboard
              </Link>
              <Link href="/admin/courses" className="block hover:underline">
                Courses
              </Link>
              <Link href="/admin/users" className="block hover:underline">
                Users
              </Link>
              <Link href="/admin/companies" className="block hover:underline">
                Company Requests
              </Link>
            </nav>
          </div>

          <Link
            href="/"
            className="block hover:underline text-sm text-gray-300"
          >
            Back to client side
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  );
}
