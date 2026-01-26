"use client";

import { Profile, User } from "@prisma/client";
import {
  User as UserIcon,
  Calendar,
  Users,
  Building2,
  Globe,
  Pencil,
  Mail,
  FileText,
  CaseSensitive,
} from "lucide-react";

type ProfileViewProps = {
  profile: Profile | null;
  user: User;
  onEdit: () => void;
};

export default function ProfileView({
  profile,
  user,
  onEdit,
}: ProfileViewProps) {
  const websiteUrl = profile?.companyWebsite
    ? profile.companyWebsite.startsWith("http")
      ? profile.companyWebsite
      : `https://${profile.companyWebsite}`
    : "#";

  const displayName = profile?.name || user.email.split("@")[0] || "User";

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatGender = (gender: string | null | undefined) => {
    if (!gender) return null;
    return gender.charAt(0) + gender.slice(1).toLowerCase();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50/30">
      <div className="bg-eduBlue">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src={profile?.pictureUrl || "/avatars/male.svg"}
              alt="Avatar"
              className="h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover bg-white"
            />

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {displayName}
              </h1>
              <div className="mt-1.5 flex items-center justify-center sm:justify-start gap-2 text-white/80">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{user.email}</span>
              </div>
            </div>

            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-eduBlue font-semibold rounded-full shadow-md hover:shadow-2xl transition-all duration-200"
            >
              <Pencil className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {(() => {
            switch (user.role) {
              case "COMPANY":
                return (
                  <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="px-6 py-5 bg-linear-to-r from-slate-50 to-white border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-xl">
                          <Building2 className="w-5 h-5 text-indigo-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900">
                          Company
                        </h2>
                      </div>
                    </div>
                    <div className="p-6 space-y-5 flex-1 flex flex-col">
                      {profile?.companyName || profile?.companyWebsite ? (
                        <>
                          <DetailItem
                            icon={<Building2 className="w-4 h-4" />}
                            label="Company Name"
                            value={profile?.companyName}
                            iconBg="bg-orange-50"
                            iconColor="text-orange-600"
                          />
                          <DetailItem
                            icon={<Globe className="w-4 h-4" />}
                            label="Website"
                            value={
                              profile?.companyWebsite ? (
                                <a
                                  href={websiteUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-eduBlue hover:text-blue-700 transition-colors"
                                >
                                  {profile.companyWebsite}
                                  <svg
                                    className="w-3 h-3 opacity-60"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                  </svg>
                                </a>
                              ) : null
                            }
                            iconBg="bg-cyan-50"
                            iconColor="text-cyan-600"
                          />
                        </>
                      ) : (
                        <div className="flex-1 flex items-center justify-center">
                          <div className="text-center py-6">
                            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
                              <Building2 className="w-6 h-6 text-slate-400" />
                            </div>
                            <p className="text-sm text-slate-500">
                              No company info added yet
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );

              default:
                return (
                  <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="px-6 py-5 bg-linear-to-r from-slate-50 to-white border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-xl">
                          <UserIcon className="w-5 h-5 text-indigo-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900">
                          Personal Information
                        </h2>
                      </div>
                    </div>
                    <div className="sm:grid sm:grid-cols-2">
                      <div className="pb-5 p-6 sm:pb-6 space-y-5 flex-1 flex flex-col">
                        <DetailItem
                          icon={<CaseSensitive className="w-4 h-4" />}
                          label="Full Name"
                          value={profile?.name}
                          iconBg="bg-blue-50"
                          iconColor="text-blue-600"
                        />
                        <DetailItem
                          icon={<Calendar className="w-4 h-4" />}
                          label="Date of Birth"
                          value={formatDate(profile?.dob)}
                          iconBg="bg-purple-50"
                          iconColor="text-purple-600"
                        />
                        <DetailItem
                          icon={<Users className="w-4 h-4" />}
                          label="Gender"
                          value={formatGender(profile?.gender)}
                          iconBg="bg-emerald-50"
                          iconColor="text-emerald-600"
                        />
                        <DetailItem
                          icon={<Mail className="w-4 h-4" />}
                          label="Email"
                          value={user.email}
                          iconBg="bg-rose-50"
                          iconColor="text-rose-600"
                        />
                      </div>
                      <div className="pt-0 p-6 sm:pt-6 space-y-5 flex-1 flex flex-col">
                        <DetailItem
                          icon={<CaseSensitive className="w-4 h-4" />}
                          label="Enrollments"
                          value={profile?.name}
                          iconBg="bg-blue-50"
                          iconColor="text-blue-600"
                        />
                        <DetailItem
                          icon={<Calendar className="w-4 h-4" />}
                          label="Certificates"
                          value={formatDate(profile?.dob)}
                          iconBg="bg-purple-50"
                          iconColor="text-purple-600"
                        />
                        <DetailItem
                          icon={<Users className="w-4 h-4" />}
                          label="Jobs applications"
                          value={formatGender(profile?.gender)}
                          iconBg="bg-emerald-50"
                          iconColor="text-emerald-600"
                        />
                      </div>
                    </div>
                  </div>
                );
            }
          })()}

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="px-6 py-5 bg-linear-to-r from-slate-50 to-white border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-xl">
                  <FileText className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">
                  About Me
                </h2>
              </div>
            </div>
            <div className="p-6">
              {profile?.bio ? (
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {profile.bio}
                </p>
              ) : (
                <p className="text-slate-400 italic">No bio added yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
  iconBg,
  iconColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode | null | undefined;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className={`p-2 rounded-lg ${iconBg} ${iconColor} shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {label}
        </p>
        <div className="text-slate-900 mt-0.5 wrap-break-words">
          {value || <span className="text-slate-400">Not provided</span>}
        </div>
      </div>
    </div>
  );
}
