"use client";

import { verifyCompany } from "@/actions/verify";
import {
  CompanyVerification,
  Profile,
  User,
  Skill,
  Experience,
  Education,
} from "@prisma/client";
import { useEffect, useActionState, useState } from "react";
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
  HeartHandshake,
  TicketCheck,
  FileUser,
  MapPinned,
  ChartArea,
  Rss,
  ListCheck,
  IdCard,
  Briefcase,
  Trash2,
} from "lucide-react";
import AddSkillPopover from "../AddSkillsPopover";
import {
  addSkill,
  addExperience,
  deleteSkill,
  addEducation,
} from "@/actions/moreProfile";
import AddExperiencePopover from "../AddExperiencesPopover";
import ExperienceActions from "./ExperienceAction";
import EditSkillPopover from "./EditSkillPopover";
import ConfirmDialog from "../ui/ConfirmDialog";
import { generateUserCV } from "@/actions/generateCV";
import AddEducationsPopover from "../AddEducationsPopover";
import EducationActions from "./EducationAction";

type ProfileViewProps = {
  profile: Profile | null;
  user: User;
  verification: CompanyVerification | null;
  totalEnrollments: number;
  completedEnrollments: number;
  totalJobApplications: number;
  skills: Skill[];
  educations: Education[];
  experiences: Experience[];
  onEdit: () => void;
  onIncompleteProfile: () => void;
};

export default function ProfileView({
  profile,
  user,
  verification,
  totalEnrollments,
  completedEnrollments,
  totalJobApplications,
  skills,
  educations,
  experiences,
  onEdit,
  onIncompleteProfile,
}: ProfileViewProps) {
  const [state, formAction, isPending] = useActionState(verifyCompany, null);
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);
  const [skillToEdit, setSkillToEdit] = useState<Skill | null>(null);
  const [isGeneratingCV, setIsGeneratingCV] = useState(false);

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

  const formatRole = (role: string) => {
    return role.charAt(0) + role.slice(1).toLowerCase();
  };

  const isEduProfileComplete =
    !!profile?.name && !!profile?.dob && !!profile?.gender;

  const isCompProfileComplete =
    !!profile?.name && !!profile?.companyAddress && !!profile?.companyWebsite;

  useEffect(() => {
    if (state?.success) {
      window.location.reload();
    }

    if (state?.incomplete) {
      onIncompleteProfile();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state, onIncompleteProfile]);

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
                <IdCard className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {formatRole(user.role)}
                </span>
              </div>
            </div>

            {user.role === "COMPANY" &&
              (!verification || verification.status === "UNVERIFIED") && (
                <form action={formAction}>
                  <input type="hidden" name="userId" value={user.id} />
                  <button
                    type="submit"
                    disabled={!isCompProfileComplete || isPending}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold shadow-md hover:shadow-2xl transition-all duration-200 ${
                      isCompProfileComplete && !isPending
                        ? "bg-white text-eduBlue"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isPending ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-eduBlue"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          />
                        </svg>
                        Verifying...
                      </>
                    ) : (
                      "Verify Company"
                    )}
                  </button>
                </form>
              )}
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

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {user.role === "COMPANY" && !isCompProfileComplete && (
          <div className="mb-8 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800">
            <strong>Profile incomplete.</strong>
            <p className="mt-1">
              Please complete your company name, address, and website before
              requesting verification.
            </p>
          </div>
        )}

        {user.role === "EDUCATEE" && !isEduProfileComplete && (
          <div className="mb-8 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800">
            <strong>Profile incomplete.</strong>
            <p className="mt-1">
              Please complete your name, gender, and date of birth before
              getting certificate, generating CV, or applying job.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-stretch">
          <div className="lg:col-span-3 flex flex-col gap-8 h-full">
            {(() => {
              switch (user.role) {
                case "COMPANY":
                  return (
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="px-6 py-4 bg-linear-to-r from-slate-50 to-white border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-50 rounded-xl">
                            <Building2 className="w-5 h-5 text-indigo-600" />
                          </div>
                          <h2 className="text-lg font-semibold text-slate-900">
                            Company Information
                          </h2>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                          <DetailItem
                            icon={<CaseSensitive className="w-4 h-4" />}
                            label="Company Name"
                            value={profile?.name}
                            iconBg="bg-blue-50"
                            iconColor="text-blue-600"
                          />
                          <DetailItem
                            icon={<ChartArea className="w-4 h-4" />}
                            label="Company Status"
                            value={verification?.status ?? "UNVERIFIED"}
                            iconBg="bg-yellow-50"
                            iconColor="text-yellow-600"
                          />
                          <DetailItem
                            icon={<MapPinned className="w-4 h-4" />}
                            label="Company Address"
                            value={profile?.companyAddress}
                            iconBg="bg-purple-50"
                            iconColor="text-purple-600"
                          />
                          <DetailItem
                            icon={<Globe className="w-4 h-4" />}
                            label="Company Website"
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
                      </div>
                    </div>
                  );

                default:
                  return (
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="px-6 py-4 bg-linear-to-r from-slate-50 to-white border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-50 rounded-xl">
                            <UserIcon className="w-5 h-5 text-indigo-600" />
                          </div>
                          <h2 className="text-lg font-semibold text-slate-900">
                            Personal Information
                          </h2>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                          <DetailItem
                            icon={<CaseSensitive className="w-4 h-4" />}
                            label="Full Name"
                            value={profile?.name || null}
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
                      </div>
                    </div>
                  );
              }
            })()}

            <div className="flex flex-col flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 bg-linear-to-r from-slate-50 to-white border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 rounded-xl">
                    <FileText className="w-5 h-5 text-amber-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    About Me
                  </h2>
                </div>
              </div>
              <div className="p-6 flex-1">
                {profile?.bio ? (
                  <p className="text-slate-600 text-base leading-relaxed whitespace-pre-wrap">
                    {profile.bio}
                  </p>
                ) : (
                  <p className="text-slate-400 italic text-base">
                    No bio added yet
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 flex flex-col h-full justify-between gap-6">
            {user.role === "COMPANY" ? (
              <div className="contents">
                <StatCard
                  label="Job Postings"
                  value={profile?.totalJobs}
                  icon={<Rss className="w-5 h-5" />}
                  iconBg="bg-orange-50"
                  iconColor="text-orange-600"
                />
                <StatCard
                  label="Hired Educatee"
                  value={profile?.totalHired}
                  icon={<ListCheck className="w-5 h-5" />}
                  iconBg="bg-cyan-50"
                  iconColor="text-cyan-600"
                />
              </div>
            ) : (
              <>
                <StatCard
                  label="Enrollments"
                  value={totalEnrollments}
                  icon={<HeartHandshake className="w-5 h-5" />}
                  iconBg="bg-yellow-50"
                  iconColor="text-yellow-600"
                />
                <StatCard
                  label="Certificates"
                  value={completedEnrollments}
                  icon={<TicketCheck className="w-5 h-5" />}
                  iconBg="bg-orange-50"
                  iconColor="text-orange-600"
                />
                <StatCard
                  label="Job Applications"
                  value={totalJobApplications}
                  icon={<FileUser className="w-5 h-5" />}
                  iconBg="bg-cyan-50"
                  iconColor="text-cyan-600"
                />
              </>
            )}
          </div>
        </div>

        {user.role === "EDUCATEE" && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 rounded-xl">
                    <ListCheck className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-lg font-semibold">Skills</h2>
                </div>

                <AddSkillPopover
                  onAdd={async (name) => {
                    await addSkill(name, user.id);
                    window.location.reload();
                  }}
                />
              </div>

              <div className="p-6">
                {skills.length ? (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <div
                        key={skill.id}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50"
                      >
                        <span className="text-sm font-medium text-blue-700">
                          {skill.name}
                        </span>

                        <button
                          onClick={() => setSkillToEdit(skill)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setSkillToDelete(skill)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic">No skills added yet</p>
                )}
                {skillToEdit && (
                  <EditSkillPopover
                    skill={skillToEdit}
                    onClose={() => setSkillToEdit(null)}
                  />
                )}
                {skillToDelete && (
                  <ConfirmDialog
                    open={true}
                    title="Delete skill"
                    description={`Are you sure you want to delete "${skillToDelete.name}"?`}
                    confirmText="Delete"
                    onCancel={() => setSkillToDelete(null)}
                    onConfirm={async () => {
                      await deleteSkill(skillToDelete.id);
                      setSkillToDelete(null);
                      window.location.reload();
                    }}
                  />
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-50 rounded-xl">
                    <IdCard className="w-5 h-5 text-violet-600" />
                  </div>
                  <h2 className="text-lg font-semibold">Education</h2>
                </div>

                <AddEducationsPopover
                  onAdd={async (data) => {
                    await addEducation(data, user.id);
                    window.location.reload();
                  }}
                />
              </div>

              <div className="p-6 space-y-6">
                {educations.length ? (
                  educations.map((edu) => (
                    <div
                      key={edu.id}
                      className="group flex justify-between items-start gap-4 border-b last:border-none pb-4"
                    >
                      <div>
                        <h3 className="font-semibold">{edu.institution}</h3>

                        {(edu.degree || edu.fieldOfStudy) && (
                          <p className="text-sm text-slate-600">
                            {[edu.degree, edu.fieldOfStudy]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        )}

                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(edu.startDate).toLocaleDateString()} —{" "}
                          {edu.endDate
                            ? new Date(edu.endDate).toLocaleDateString()
                            : "Present"}
                        </p>
                      </div>

                      <EducationActions edu={edu} />
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 italic">
                    No education added yet
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-xl">
                    <Briefcase className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h2 className="text-lg font-semibold">Work Experience</h2>
                </div>

                <AddExperiencePopover
                  onAdd={async (data) => {
                    await addExperience(data, user.id);
                    window.location.reload();
                  }}
                />
              </div>

              <div className="p-6 space-y-6">
                {experiences.length ? (
                  experiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="group flex justify-between items-start gap-4 border-b last:border-none pb-4"
                    >
                      <div>
                        <h3 className="font-semibold">{exp.jobTitle}</h3>
                        <p className="text-sm text-slate-600">
                          {exp.companyName}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(exp.startDate).toLocaleDateString()} —{" "}
                          {exp.endDate
                            ? new Date(exp.endDate).toLocaleDateString()
                            : "Present"}
                        </p>
                      </div>

                      <ExperienceActions exp={exp} />
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 italic">
                    No experience added yet
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        {user.role === "EDUCATEE" && isEduProfileComplete && (
          <button
            disabled={!isEduProfileComplete || isGeneratingCV}
            onClick={async () => {
              try {
                setIsGeneratingCV(true);
                const url = await generateUserCV();
                window.open(url, "_blank");
              } finally {
                setIsGeneratingCV(false);
              }
            }}
            className={`w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold transition
      ${
        isEduProfileComplete
          ? "bg-eduBlue text-white hover:bg-blue-700"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
      }`}
          >
            {isGeneratingCV ? "Generating CV..." : "Download CV"}
          </button>
        )}
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
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
          {label}
        </p>
        <div className="text-base font-normal text-slate-900 mt-1 wrap-break-words">
          {value ?? (
            <span className="text-slate-400 font-normal">Not provided</span>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: number | undefined | null;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col justify-center items-center text-center gap-3">
      <div className={`p-3 rounded-xl ${iconBg} ${iconColor}`}>{icon}</div>
      <div>
        <div className="text-2xl font-bold text-slate-900">{value ?? 0}</div>
        <div className="text-sm font-medium text-slate-500 mt-0.5">{label}</div>
      </div>
    </div>
  );
}
