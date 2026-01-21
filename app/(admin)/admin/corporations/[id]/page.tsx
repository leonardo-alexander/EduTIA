import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ReviewCorp({
  params,
}: {
  params: { id: string };
}) {
  const data = await prisma.corporationVerification.findUnique({
    where: { id: params.id },
    include: {
      profile: {
        include: { user: true },
      },
    },
  });

  if (!data) return <p>Not found</p>;

  async function approve() {
    "use server";

    if (!data) return;

    await prisma.$transaction([
      prisma.corporationVerification.update({
        where: { id: data.id },
        data: {
          status: "VERIFIED",
          verifiedAt: new Date(),
        },
      }),
      prisma.user.update({
        where: { id: data.profile.userId },
        data: { role: "CORPORATION" },
      }),
      prisma.adminAction.create({
        data: {
          userId: data.profile.userId,
          actionType: "VERIFY_CORPORATION",
        },
      }),
    ]);

    redirect("/admin/corporations");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Corporation Review</h1>

      <p>
        <b>Email:</b> {data.profile.user.email}
      </p>
      <p>
        <b>Company:</b> {data.profile.companyName}
      </p>
      <p>
        <b>Status:</b> {data.status}
      </p>

      <form action={approve}>
        <button className="px-4 py-2 bg-green-600 text-white rounded">
          Approve
        </button>
      </form>
    </div>
  );
}
