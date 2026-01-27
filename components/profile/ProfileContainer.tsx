"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { CompanyVerification, Profile, User } from "@prisma/client";
import ProfileView from "./ProfileView";
import ProfileForm from "./ProfileForm";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type ProfileContainerProps = {
  user: User;
  profile: Profile | null;
  verification: CompanyVerification | null;
  totalEnrollments: number;
  completedEnrollments: number;
  totalJobApplications: number;
};

export default function ProfileContainer({
  user,
  profile,
  verification,
  totalEnrollments,
  completedEnrollments,
  totalJobApplications,
}: ProfileContainerProps) {
  const [isEditing, setIsEditing] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isEditParam = useMemo(
    () => searchParams.get("edit") === "true",
    [searchParams],
  );

  const handleIncompleteProfile = useCallback(() => {
    setIsEditing(true);
  }, []);

  useEffect(() => {
    if (isEditParam) {
      setIsEditing(true);
      router.replace(pathname);
    }
  }, [isEditParam, router, pathname]);

  if (isEditing) {
    return (
      <ProfileForm
        user={user}
        profile={profile}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <ProfileView
      user={user}
      profile={profile}
      verification={verification}
      totalEnrollments={totalEnrollments}
      completedEnrollments={completedEnrollments}
      totalJobApplications={totalJobApplications}
      onEdit={() => setIsEditing(true)}
      onIncompleteProfile={handleIncompleteProfile}
    />
  );
}
