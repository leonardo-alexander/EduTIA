"use client";

import { useState, useActionState, useEffect } from "react";
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
  CaseSensitive,
  MapPinned,
} from "lucide-react";
import { updateProfile } from "@/actions/profile";
import { useRouter } from "next/navigation";

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
  const [isFinishing, setIsFinishing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const loading = isPending || isFinishing;

  useEffect(() => {
    if (!state?.success) return;

    setIsFinishing(true);

    const t = setTimeout(() => {
      router.refresh();
      onCancel();
    }, 600);

    return () => clearTimeout(t);
  }, [state, router, onCancel]);

  const MAX_FILE_SIZE = 1 * 1024 * 1024;

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFileError("Only images allowed");
      return;
    }

    if (file.size > 1024 * 1024) {
      setFileError("Image must be under 1MB");
      return;
    }

    setFileError(null);

    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/upload/avatar", {
      method: "POST",
      body: form,
    });

    const data = await res.json();

    if (!res.ok) {
      setFileError(data.error || "Upload failed");
      return;
    }

    setPreview(data.url);
  };

  return (
    <form
      action={formAction}
      className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50/30"
    >
      <div className="bg-eduBlue">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex flex-col items-center gap-3">
              <label className="relative cursor-pointer group">
                <img
                  src={preview || profile?.pictureUrl || "/avatars/male.svg"}
                  alt="Avatar"
                  className="h-28 w-28 rounded-full object-cover bg-white group-hover:opacity-80 transition"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-sm font-medium opacity-100 transition rounded-full">
                  Change
                </div>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleAvatarChange}
                />

                <input type="hidden" name="pictureUrl" value={preview ?? ""} />
              </label>

              {fileError && (
                <p className="text-sm text-red-500 mt-2">{fileError}</p>
              )}

              <p className="text-xs text-white">JPG / PNG · Max 1MB</p>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Edit Profile
              </h1>
              <p className="mt-1 text-white/70 text-sm">
                Update your{" "}
                {user.role === "COMPANY"
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
                disabled={loading || !!fileError}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all ${
                  loading || fileError
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-white text-eduBlue hover:shadow-2xl"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
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
                      <FormField
                        icon={<CaseSensitive className="w-4 h-4" />}
                        label="Company Name"
                        iconBg="bg-blue-50"
                        iconColor="text-blue-600"
                      >
                        <input
                          type="text"
                          name="name"
                          defaultValue={profile?.name ?? ""}
                          placeholder="Your company name"
                          className="form-input"
                        />
                      </FormField>

                      <FormField
                        icon={<MapPinned className="w-4 h-4" />}
                        label="Company Address"
                        iconBg="bg-purple-50"
                        iconColor="text-purple-600"
                      >
                        <input
                          type="text"
                          name="companyAddress"
                          defaultValue={profile?.companyAddress ?? ""}
                          placeholder="Your company address"
                          className="form-input"
                        />
                      </FormField>

                      <FormField
                        icon={<Globe className="w-4 h-4" />}
                        label="Company Website"
                        iconBg="bg-emerald-50"
                        iconColor="text-emerald-600"
                      >
                        <input
                          type="text"
                          name="companyWebsite"
                          defaultValue={profile?.companyWebsite ?? ""}
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
                        icon={<UserIcon className="w-4 h-4" />}
                        label="Full Name"
                        iconBg="bg-blue-50"
                        iconColor="text-blue-600"
                      >
                        <input
                          type="text"
                          name="name"
                          defaultValue={profile?.name ?? ""}
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
                            defaultValue={
                              profile?.dob
                                ? new Date(profile.dob)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                            className="form-input"
                          />
                        </FormField>

                        <FormField
                          icon={<Users className="w-4 h-4" />}
                          label="Gender"
                          iconBg="bg-emerald-50"
                          iconColor="text-emerald-600"
                        >
                          <select
                            name="gender"
                            defaultValue={profile?.gender ?? ""}
                            className="form-input"
                          >
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
                defaultValue={profile?.bio ?? ""}
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
