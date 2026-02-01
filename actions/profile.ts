"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function updateProfile(_: any, formData: FormData) {
  const user = await requireUser();

  const pictureUrl = formData.get("pictureUrl")?.toString() || null;

  await prisma.profile.upsert({
    where: { userId: user.id },
    update: {
      name: formData.get("name")?.toString(),
      bio: formData.get("bio")?.toString(),
      companyWebsite: formData.get("companyWebsite")?.toString(),
      companyAddress: formData.get("companyAddress")?.toString(),
      pictureUrl,
    },
    create: {
      userId: user.id,
      name: formData.get("name")?.toString(),
      bio: formData.get("bio")?.toString(),
      companyWebsite: formData.get("companyWebsite")?.toString(),
      companyAddress: formData.get("companyAddress")?.toString(),
      pictureUrl,
    },
  });

  return { success: true };
}
