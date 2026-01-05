import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // ===== USERS =====
  await prisma.user.createMany({
    data: [
      {
        email: "admin@edutia.com",
        password: "hashed_admin_password",
        role: "ADMIN",
        gender: "MALE",
      },
      {
        email: "student@edutia.com",
        password: "hashed_student_password",
        role: "EDUCATEE",
        gender: "FEMALE",
      },
    ],
  });

  // ===== COURSES =====
  await prisma.course.createMany({
    data: [
      {
        title: "Introduction to Data Science",
        description:
          "Learn the basics of data analysis, statistics, and Python.",
        category: "Data Science",
        level: "BEGINNER",
        duration: 180,
        thumbnailUrl: "/public/thumbnail.jpeg",
        isPublished: true,
      },
      {
        title: "Fullstack Web Development",
        description:
          "Build modern web applications using React, Next.js, and APIs.",
        category: "Web Development",
        level: "INTERMEDIATE",
        duration: 240,
        thumbnailUrl: "/public/thumbnail.jpeg",
        isPublished: true,
      },
      {
        title: "Advanced Machine Learning",
        description: "Deep dive into ML models, optimization, and deployment.",
        category: "Machine Learning",
        level: "ADVANCED",
        duration: 300,
        thumbnailUrl: "/public/thumbnail.jpeg",
        isPublished: false,
      },
    ],
  });

  console.log("Seeding finished successfully");
}

main()
  .catch((error) => {
    console.error("Seeding error:", error);
    throw error;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
