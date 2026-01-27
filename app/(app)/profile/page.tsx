import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import ProfileContainer from "@/components/profile/ProfileContainer";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const userData = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    include: {
      profile: {
        include: {
          verification: true,
        },
      },
      _count: {
        select: {
          enrollments: true,
          jobApplications: true,
        },
      },
      enrollments: {
        where: {
          progressPercent: 100,
        },
        select: {
          id: true,
        },
      },
    },
  });

  if (!userData) {
    redirect("/login");
  }

  return (
    <ProfileContainer
      user={userData}
      profile={userData.profile}
      verification={userData.profile?.verification ?? null}
      totalEnrollments={userData?._count.enrollments ?? 0}
      completedEnrollments={userData?.enrollments.length ?? 0}
      totalJobApplications={userData?._count.jobApplications ?? 0}
    />
  );
}
