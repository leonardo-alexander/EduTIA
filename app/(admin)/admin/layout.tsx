import { requireAdminUser } from "@/lib/auth";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminUser();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 text-white p-6 space-y-4">
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
          <Link href="/admin/corporations" className="block hover:underline">
            Corporation Requests
          </Link>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  );
}
