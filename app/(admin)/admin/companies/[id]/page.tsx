import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { verifyCorp, unverifyCorp } from "@/actions/corpAdmin";

export default async function ReviewCorp({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await prisma.companyVerification.findUnique({
    where: { id },
    include: {
      profile: {
        include: { user: true },
      },
    },
  });

  if (!data) return <p>Not found</p>;

  return (
    <div className="space-y-4">
      <Link href={"/admin/companies"} className="flex items-center gap-1">
        <ArrowLeft className="h-5 w-5" />
        <span className="leading-none">Back to companies</span>
      </Link>
      <h1 className="text-xl font-bold">Company Review</h1>

      <p>
        <b>Email:</b> {data.profile.user.email}
      </p>
      <p>
        <b>Company:</b> {data.profile.name}
      </p>
      <p>
        <b>Status:</b> {data.status}
      </p>
      {(() => {
        switch (data.status) {
          case "PENDING":
            return (
              <form action={verifyCorp}>
                <input type="hidden" name="id" value={id} />
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Verify
                </button>
              </form>
            );

          case "VERIFIED":
            return (
              <form action={unverifyCorp}>
                <input type="hidden" name="id" value={id} />
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Unverify
                </button>
              </form>
            );

          default:
            return null;
        }
      })()}
    </div>
  );
}
