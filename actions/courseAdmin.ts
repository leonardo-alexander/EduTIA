"use server";

import { requireAdminUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { CourseLevel } from "@prisma/client";

export async function createCourseAction(_prevState: any, formData: FormData) {
  try {
    await requireAdminUser();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const categoryId = formData.get("categoryId") as string;
    const level = formData.get("level") as CourseLevel;

    if (!title || !description || !categoryId || !level) {
      return { error: "All fields are required" };
    }

    const exists = await prisma.course.findUnique({
      where: { slug: slugify(title) },
    });

    if (exists) {
      return { error: "Course already exists" };
    }

    await prisma.course.create({
      data: {
        title,
        slug: slugify(title),
        description,
        level,
        categoryId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong" };
  }
}

export async function updateCourseAction(_prev: any, formData: FormData) {
  try {
    await requireAdminUser();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const thumbnailUrl = formData.get("thumbnailUrl") as string;
    const categoryId = formData.get("categoryId") as string;
    const level = formData.get("level") as CourseLevel;
    const isPublished = formData.get("isPublished") === "true";

    if (!title || !description || !categoryId || !level) {
      return { error: "All fields are required" };
    }

    await prisma.course.update({
      where: { slug: slugify(title) },
      data: {
        title,
        slug: slugify(title),
        description,
        level,
        thumbnailUrl,
        isPublished,
        categoryId,
      },
    });

    const updates: { id: string; position: number }[] = [];

    for (const [key, value] of formData.entries()) {
      if (key.startsWith("position_")) {
        const position = Number(value);

        if (isNaN(position)) {
          return { error: "Invalid position value" };
        }

        updates.push({
          id: key.replace("position_", ""),
          position,
        });
      }
    }

    const positions = updates.map((u) => u.position);
    const max = updates.length;

    if (positions.some((p) => p < 1 || p > max)) {
      return { error: `Positions must be between 1 and ${max}` };
    }

    if (new Set(positions).size !== positions.length) {
      return { error: "Positions must be unique" };
    }

    await prisma.$transaction(
      updates.map((u, i) =>
        prisma.courseItem.update({
          where: { id: u.id },
          data: { position: 1000 + i },
        }),
      ),
    );

    await prisma.$transaction(
      updates.map((u) =>
        prisma.courseItem.update({
          where: { id: u.id },
          data: { position: u.position },
        }),
      ),
    );

    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Failed to update course" };
  }
}

export async function deleteCourseAction(courseId: string) {
  await requireAdminUser();
  await prisma.course.delete({
    where: { id: courseId },
  });
}
