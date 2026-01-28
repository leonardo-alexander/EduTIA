"use server";

import { requireAdminUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function verifyCorp(formData: FormData) {
  const user = await requireAdminUser();
  const id = formData.get("id") as string;

  const data = await prisma.companyVerification.findUnique({
    where: { id },
    include: {
      profile: { include: { user: true } },
    },
  });

  if (!data) return;

  await prisma.$transaction([
    prisma.companyVerification.update({
      where: { id },
      data: {
        status: "VERIFIED",
        verifiedAt: new Date(),
        verifiedBy: user.id,
      },
    }),
    prisma.user.update({
      where: { id: data.profile.userId },
      data: { role: "COMPANY" },
    }),
  ]);

  revalidatePath(`/admin/companies/${id}`);
  redirect(`/admin/companies/${id}`);
}

export async function unverifyCorp(formData: FormData) {
  await requireAdminUser();
  const id = formData.get("id") as string;

  const data = await prisma.companyVerification.findUnique({
    where: { id },
    include: {
      profile: { include: { user: true } },
    },
  });

  if (!data) return;

  await prisma.$transaction([
    prisma.companyVerification.update({
      where: { id },
      data: {
        status: "UNVERIFIED",
        verifiedAt: null,
      },
    }),
    prisma.user.update({
      where: { id: data.profile.userId },
      data: { role: "COMPANY" },
    }),
  ]);

  revalidatePath(`/admin/companies/${id}`);
  redirect(`/admin/companies/${id}`);
}
