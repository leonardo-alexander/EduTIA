import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Company Applications | Admin | EduTIA",
  description: "Review and manage company verification requests.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminCompanysPage() {
  const requests = await prisma.companyVerification.findMany({
    include: {
      profile: {
        include: { user: true },
      },
    },
    orderBy: { status: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Company Applications</h1>

      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">User</th>
            <th className="p-3 border-l">Company</th>
            <th className="p-3 border-l">Status</th>
            <th className="p-3 border-l">Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-3">{r.profile.user.email}</td>
              <td className="p-3 border-l">{r.profile.name}</td>
              <td className="p-3 border-l text-center">{r.status}</td>
              <td className="p-3 border-l text-center">
                <Link
                  href={`/admin/companies/${r.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Review
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
