"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Profile, User } from "@prisma/client";
import {
  User as UserIcon,
  Calendar,
  Users,
  FileText,
  Building2,
  Globe,
  Image,
  X,
  Save,
  Loader2,
} from "lucide-react";
import { updateProfile } from "@/actions/profile";

type ProfileFormProps = {
  profile: Profile | null;
  user: User;
  onCancel: () => void;
};

export default function ProfileForm({
  profile,
  user,
  onCancel,
}: ProfileFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(updateProfile, null);

  return (
    <form
      action={formAction}
      className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50/30"
    >
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
                Edit Profile
              </h1>
              <p className="mt-1 text-white/70 text-sm">
                Update your{" "}
                {user.role === "CORPORATION"
                  ? "company details"
                  : "personal information"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white font-medium rounded-full border border-white/20 shadow-md hover:shadow-2xl transition-all duration-200"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-eduBlue font-semibold rounded-full shadow-md hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md transition-all duration-200"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {(() => {
            switch (user.role) {
              case "CORPORATION":
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
                      <FormField
                        icon={<Building2 className="w-4 h-4" />}
                        label="Company Name"
                        iconBg="bg-orange-50"
                        iconColor="text-orange-600"
                      >
                        <input
                          type="text"
                          name="companyName"
                          placeholder="Your company name"
                          className="form-input"
                        />
                      </FormField>

                      <FormField
                        icon={<Globe className="w-4 h-4" />}
                        label="Company Website"
                        iconBg="bg-cyan-50"
                        iconColor="text-cyan-600"
                      >
                        <input
                          type="text"
                          name="companyWebsite"
                          placeholder="https://company.com"
                          className="form-input"
                        />
                      </FormField>
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
                    <div className="p-6 space-y-5">
                      <FormField
                        icon={<Image className="w-4 h-4" />}
                        label="Profile Picture URL"
                        iconBg="bg-violet-50"
                        iconColor="text-violet-600"
                      >
                        <input
                          type="text"
                          name="pictureUrl"
                          placeholder="https://example.com/your-photo.jpg"
                          className="form-input"
                        />
                      </FormField>

                      <FormField
                        icon={<UserIcon className="w-4 h-4" />}
                        label="Full Name"
                        iconBg="bg-blue-50"
                        iconColor="text-blue-600"
                      >
                        <input
                          type="text"
                          name="name"
                          placeholder="Enter your full name"
                          className="form-input"
                        />
                      </FormField>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <FormField
                          icon={<Calendar className="w-4 h-4" />}
                          label="Date of Birth"
                          iconBg="bg-purple-50"
                          iconColor="text-purple-600"
                        >
                          <input
                            type="date"
                            name="dob"
                            className="form-input"
                          />
                        </FormField>

                        <FormField
                          icon={<Users className="w-4 h-4" />}
                          label="Gender"
                          iconBg="bg-emerald-50"
                          iconColor="text-emerald-600"
                        >
                          <select name="gender" className="form-input">
                            <option value="">Select Gender</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                          </select>
                        </FormField>
                      </div>
                    </div>
                  </div>
                );
            }
          })()}

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
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
              <textarea
                name="bio"
                rows={4}
                placeholder="Tell us a bit about yourself..."
                className="form-input resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
          background-color: #f8fafc;
          font-size: 0.875rem;
          color: #1e293b;
          transition: all 0.2s;
        }
        .form-input:focus {
          outline: none;
          border-color: #2269e9;
          background-color: white;
          box-shadow: 0 0 0 3px rgba(34, 105, 233, 0.1);
        }
        .form-input::placeholder {
          color: #94a3b8;
        }
      `}</style>
    </form>
  );
}

function FormField({
  icon,
  label,
  iconBg,
  iconColor,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  iconBg: string;
  iconColor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
        <span className={`p-1.5 rounded-lg ${iconBg} ${iconColor}`}>
          {icon}
        </span>
        {label}
      </label>
      {children}
    </div>
  );
}
