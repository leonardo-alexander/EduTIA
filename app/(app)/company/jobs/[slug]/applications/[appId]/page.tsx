import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ReviewApp } from "@/components/jobs/ReviewApp";
import { AcceptApp } from "@/components/jobs/AcceptApp";
import type { Metadata } from "next";
import BackButton from "@/components/BackButton";
import {
  User,
  Calendar,
  Users,
  Mail,
  GraduationCap,
  Briefcase,
  ListCheck,
  FileText,
  BookOpen,
  ArrowLeft,
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle,
  Download,
} from "lucide-react";

interface PageProps {
  params: {
    slug: string;
    appId: string;
  };
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Applicant Detail | EduTIA",
    description: "Review applicant information and manage application status.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ApplicantDetailPage({ params }: PageProps) {
  const user = await getCurrentUser();
  if (!user || user.role !== "COMPANY") redirect("/dashboard");

  const { appId, slug } = await params;

  const application = await prisma.jobApplication.findUnique({
    where: { id: appId },
    include: {
      user: {
        include: {
          profile: true,
          skills: true,
          educations: true,
          experiences: true,
          cvs: true,
          workshopSubmissions: {
            include: {
              workshop: true,
            },
          },
        },
      },
      job: true,
    },
  });

  if (!application) redirect("/dashboard");
  if (application.job.userId !== user.id) redirect("/dashboard");

  const applicant = application.user;
  const { profile } = applicant;

  const statusMap: Record<
    string,
    { bg: string; text: string; border: string; label: string }
  > = {
    APPLIED: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      border: "border-yellow-200",
      label: "Applied",
    },
    REVIEWED: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      border: "border-blue-200",
      label: "Under Review",
    },
    ACCEPTED: {
      bg: "bg-green-100",
      text: "text-green-700",
      border: "border-green-200",
      label: "Accepted",
    },
    REJECTED: {
      bg: "bg-red-100",
      text: "text-red-700",
      border: "border-red-200",
      label: "Rejected",
    },
  };

  const status = statusMap[application.status] || statusMap.APPLIED;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50/30">
      <div className="bg-eduBlue">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
            <BackButton />

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-white flex items-center justify-center text-2xl font-bold text-eduBlue shrink-0">
              {profile?.pictureUrl ? (
                <img
                  src={profile.pictureUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>
                  {profile?.name?.[0] ?? applicant.email[0].toUpperCase()}
                </span>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-none">
                  {profile?.name || applicant.email}
                </h1>
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold text-xs ${status.bg} ${status.text} border ${status.border}`}
                >
                  {application.status === "REVIEWED" && (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                  {application.status === "ACCEPTED" && (
                    <CheckCircle className="w-3.5 h-3.5" />
                  )}
                  {application.status === "REJECTED" && (
                    <XCircle className="w-3.5 h-3.5" />
                  )}
                  {status.label}
                </div>
                {(application.status === "APPLIED" ||
                  application.status === "REVIEWED") && (
                  <div className="shrink-0 sm:ml-auto">
                    {application.status === "APPLIED" && (
                      <ReviewApp app={application} />
                    )}
                    {application.status === "REVIEWED" && (
                      <AcceptApp app={application} />
                    )}
                  </div>
                )}
              </div>
              <p className="mt-1 text-white/70 text-sm flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                {applicant.email}
              </p>
              <p className="mt-2 text-white/80 text-sm">
                Applied for{" "}
                <span className="font-semibold text-white">
                  {application.job.title}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 space-y-8">
        {profile && (profile.name || profile.dob || profile.gender) && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 bg-linear-to-r from-slate-50 to-white border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-xl">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Personal Information
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-6">
                {profile.name && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                        Full Name
                      </p>
                      <p className="text-base text-slate-900 mt-1">
                        {profile.name}
                      </p>
                    </div>
                  </div>
                )}
                {profile.dob && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-purple-50 text-purple-600 shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                        Date of Birth
                      </p>
                      <p className="text-base text-slate-900 mt-1">
                        {new Date(profile.dob).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                )}
                {profile.gender && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                        Gender
                      </p>
                      <p className="text-base text-slate-900 mt-1">
                        {profile.gender.charAt(0) +
                          profile.gender.slice(1).toLowerCase()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {(applicant.educations.length > 0 ||
          applicant.experiences.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {applicant.educations.length > 0 && (
              <div className={`bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden ${applicant.experiences.length === 0 ? "md:col-span-2" : ""}`}>
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-50 rounded-xl">
                      <GraduationCap className="w-5 h-5 text-violet-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Education
                    </h2>
                  </div>
                </div>
                <div className="divide-y divide-slate-100">
                  {applicant.educations.map((edu) => (
                    <div
                      key={edu.id}
                      className="px-6 py-4"
                    >
                      <h3 className="font-semibold text-slate-900">
                        {edu.institution}
                      </h3>
                      {(edu.degree || edu.fieldOfStudy) && (
                        <p className="text-sm text-slate-600 mt-0.5">
                          {[edu.degree, edu.fieldOfStudy]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      )}
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(edu.startDate).getFullYear()} –{" "}
                        {edu.endDate
                          ? new Date(edu.endDate).getFullYear()
                          : "Present"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {applicant.experiences.length > 0 && (
              <div className={`bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden ${applicant.educations.length === 0 ? "md:col-span-2" : ""}`}>
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 rounded-xl">
                      <Briefcase className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Experience
                    </h2>
                  </div>
                </div>
                <div className="divide-y divide-slate-100">
                  {applicant.experiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="px-6 py-4"
                    >
                      <h3 className="font-semibold text-slate-900">
                        {exp.jobTitle}
                      </h3>
                      <p className="text-sm text-slate-600 mt-0.5">
                        {exp.companyName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {(applicant.workshopSubmissions.length > 0 ||
          applicant.skills.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {applicant.workshopSubmissions.length > 0 && (
              <div className={`bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden ${applicant.skills.length === 0 ? "md:col-span-2" : ""}`}>
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 rounded-xl">
                      <BookOpen className="w-5 h-5 text-amber-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Completed Workshops
                    </h2>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {applicant.workshopSubmissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex justify-between items-start gap-4 border-b border-slate-100 last:border-none pb-4 last:pb-0"
                    >
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {sub.workshop.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Submitted on{" "}
                          {new Date(sub.submittedAt).toLocaleDateString()}
                        </p>
                        {sub.score !== null && (
                          <p className="text-sm text-slate-600 mt-1">
                            Score:{" "}
                            <span className="font-semibold">{sub.score}</span>
                          </p>
                        )}
                        {sub.feedback && (
                          <p className="text-sm text-slate-500 mt-1 italic">
                            &ldquo;{sub.feedback}&rdquo;
                          </p>
                        )}
                      </div>
                      <a
                        href={sub.submissionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-eduBlue hover:text-blue-700 transition-colors shrink-0"
                      >
                        View
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {applicant.skills.length > 0 && (
              <div className={`bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden ${applicant.workshopSubmissions.length === 0 ? "md:col-span-2" : ""}`}>
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-xl">
                      <ListCheck className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Skills
                    </h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {applicant.skills.map((s) => (
                      <span
                        key={s.id}
                        className="px-3 py-1.5 rounded-full bg-blue-50 text-sm font-medium text-blue-700"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {applicant.cvs.length > 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-50 rounded-xl">
                  <FileText className="w-5 h-5 text-rose-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Resume
                </h2>
              </div>
            </div>
            <div className="p-6">
              <a
                href={applicant.cvs[0].fileUrl}
                target="_blank"
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium hover:bg-slate-100 hover:border-slate-300 transition-all"
              >
                <Download className="w-4 h-4 text-slate-500" />
                Download CV
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}