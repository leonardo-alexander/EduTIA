"use client";

import { useEffect, useMemo, useState } from "react";
import { Profile, User } from "@prisma/client";
import ProfileView from "./ProfileView";
import ProfileForm from "./ProfileForm";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type ProfileContainerProps = {
  user: User;
  profile: Profile | null;
};

export default function ProfileContainer({
  user,
  profile,
}: ProfileContainerProps) {
  const [isEditing, setIsEditing] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isEditParam = useMemo(
    () => searchParams.get("edit") === "true",
    [searchParams],
  );

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
      onEdit={() => setIsEditing(true)}
    />
  );
}
