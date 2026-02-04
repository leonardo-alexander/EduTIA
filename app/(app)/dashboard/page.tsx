import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import CompanyDashboard from "@/components/dashboard/CompanyDashboard";
import EducateeDashboard from "@/components/dashboard/EducateeDashboard";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Dashboard | Edutia",
    description:
      "Access your personalized dashboard to manage courses, progress, and activities.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  switch (user.role) {
    case "ADMIN":
      redirect("/admin");

    case "COMPANY":
      return <CompanyDashboard />;

    case "EDUCATEE":
      return <EducateeDashboard />;

    default:
      return notFound();
  }
}
