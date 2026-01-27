"use server";

import { prisma } from "@/lib/prisma";

export async function verifyCompany(_prevState: any, formData: FormData) {
  try {
    const userId = formData.get("userId") as string;
    const profile = await prisma.profile.findFirst({
      where: { userId },
    });

    if (
      !profile ||
      !profile.name ||
      !profile.companyAddress ||
      !profile.companyWebsite
    ) {
      return { incomplete: true };
    }

    await prisma.companyVerification.upsert({
      where: { profileId: profile.id },
      update: {
        status: "PENDING",
      },
      create: {
        profileId: profile.id,
      },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong" };
  }
}
