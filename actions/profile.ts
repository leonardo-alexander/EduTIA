"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { Gender } from "@prisma/client";

export async function updateProfile(_: any, formData: FormData) {
  const user = await requireUser();

  const rawGender = formData.get("gender")?.toString();
  const providedPictureUrl = formData.get("pictureUrl")?.toString();

  const gender: Gender | null =
    rawGender === "MALE"
      ? Gender.MALE
      : rawGender === "FEMALE"
        ? Gender.FEMALE
        : null;

  const dob = formData.get("dob")
    ? new Date(formData.get("dob") as string)
    : null;

  const existingProfile = await prisma.profile.findUnique({
    where: { userId: user.id },
    select: { pictureUrl: true },
  });

  let pictureUrl = existingProfile?.pictureUrl ?? null;

  if (providedPictureUrl) {
    pictureUrl = providedPictureUrl;
  }

  if (!pictureUrl) {
    pictureUrl =
      gender === Gender.FEMALE
        ? "/avatars/female.svg"
        : gender === Gender.MALE
          ? "/avatars/male.svg"
          : null;
  }

  const profileData = {
    name: formData.get("name")?.toString(),
    bio: formData.get("bio")?.toString(),
    companyWebsite: formData.get("companyWebsite")?.toString(),
    companyAddress: formData.get("companyAddress")?.toString(),
    gender,
    dob,
    pictureUrl,
  };

  await prisma.profile.upsert({
    where: { userId: user.id },
    update: profileData,
    create: {
      userId: user.id,
      ...profileData,
    },
  });

  return { success: true };
}
