import { prisma } from "@/lib/prisma";

export default async function AdminCorporationsPage() {
  const requests = await prisma.corporationVerification.findMany({
    include: {
      profile: {
        include: { user: true },
      },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Corporation Applications</h1>

      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">User</th>
            <th>Company</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-3">{r.profile.user.email}</td>
              <td>{r.profile.companyName}</td>
              <td>{r.status}</td>
              <td>
                <a
                  href={`/admin/corporations/${r.id}`}
                  className="text-blue-600"
                >
                  Review
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
