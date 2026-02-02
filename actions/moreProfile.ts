"use server";

import { prisma } from "@/lib/prisma";

export async function addSkill(name: string, userId: string) {
  await prisma.skill.create({
    data: { name, userId },
  });
}

export async function addExperience(
  data: {
    jobTitle: string;
    companyName: string;
    startDate: string;
    endDate?: string;
  },
  userId: string,
) {
  await prisma.experience.create({
    data: {
      ...data,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      userId,
    },
  });
}

export async function updateSkill(skillId: string, name: string) {
  await prisma.skill.update({
    where: { id: skillId },
    data: { name },
  });
}

export async function deleteSkill(skillId: string) {
  await prisma.skill.delete({
    where: { id: skillId },
  });
}

export async function updateExperience(
  experienceId: string,
  data: {
    jobTitle: string;
    companyName: string;
    startDate: string;
    endDate?: string;
  },
) {
  await prisma.experience.update({
    where: { id: experienceId },
    data: {
      jobTitle: data.jobTitle,
      companyName: data.companyName,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
    },
  });
}

export async function deleteExperience(experienceId: string) {
  await prisma.experience.delete({
    where: { id: experienceId },
  });
}
