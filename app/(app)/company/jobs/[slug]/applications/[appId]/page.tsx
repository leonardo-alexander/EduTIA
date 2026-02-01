import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ReviewApp } from "@/components/jobs/ReviewApp";
import { AcceptApp } from "@/components/jobs/AcceptApp";

interface PageProps {
  params: {
    slug: string;
    appId: string;
  };
}

export default async function ApplicantDetailPage({ params }: PageProps) {
  const user = await getCurrentUser();
  if (!user || user.role !== "COMPANY") redirect("/dashboard");

  const { slug, appId } = await params;

  const application = await prisma.jobApplication.findUnique({
    where: { id: appId },
    include: {
      user: {
        include: {
          profile: true,
          skills: true,
          experiences: true,
          cvs: true,
        },
      },
      job: true,
    },
  });

  if (!application) redirect("/dashboard");
  if (application.job.userId !== user.id) redirect("/dashboard");

  const applicant = application.user;
  const profile = applicant.profile;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Applicant Detail</h1>
        <p className="text-gray-500">
          Applied for: <b>{application.job.title}</b>
        </p>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold">
            {profile?.name?.[0] ?? applicant.email[0].toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-lg">
              {profile?.name || applicant.email}
            </p>
            <p className="text-sm text-gray-500">{applicant.email}</p>
          </div>
        </div>

        <div>
          <span className="font-medium">Status:</span>{" "}
          <span
            className={`ml-2 font-semibold ${
              application.status === "ACCEPTED"
                ? "text-green-600"
                : application.status === "REJECTED"
                  ? "text-red-500"
                  : "text-yellow-600"
            }`}
          >
            {application.status}
          </span>
        </div>

        {profile && (
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            {profile.name && (
              <div>
                <span className="text-gray-500">Full Name</span>
                <p className="font-medium">{profile.name}</p>
              </div>
            )}

            {profile.dob && (
              <div>
                <span className="text-gray-500">Date of Birth</span>
                <p className="font-medium">
                  {new Date(profile.dob).toLocaleDateString()}
                </p>
              </div>
            )}

            {profile.gender && (
              <div>
                <span className="text-gray-500">Gender</span>
                <p className="font-medium">{profile.gender}</p>
              </div>
            )}
          </div>
        )}

        {applicant.skills.length > 0 && (
          <div>
            <p className="font-medium mb-1">Skills</p>
            <div className="flex flex-wrap gap-2">
              {applicant.skills.map((s) => (
                <span
                  key={s.id}
                  className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {applicant.experiences.length > 0 && (
          <div>
            <p className="font-medium mb-1">Experience</p>
            <ul className="space-y-2">
              {applicant.experiences.map((exp) => (
                <li key={exp.id} className="border rounded p-3">
                  <p className="font-semibold">{exp.jobTitle}</p>
                  <p className="text-sm text-gray-500">{exp.companyName}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {applicant.cvs.length > 0 && (
          <div>
            <p className="font-medium mb-1">CV</p>
            <a
              href={applicant.cvs[0].fileUrl}
              target="_blank"
              className="text-blue-600 underline"
            >
              View CV
            </a>
          </div>
        )}

        {application.status === "APPLIED" && <ReviewApp app={application} />}
        {application.status === "REVIEWED" && <AcceptApp app={application} />}
      </div>
    </div>
  );
}
