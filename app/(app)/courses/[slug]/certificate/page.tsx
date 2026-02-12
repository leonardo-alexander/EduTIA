import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { generatePdfCertificate } from "@/lib/certGenerator";
import CertificateComponent from "@/components/Certificate";
import PrintButton from "@/components/PrintButton";
import { Certificate } from "@prisma/client";
import type { Metadata } from "next";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata() {
  return {
    title: `Certificate | EduTIA`,
    description: "View and download your course completion certificate.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function CertificatePage({ params }: PageProps) {
  const { slug } = await params;

  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const course = await prisma.course.findUnique({
    where: { slug },
  });
  if (!course) notFound();

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

  if (!enrollment) notFound();

  if (enrollment.status !== "COMPLETED") {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold">
          Complete the course to unlock your certificate
        </h2>
      </div>
    );
  }

  const certificate: Certificate =
    enrollment.certificate ?? (await generatePdfCertificate(enrollment.id));

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="print:hidden">
        <PrintButton certificate={certificate} />
      </div>

      <div id="print-area">
        <CertificateComponent
          userName={user.profile?.name ?? user.email}
          courseTitle={course.title}
          completionDate={certificate.issuedAt}
          certificateId={certificate.certificateCode}
        />
      </div>
    </div>
  );
}
