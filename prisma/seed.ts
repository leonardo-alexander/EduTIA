import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.profile.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // ===== USERS =====
  const admin = await prisma.user.create({
    data: {
      email: "admin@edutia.com",
      password: await bcrypt.hash("hashed_admin_password", 10),
      role: "ADMIN",
    },
  });

  const student = await prisma.user.create({
    data: {
      email: "student@edutia.com",
      password: await bcrypt.hash("hashed_student_password", 10),
      role: "EDUCATEE",
    },
  });

  const corp1 = await prisma.user.create({
    data: {
      email: "corp@techcorp.com",
      password: await bcrypt.hash("hashed_corp_password", 10),
      role: "CORPORATION",
    },
  });

  const corp2 = await prisma.user.create({
    data: {
      email: "hr@innovate.io",
      password: await bcrypt.hash("hashed_corp_password", 10),
      role: "CORPORATION",
    },
  });

  // ===== PROFILES =====
  await prisma.profile.createMany({
    data: [
      {
        userId: admin.id,
        gender: "MALE",
        bio: "Platform administrator",
      },
      {
        userId: student.id,
        gender: "FEMALE",
        bio: "Learner interested in technology",
      },
    ],
  });

  await prisma.profile.createMany({
    data: [
      {
        userId: corp1.id,
        companyName: "TechCorp Solutions",
        companyWebsite: "https://techcorp.com",
        verificationDocUrl: "/docs/techcorp-verification.pdf",
        corpStatus: "VERIFIED",
        bio: "Enterprise technology solutions provider",
      },
      {
        userId: corp2.id,
        companyName: "Innovate IO",
        companyWebsite: "https://innovate.io",
        verificationDocUrl: "/docs/innovate-verification.pdf",
        corpStatus: "PENDING",
        bio: "HR and talent development company",
      },
    ],
  });

  // ===== CATEGORY =====
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "development" },
      update: {},
      create: { name: "Development", slug: "development" },
    }),
    prisma.category.upsert({
      where: { slug: "data-science" },
      update: {},
      create: { name: "Data Science", slug: "data-science" },
    }),
    prisma.category.upsert({
      where: { slug: "design" },
      update: {},
      create: { name: "Design", slug: "design" },
    }),
    prisma.category.upsert({
      where: { slug: "it-software" },
      update: {},
      create: { name: "IT & Software", slug: "it-software" },
    }),
    prisma.category.upsert({
      where: { slug: "business" },
      update: {},
      create: { name: "Business", slug: "business" },
    }),
  ]);

  const categoryMap = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

  // ===== COURSES =====
  await prisma.course.createMany({
    data: [
      {
        title: "Python for Data Analysis",
        description:
          "Analyze data using Python, Pandas, NumPy, and real-world datasets.",
        categoryId: categoryMap["data-science"],
        level: "BEGINNER",
        duration: 180,
        isPublished: true,
      },
      {
        title: "React & Next.js Web Development",
        description:
          "Build production-ready web apps using React, Next.js, and REST APIs.",
        categoryId: categoryMap["development"],
        level: "INTERMEDIATE",
        duration: 240,
        isPublished: true,
      },
      {
        title: "Machine Learning A–Z",
        description:
          "Learn supervised and unsupervised machine learning techniques.",
        categoryId: categoryMap["data-science"],
        level: "ADVANCED",
        duration: 300,
        isPublished: false,
      },
      {
        title: "UI/UX Design Fundamentals",
        description:
          "Learn design principles, wireframing, and user experience basics.",
        categoryId: categoryMap["design"],
        level: "BEGINNER",
        duration: 150,
        isPublished: true,
      },
      {
        title: "Cybersecurity Basics",
        description:
          "Understand networks, threats, and basic security best practices.",
        categoryId: categoryMap["it-software"],
        level: "BEGINNER",
        duration: 200,
        isPublished: true,
      },
      {
        title: "Startup & Entrepreneurship",
        description:
          "Learn how to validate ideas, build startups, and scale businesses.",
        categoryId: categoryMap["business"],
        level: "INTERMEDIATE",
        duration: 220,
        isPublished: true,
      },
    ],
  });

  console.log("Seeding completed.");
}

main()
  .catch((error) => {
    console.error("Seeding error:", error);
    throw error;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
