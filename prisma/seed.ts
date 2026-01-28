import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import bcrypt from "bcryptjs";
import { Category, Course } from "@prisma/client";

async function main() {
  // ===== CLEAN DATABASE =====
  await prisma.jobApplication.deleteMany();
  await prisma.jobPosting.deleteMany();
  await prisma.jobCategory.deleteMany();
  await prisma.learningPathItem.deleteMany();
  await prisma.learningPath.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.workshopSubmission.deleteMany();
  await prisma.workshopRegistration.deleteMany();
  await prisma.workshop.deleteMany();
  await prisma.moduleProgress.deleteMany();
  await prisma.courseItem.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.category.deleteMany();
  await prisma.companyVerification.deleteMany();
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

  await prisma.user.create({
    data: {
      email: "admin2@edutia.com",
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
      role: "COMPANY",
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
        name: "TechCorp Solutions",
        companyWebsite: "https://techcorp.com",
        companyAddress: "Jakarta",
        pictureUrl: "https://www.pengenkuliah.com/university_logo/bca.png",
        bio: "Enterprise technology solutions provider",
      },
    ],
  });

  const corpProfile = await prisma.profile.findFirstOrThrow({
    where: { userId: corp.id },
  });

  await prisma.companyVerification.create({
    data: {
      profileId: corpProfile.id,
      status: "VERIFIED",
      verifiedAt: new Date(),
    },
  });

  // ===== CATEGORIES =====
  const categories = [
    "Software Development",
    "Data & AI",
    "Design & Creative",
    "IT & Infrastructure",
    "Business & Management",
  ];

  await prisma.category.createMany({
    data: categories.map((name) => ({
      name,
      slug: slugify(name),
    })),
  });

  const categoryList: Category[] = await prisma.category.findMany();
  const categoryMap = Object.fromEntries(
    categoryList.map((c) => [c.slug, c.id]),
  );

  // ===== COURSES =====
  await prisma.course.createMany({
    data: [
      {
        title: "Python for Data Analysis",
        slug: slugify("Python for Data Analysis"),
        description: "Analyze data using Python.",
        categoryId: categoryMap[slugify("Data & AI")],
        level: "BEGINNER",
        duration: 180,
        isPublished: true,
      },
      {
        title: "Machine Learning Fundamentals",
        slug: slugify("Machine Learning Fundamentals"),
        description: "Learn core machine learning concepts and algorithms.",
        categoryId: categoryMap[slugify("Data & AI")],
        level: "INTERMEDIATE",
        duration: 240,
        isPublished: true,
      },
      {
        title: "Deep Learning with TensorFlow",
        slug: slugify("Deep Learning with TensorFlow"),
        description: "Build deep learning models using TensorFlow.",
        categoryId: categoryMap[slugify("Data & AI")],
        level: "ADVANCED",
        duration: 300,
        isPublished: true,
      },
      {
        title: "Web Development with HTML, CSS, and JavaScript",
        slug: slugify("Web Development with HTML CSS and JavaScript"),
        description: "Build responsive websites from scratch.",
        categoryId: categoryMap[slugify("Software Development")],
        level: "BEGINNER",
        duration: 200,
        isPublished: true,
      },
      {
        title: "Backend Development with Node.js",
        slug: slugify("Backend Development with Node.js"),
        description: "Create RESTful APIs using Node.js and Express.",
        categoryId: categoryMap[slugify("Software Development")],
        level: "INTERMEDIATE",
        duration: 220,
        isPublished: true,
      },
      {
        title: "Database Design and SQL",
        slug: slugify("Database Design and SQL"),
        description:
          "Design relational databases and write efficient SQL queries.",
        categoryId: categoryMap[slugify("Software Development")],
        level: "BEGINNER",
        duration: 160,
        isPublished: true,
        avgRating: 5.0,
        reviewCount: 10,
      },
      {
        title: "System Design for Software Engineers",
        slug: slugify("System Design for Software Engineers"),
        description: "Learn scalable system design concepts and patterns.",
        categoryId: categoryMap[slugify("Software Development")],
        level: "ADVANCED",
        duration: 260,
        isPublished: true,
        avgRating: 3.0,
        reviewCount: 8,
      },
      {
        title: "UI/UX Design Basics",
        slug: slugify("UI UX Design Basics"),
        description:
          "Understand the fundamentals of user interface and user experience design.",
        categoryId: categoryMap[slugify("Design & Creative")],
        level: "BEGINNER",
        duration: 140,
        isPublished: true,
      },
      {
        title: "Mobile App Development with Flutter",
        slug: slugify("Mobile App Development with Flutter"),
        description: "Build cross-platform mobile applications using Flutter.",
        categoryId: categoryMap[slugify("Software Development")],
        level: "INTERMEDIATE",
        duration: 230,
        isPublished: true,
      },
      {
        title: "DevOps Fundamentals",
        slug: slugify("DevOps Fundamentals"),
        description:
          "Learn CI/CD, Docker, and basic cloud deployment practices.",
        categoryId: categoryMap[slugify("IT & Infrastructure")],
        level: "BEGINNER",
        duration: 190,
        isPublished: true,
      },
    ],
  });

  const courseList: Course[] = await prisma.course.findMany();
  const courseMap = Object.fromEntries(courseList.map((c) => [c.slug, c.id]));

  // ===== MODULES =====
  const module1 = await prisma.module.create({
    data: {
      title: "Python Basics",
      contentUrl: "/thumbnail.jpeg",
    },
  });

  const module2 = await prisma.module.create({
    data: {
      title: "Data Analysis with Pandas",
      contentUrl: "/thumbnail.jpeg",
    },
  });

  // ===== MODULE PROGRESS =====
  await prisma.moduleProgress.create({
    data: {
      userId: student.id,
      moduleId: module1.id,
      completedAt: new Date(),
    },
  });

  await prisma.moduleProgress.create({
    data: {
      userId: student.id,
      moduleId: module2.id,
      completedAt: new Date(),
    },
  });

  // ===== WORKSHOP =====
  const workshop = await prisma.workshop.create({
    data: {
      title: "Python Hands-on Workshop",
      instructions: "Complete the data analysis task.",
    },
  });

  // ===== WORKSHOP SUBMISSION
  await prisma.workshopSubmission.create({
    data: {
      submissionUrl: "test",
      score: 100,
      submittedAt: new Date(),
      userId: student.id,
      workshopId: workshop.id,
    },
  });

  // ===== COURSE TIMELINE =====
  await prisma.courseItem.createMany({
    data: [
      {
        courseId: courseMap[slugify("Python for Data Analysis")],
        slug: slugify(module1.title),
        position: 1,
        type: "MODULE",
        moduleId: module1.id,
      },
      {
        courseId: courseMap[slugify("Python for Data Analysis")],
        slug: slugify(module2.title),
        position: 2,
        type: "MODULE",
        moduleId: module2.id,
      },
      {
        courseId: courseMap[slugify("Python for Data Analysis")],
        slug: slugify(workshop.title),
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
      courseId: courseMap[slugify("Python for Data Analysis")],
      progressPercent: 100,
      status: "COMPLETED",
    },
  });

  // ===== LEARNING PATH =====
  const ds_path = await prisma.learningPath.create({
    data: {
      title: "Data Science",
      slug: slugify("Data Science"),
      description: "Data science path that provides with ...",
      isPublished: true,
    },
  });

  // ===== PATH TIMELINE =====
  await prisma.learningPathItem.createMany({
    data: [
      {
        position: 1,
        learningPathId: ds_path.id,
        courseId: courseMap[slugify("Python for Data Analysis")],
      },
    ],
  });

  // ===== JOBS =====
  const jobCategories = [
    { name: "Software Development", slug: "software-development" },
    { name: "Data & AI", slug: "data-ai" },
    { name: "Design & Creative", slug: "design-creative" },
    { name: "IT & Infrastructure", slug: "it-infrastructure" },
    { name: "Business & Management", slug: "business-management" },
    { name: "Marketing & Sales", slug: "marketing-sales" },
    { name: "Finance & Accounting", slug: "finance-accounting" },
    { name: "Human Resources", slug: "human-resources" },
    { name: "Product Management", slug: "product-management" },
    { name: "Customer Support", slug: "customer-support" },
  ];

  await prisma.jobCategory.createMany({
    data: jobCategories,
  });

  const jobCategoryList = await prisma.jobCategory.findMany();

  const jobCategoryMap = Object.fromEntries(
    jobCategoryList.map((c) => [c.slug, c.id]),
  );

  await prisma.jobPosting.createMany({
    data: [
      {
        title: "Data Analyst",
        slug: slugify("Data Analyst"),
        description: "Analyze business and product data to support decisions.",
        status: "PUBLISHED",

        categoryId: jobCategoryMap["data-ai"],

        type: "FULL_TIME",
        workMode: "REMOTE",
        level: "JUNIOR",

        paycheck: 4000000,

        userId: corp.id,
      },
      {
        title: "Data Scientist",
        slug: slugify("Data Scientist"),
        description: "Analyze business and product data to support decisions.",
        status: "PUBLISHED",

        categoryId: jobCategoryMap["data-ai"],

        type: "FULL_TIME",
        workMode: "REMOTE",
        level: "SENIOR",

        paycheck: 10000000,

        userId: corp.id,
      },
      {
        title: "Data Engineer",
        slug: slugify("Data Engineer"),
        description: "Analyze business and product data to support decisions.",
        status: "PUBLISHED",

        categoryId: jobCategoryMap["data-ai"],

        type: "FULL_TIME",
        workMode: "REMOTE",
        level: "MID",

        paycheck: 5000000,

        userId: corp.id,
      },
      {
        title: "UI/UX Designer",
        slug: slugify("UI/UX Designer"),
        description: "Analyze business and product data to support decisions.",
        status: "PUBLISHED",

        categoryId: jobCategoryMap["data-ai"],

        type: "PART_TIME",
        workMode: "HYBRID",
        level: "LEAD",

        paycheck: 1000000,

        userId: corp.id,
      },
    ],
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
