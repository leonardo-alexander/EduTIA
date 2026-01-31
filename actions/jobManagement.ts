"use server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { ExperienceLevel, JobStatus, JobType, WorkMode } from "@prisma/client";
import { randomUUID } from "crypto";

export async function createJobAction(_prevState: any, formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "COMPANY") {
      return { error: "Not authorized" };
    }

    const title = formData.get("title")?.toString().trim();
    const description = formData.get("description")?.toString().trim();
    const location =
      formData.get("location")?.toString() ||
      user.profile?.companyAddress ||
      null;
    const categoryId = formData.get("categoryId")?.toString();
    const type = formData.get("type") as JobType;
    const workMode = formData.get("mode") as WorkMode;
    const levelRaw = formData.get("level")?.toString();
    const level = levelRaw ? (levelRaw as ExperienceLevel) : null;
    const status = formData.get("status") as JobStatus;
    const paycheckMin = formData.get("paycheckMin")
      ? Number(formData.get("paycheckMin"))
      : null;
    const paycheckMax = formData.get("paycheckMax")
      ? Number(formData.get("paycheckMax"))
      : null;
    const expiresAt = formData.get("expiredDate")
      ? new Date(formData.get("expiredDate") as string)
      : null;

    if (
      !title ||
      !description ||
      !categoryId ||
      !type ||
      !workMode ||
      !status
    ) {
      return { error: "Required fields are missing" };
    }

    const slug = `${slugify(title)}-${randomUUID().slice(0, 8)}`;

    await prisma.jobPosting.create({
      data: {
        userId: user.id,
        categoryId,
        title,
        slug,
        description,
        location,
        status,
        type,
        workMode,
        level,
        paycheckMin,
        paycheckMax,
        expiresAt,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Create job error:", error);
    return { error: "Something went wrong" };
  }
}

export async function updateJob(_prev: any, formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "COMPANY") {
      return { error: "Not authorized" };
    }

    const slug = formData.get("slug") as string;
    const title = formData.get("title")?.toString().trim();
    const description = formData.get("description")?.toString().trim();
    const location =
      formData.get("location")?.toString() ||
      user.profile?.companyAddress ||
      null;
    const categoryId = formData.get("categoryId")?.toString();
    const type = formData.get("type") as JobType;
    const workMode = formData.get("mode") as WorkMode;
    const levelRaw = formData.get("level")?.toString();
    const level = levelRaw ? (levelRaw as ExperienceLevel) : null;
    const status = formData.get("status") as JobStatus;
    const paycheckMin = formData.get("paycheckMin")
      ? Number(formData.get("paycheckMin"))
      : null;
    const paycheckMax = formData.get("paycheckMax")
      ? Number(formData.get("paycheckMax"))
      : null;
    const expiresAt = formData.get("expiredDate")
      ? new Date(formData.get("expiredDate") as string)
      : null;

    if (
      !title ||
      !description ||
      !categoryId ||
      !type ||
      !workMode ||
      !status
    ) {
      return { error: "Required fields are missing" };
    }

    await prisma.jobPosting.update({
      where: { slug },
      data: {
        categoryId,
        title,
        description,
        location,
        status,
        type,
        workMode,
        level,
        paycheckMin,
        paycheckMax,
        expiresAt,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Update job error:", error);
    return { error: "Something went wrong" };
  }
}

export async function deleteJob(jobId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== "COMPANY") return { error: "Not authorized" };

  await prisma.jobPosting.delete({
    where: { id: jobId },
  });
}

export async function acceptApplication(appId: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user || user.role !== "COMPANY") return;

  const application = await prisma.jobApplication.findUnique({
    where: { id: appId },
    include: { job: true },
  });

  if (!application) return;
  if (application.job.userId !== user.id) return;
  if (application.status !== "APPLIED") return;

  await prisma.jobApplication.update({
    where: { id: appId },
    data: {
      status: "ACCEPTED",
      decidedAt: new Date(),
    },
  });
}

export async function rejectApplication(appId: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user || user.role !== "COMPANY") {
    return;
  }

  const application = await prisma.jobApplication.findUnique({
    where: { id: appId },
    include: {
      job: true,
    },
  });

  if (!application) return;
  if (application.job.userId !== user.id) return;
  if (application.status !== "APPLIED") return;

  await prisma.jobApplication.update({
    where: { id: appId },
    data: {
      status: "REJECTED",
      decidedAt: new Date(),
    },
  });
}
