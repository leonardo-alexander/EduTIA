import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Admin Users | EduTIA",
    description: "Manage and review platform users.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: {
      profile: true,
      _count: {
        select: { enrollments: true },
      },
    },
    orderBy: [
      { role: "desc" },
      {
        profile: {
          name: "asc",
        },
      },
    ],
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Email</th>
            <th className="p-3 border-l">Role</th>
            <th className="p-3 border-l">Enrollments</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="p-3">{u.email}</td>
              <td className="p-3 border-l">{u.role}</td>
              <td className="p-3 border-l text-center">
                {u._count.enrollments}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
