"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  CompanyVerification,
  Education,
  Experience,
  Profile,
  Skill,
  User,
} from "@prisma/client";
import ProfileView from "./ProfileView";
import ProfileForm from "./ProfileForm";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type ProfileContainerProps = {
  user: User;
  profile: Profile | null;
  skills: Skill[];
  educations: Education[];
  experiences: Experience[];
  verification: CompanyVerification | null;
  totalEnrollments: number;
  completedEnrollments: number;
  totalJobApplications: number;
};

export default function ProfileContainer({
  user,
  profile,
  skills,
  educations,
  experiences,
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
      skills={skills}
      educations={educations}
      experiences={experiences}
      verification={verification}
      totalEnrollments={totalEnrollments}
      completedEnrollments={completedEnrollments}
      totalJobApplications={totalJobApplications}
      onEdit={() => setIsEditing(true)}
      onIncompleteProfile={handleIncompleteProfile}
    />
  );
}
