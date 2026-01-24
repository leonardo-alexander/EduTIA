import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { Gender } from "@prisma/client";

export async function updateProfile(_prevState: any, formData: FormData) {
  try {
    const user = await requireUser();
    const userId = user.id;

    const name = formData.get("name") as string | null;
    const bio = formData.get("bio") as string | null;
    const companyName = formData.get("companyName") as string | null;
    const companyWebsite = formData.get("companyWebsite") as string | null;

    const dobRaw = formData.get("dob");
    let dob: Date | null = null;
    if (typeof dobRaw === "string" && dobRaw) {
      const d = new Date(dobRaw);
      if (!isNaN(d.getTime())) dob = d;
    }

    const genderRaw = formData.get("gender");
    const gender =
      genderRaw === "MALE" || genderRaw === "FEMALE"
        ? (genderRaw as Gender)
        : null;

    let pictureUrl = formData.get("pictureUrl") as string | null;

    if (!pictureUrl) {
      pictureUrl =
        gender === "FEMALE" ? "/avatars/female.svg" : "/avatars/male.svg";
    } else if (gender === "FEMALE" && pictureUrl === "/avatars/male.svg") {
      pictureUrl = "/avatars/female.svg";
    } else if (gender === "MALE" && pictureUrl === "/avatars/female.svg") {
      pictureUrl = "/avatars/male.svg";
    }

    await prisma.profile.upsert({
      where: { userId },
      update: {
        name,
        dob,
        gender,
        bio,
        pictureUrl,
        companyName,
        companyWebsite,
      },
      create: {
        userId,
        name,
        dob,
        gender,
        bio,
        pictureUrl,
        companyName,
        companyWebsite,
      },
    });

    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Something went wrong" };
  }
}
