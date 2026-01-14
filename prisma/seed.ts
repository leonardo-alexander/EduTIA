import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import bcrypt from "bcryptjs";
import { Category, Course } from "@prisma/client";

async function main() {
  // ===== CLEAN DATABASE =====
  await prisma.certificate.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.workshopRegistration.deleteMany();
  await prisma.workshopSubmission.deleteMany();
  await prisma.courseItem.deleteMany();
  await prisma.workshop.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.category.deleteMany();
  await prisma.corporationVerification.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // ===== USERS =====
  const admin = await prisma.user.create({
    data: {
      email: "admin@edutia.com",
      password: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
    },
  });

  const student = await prisma.user.create({
    data: {
      email: "student@edutia.com",
      password: await bcrypt.hash("student123", 10),
      role: "EDUCATEE",
    },
  });

  const corp = await prisma.user.create({
    data: {
      email: "corp@techcorp.com",
      password: await bcrypt.hash("corp123", 10),
      role: "CORPORATION",
    },
  });

  // ===== PROFILES =====
  await prisma.profile.createMany({
    data: [
      { userId: admin.id, gender: "MALE", bio: "Platform administrator" },
      {
        userId: student.id,
        gender: "FEMALE",
        pictureUrl: "/avatars/female.svg",
        bio: "Learner interested in technology",
      },
      {
        userId: corp.id,
        companyName: "TechCorp Solutions",
        companyWebsite: "https://techcorp.com",
        bio: "Enterprise technology solutions provider",
      },
    ],
  });

  const corpProfile = await prisma.profile.findFirstOrThrow({
    where: { userId: corp.id },
  });

  await prisma.corporationVerification.create({
    data: {
      profileId: corpProfile.id,
      status: "VERIFIED",
      verifiedAt: new Date(),
    },
  });

  // ===== CATEGORIES =====
  const categories = [
    "Development",
    "Web Development",
    "Backend",
    "Software Engineering",
    "Mobile Development",
    "DevOps",
    "Data Science",
    "Design",
    "IT & Software",
    "Business",
  ];

  await prisma.category.createMany({
    data: categories.map((name) => ({
      name,
      slug: slugify(name),
    })),
  });

  const categoryList: Category[] = await prisma.category.findMany();
  const categoryMap = Object.fromEntries(
    categoryList.map((c) => [c.slug, c.id])
  );

  // ===== COURSES =====
  await prisma.course.createMany({
    data: [
      {
        title: "Python for Data Analysis",
        slug: slugify("Python for Data Analysis"),
        description: "Analyze data using Python.",
        categoryId: categoryMap["data-science"],
        level: "BEGINNER",
        duration: 180,
        isPublished: true,
      },
      {
        title: "Machine Learning Fundamentals",
        slug: slugify("Machine Learning Fundamentals"),
        description: "Learn core machine learning concepts and algorithms.",
        categoryId: categoryMap["data-science"],
        level: "INTERMEDIATE",
        duration: 240,
        isPublished: true,
      },
      {
        title: "Deep Learning with TensorFlow",
        slug: slugify("Deep Learning with TensorFlow"),
        description: "Build deep learning models using TensorFlow.",
        categoryId: categoryMap["data-science"],
        level: "ADVANCED",
        duration: 300,
        isPublished: true,
      },
      {
        title: "Web Development with HTML, CSS, and JavaScript",
        slug: slugify("Web Development with HTML CSS and JavaScript"),
        description: "Build responsive websites from scratch.",
        categoryId: categoryMap["web-development"],
        level: "BEGINNER",
        duration: 200,
        isPublished: true,
      },
      {
        title: "Backend Development with Node.js",
        slug: slugify("Backend Development with Node.js"),
        description: "Create RESTful APIs using Node.js and Express.",
        categoryId: categoryMap["web-development"],
        level: "INTERMEDIATE",
        duration: 220,
        isPublished: true,
      },
      {
        title: "Database Design and SQL",
        slug: slugify("Database Design and SQL"),
        description:
          "Design relational databases and write efficient SQL queries.",
        categoryId: categoryMap["backend"],
        level: "BEGINNER",
        duration: 160,
        isPublished: true,
      },
      {
        title: "System Design for Software Engineers",
        slug: slugify("System Design for Software Engineers"),
        description: "Learn scalable system design concepts and patterns.",
        categoryId: categoryMap["software-engineering"],
        level: "ADVANCED",
        duration: 260,
        isPublished: true,
      },
      {
        title: "UI/UX Design Basics",
        slug: slugify("UI UX Design Basics"),
        description:
          "Understand the fundamentals of user interface and user experience design.",
        categoryId: categoryMap["design"],
        level: "BEGINNER",
        duration: 140,
        isPublished: true,
      },
      {
        title: "Mobile App Development with Flutter",
        slug: slugify("Mobile App Development with Flutter"),
        description: "Build cross-platform mobile applications using Flutter.",
        categoryId: categoryMap["mobile-development"],
        level: "INTERMEDIATE",
        duration: 230,
        isPublished: true,
      },
      {
        title: "DevOps Fundamentals",
        slug: slugify("DevOps Fundamentals"),
        description:
          "Learn CI/CD, Docker, and basic cloud deployment practices.",
        categoryId: categoryMap["devops"],
        level: "BEGINNER",
        duration: 190,
        isPublished: true,
      },
    ],
  });

  const courseList: Course[] = await prisma.course.findMany();
  const courseMap = Object.fromEntries(courseList.map((c) => [c.slug, c.id]));

  const pythonCourseId = courseMap[slugify("Python for Data Analysis")];
  if (!pythonCourseId) throw new Error("Python course not found");

  // ===== MODULES =====
  const module1 = await prisma.module.create({
    data: {
      title: "Python Basics",
      contentUrl: "/thumbnail.jpeg",
      courseId: pythonCourseId,
    },
  });

  const module2 = await prisma.module.create({
    data: {
      title: "Data Analysis with Pandas",
      contentUrl: "/thumbnail.jpeg",
      courseId: pythonCourseId,
    },
  });

  // ===== WORKSHOP =====
  const workshop = await prisma.workshop.create({
    data: {
      title: "Python Hands-on Workshop",
      instructions: "Complete the data analysis task.",
      courseId: pythonCourseId,
    },
  });

  // ===== COURSE TIMELINE =====
  await prisma.courseItem.createMany({
    data: [
      {
        courseId: pythonCourseId,
        position: 1,
        type: "MODULE",
        moduleId: module1.id,
      },
      {
        courseId: pythonCourseId,
        position: 2,
        type: "MODULE",
        moduleId: module2.id,
      },
      {
        courseId: pythonCourseId,
        position: 3,
        type: "WORKSHOP",
        workshopId: workshop.id,
      },
    ],
  });

  // ===== WORKSHOP REGISTRATION =====
  await prisma.workshopRegistration.create({
    data: {
      userId: student.id,
      workshopId: workshop.id,
    },
  });

  // ===== ENROLLMENT =====
  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: pythonCourseId,
      progressPercent: 0,
    },
  });
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
