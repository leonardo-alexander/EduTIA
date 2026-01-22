"use client";

import { useState } from "react";
import { Profile, User } from "@prisma/client";
import ProfileView from "./ProfileView";
import ProfileForm from "./ProfileForm";

type ProfileContainerProps = {
  user: User;
  profile: Profile | null;
};

export default function ProfileContainer({ user, profile }: ProfileContainerProps) {
  const [isEditing, setIsEditing] = useState(false);

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