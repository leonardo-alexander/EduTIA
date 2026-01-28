import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import BackButton from "@/components/BackButton";
import Certificate from "@/components/Certificate";


interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await prisma.course.findUnique({
    where: { slug },
    select: { title: true },
  });

  if (!course) {
    return { title: "Certificate Not Found" };
  }

  return {
    title: `Certificate - ${course.title} | Learning Platform`,
  };
}

export default async function CertificatePage({ params }: PageProps) {
  const { slug } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?redirect=/courses/${slug}/certificate`);
  }

  const course = await prisma.course.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
    },
  });

  if (!course) {
    notFound();
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
    },
    include: {
      certificate: true,
    },
  });

  const isCompleted = enrollment?.status === "COMPLETED";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="print:hidden mb-6">
        <BackButton />
      </div>

      {(
        <Certificate
          userName={user.profile?.name || user.email.split("@")[0]}
          courseTitle={course.title}
          completionDate={enrollment.certificate?.issuedAt || enrollment.updatedAt || new Date()}
          certificateId={enrollment.certificate?.certificateCode}
        />
      )}
    </div>
  );
}