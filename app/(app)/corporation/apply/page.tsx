import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function CompanyApplyPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    include: { verification: true },
  });

  if (!profile) return <p>Create profile first</p>;

  if (profile.verification?.status === "PENDING") {
    return <p>Your application is under review.</p>;
  }

  if (profile.verification?.status === "VERIFIED") {
    return <p>You are already verified.</p>;
  }

  async function apply() {
    "use server";

    if (!profile) return;

    await prisma.companyVerification.upsert({
      where: { profileId: profile.id },
      update: { status: "PENDING" },
      create: {
        profileId: profile.id,
        status: "PENDING",
      },
    });

    redirect("/company/apply");
  }

  return (
    <form action={apply} className="max-w-md space-y-4">
      <h1 className="text-xl font-bold">Apply as Company</h1>

      <p>By applying, your company profile will be reviewed by our admins.</p>

      <button type="submit" className="px-4 py-2 bg-black text-white rounded">
        Submit Application
      </button>
    </form>
  );
}
