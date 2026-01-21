import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: {
      profile: true,
      _count: {
        select: { enrollments: true },
      },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Email</th>
            <th>Role</th>
            <th>Enrollments</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="p-3">{u.email}</td>
              <td>{u.role}</td>
              <td>{u._count.enrollments}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
