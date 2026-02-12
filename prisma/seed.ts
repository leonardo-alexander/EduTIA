import { CourseLevel, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

async function main() {
  /* ===================== CLEAN ===================== */
  await prisma.$transaction([
    prisma.adminAction.deleteMany(),
    prisma.jobApplication.deleteMany(),
    prisma.jobPosting.deleteMany(),
    prisma.jobCategory.deleteMany(),
    prisma.learningPathItem.deleteMany(),
    prisma.learningPath.deleteMany(),
    prisma.certificate.deleteMany(),
    prisma.enrollment.deleteMany(),
    prisma.workshopSubmission.deleteMany(),
    prisma.workshop.deleteMany(),
    prisma.moduleProgress.deleteMany(),
    prisma.courseItem.deleteMany(),
    prisma.module.deleteMany(),
    prisma.review.deleteMany(),
    prisma.favorite.deleteMany(),
    prisma.course.deleteMany(),
    prisma.category.deleteMany(),
    prisma.companyVerification.deleteMany(),
    prisma.skill.deleteMany(),
    prisma.experience.deleteMany(),
    prisma.cV.deleteMany(),
    prisma.profile.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  /* ===================== USERS ===================== */
  const admin = await prisma.user.create({
    data: {
      email: "admin@edutia.com",
      password: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
      profile: {
        create: {
          name: "System Admin",
          bio: "Platform administrator",
          gender: "MALE",
        },
      },
    },
  });

  const student = await prisma.user.create({
    data: {
      email: "student@edutia.com",
      password: await bcrypt.hash("student123", 10),
      role: "EDUCATEE",
      profile: {
        create: {
          bio: "Aspiring data scientist",
          gender: "FEMALE",
          dob: new Date("2000-10-24"),
          pictureUrl: "/uploads/avatars/jane_doe.jpg",
        },
      },
    },
  });

  const company = await prisma.user.create({
    data: {
      email: "corp@techcorp.com",
      password: await bcrypt.hash("corp123", 10),
      role: "COMPANY",
      profile: {
        create: {
          name: "TechCorp Indonesia",
          bio: "Data & AI company",
          companyAddress: "Jakarta",
          companyWebsite: "https://techcorp.io",
          pictureUrl: "/uploads/avatars/company.jpg",
        },
      },
    },
  });

  const companyProfile = await prisma.profile.findUniqueOrThrow({
    where: { userId: company.id },
  });

  await prisma.companyVerification.create({
    data: {
      profileId: companyProfile.id,
      status: "VERIFIED",
      verifiedAt: new Date(),
      verifiedBy: admin.id,
    },
  });

  /* ===================== CATEGORIES ===================== */
  const categoryNames = [
    "Data & AI",
    "Software Development",
    "IT & Infrastructure",
    "Design & Creative",
    "Product Management",
    "Business & Management",
    "Marketing & Digital Marketing",
    "Finance & Accounting",
    "Human Resources",
    "Operations & Administration",
  ];

  await prisma.category.createMany({
    data: categoryNames.map((name) => ({
      name,
      slug: slugify(name),
    })),
  });

  const categories = await prisma.category.findMany();
  const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

  /* ===================== COURSES ===================== */
  const courseData: {
    title: string;
    description: string;
    level: CourseLevel;
    duration: number;
    category: string;
  }[] = [
    {
      title: "Python for Data Analysis",
      description: "Learn Python, Pandas, and NumPy for data analysis.",
      level: CourseLevel.BEGINNER,
      duration: 180,
      category: "Data & AI",
    },
    {
      title: "SQL for Data Science",
      description: "Master SQL for analytical queries.",
      level: CourseLevel.BEGINNER,
      duration: 150,
      category: "Data & AI",
    },
    {
      title: "Machine Learning Fundamentals",
      description: "Understand core ML concepts and algorithms.",
      level: CourseLevel.INTERMEDIATE,
      duration: 220,
      category: "Data & AI",
    },
    {
      title: "Deep Learning with TensorFlow",
      description: "Build deep learning models using TensorFlow.",
      level: CourseLevel.ADVANCED,
      duration: 300,
      category: "Data & AI",
    },
    {
      title: "Backend Development with Node.js",
      description: "Build scalable backend services using Node.js.",
      level: CourseLevel.INTERMEDIATE,
      duration: 210,
      category: "Software Development",
    },
    {
      title: "REST API Design",
      description: "Design clean and scalable RESTful APIs.",
      level: CourseLevel.BEGINNER,
      duration: 160,
      category: "Software Development",
    },
    {
      title: "System Design Basics",
      description: "Learn system design fundamentals.",
      level: CourseLevel.INTERMEDIATE,
      duration: 200,
      category: "Software Development",
    },
  ];

  await prisma.course.createMany({
    data: courseData.map((c) => ({
      title: c.title,
      slug: slugify(c.title),
      description: c.description,
      level: c.level,
      duration: c.duration,
      isPublished: true,
      categoryId: categoryBySlug[slugify(c.category)].id,
    })),
  });

  const courses = await prisma.course.findMany();
  const courseBySlug = Object.fromEntries(courses.map((c) => [c.slug, c]));

  /* ===================== MODULES + WORKSHOPS ===================== */
  const createCourseFlow = async (courseId: string, title: string) => {
    const base = slugify(title);

    /* ===================== MODULES ===================== */
    const intro = await prisma.module.create({
      data: {
        title: "Introduction",
        contentUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
      },
    });

    const core = await prisma.module.create({
      data: {
        title: "Core Concepts",
        contentUrl: "https://www.youtube.com/watch?v=LHBE6Q9XlzI",
      },
    });

    /* ===================== WORKSHOP ===================== */
    const workshop = await prisma.workshop.create({
      data: {
        title: "Final Project",
        instructions: `
You are required to complete a hands-on project based on the materials in this course.

Instructions:
1. Choose a dataset related to the course topic (CSV or Excel format).
2. Perform data analysis or implementation based on the course focus.
3. Document your approach and results clearly.

Submission Guidelines:
- Submit either:
  • A Google Colab notebook link, OR
  • A GitHub repository link
- The submission must include:
  • Code
  • Explanation of steps
  • Final results or conclusions

Evaluation Criteria:
- Correctness
- Code quality
- Clarity of explanation
- Practical relevance
      `.trim(),
      },
    });

    /* ===================== COURSE FLOW ===================== */
    await prisma.courseItem.createMany({
      data: [
        {
          courseId,
          position: 1,
          slug: slugify(intro.title),
          type: "MODULE",
          moduleId: intro.id,
        },
        {
          courseId,
          position: 2,
          slug: slugify(core.title),
          type: "MODULE",
          moduleId: core.id,
        },
        {
          courseId,
          position: 3,
          slug: slugify(workshop.title),
          type: "WORKSHOP",
          workshopId: workshop.id,
        },
      ],
    });
  };

  for (const course of courses) {
    await createCourseFlow(course.id, course.title);
  }

  /* ===================== LEARNING PATHS ===================== */
  const dataScientistPath = await prisma.learningPath.create({
    data: {
      title: "Data Scientist Path",
      slug: slugify("Data Scientist Path"),
      description: "Roadmap to become a Data Scientist",
      isPublished: true,
    },
  });

  const backendEngineerPath = await prisma.learningPath.create({
    data: {
      title: "Backend Engineer Path",
      slug: slugify("Backend Engineer Path"),
      description: "Roadmap to become a Backend Engineer",
      isPublished: true,
    },
  });

  await prisma.learningPathItem.createMany({
    data: [
      {
        learningPathId: dataScientistPath.id,
        courseId: courseBySlug[slugify("Python for Data Analysis")].id,
        position: 1,
      },
      {
        learningPathId: dataScientistPath.id,
        courseId: courseBySlug[slugify("SQL for Data Science")].id,
        position: 2,
      },
      {
        learningPathId: dataScientistPath.id,
        courseId: courseBySlug[slugify("Machine Learning Fundamentals")].id,
        position: 3,
      },
      {
        learningPathId: dataScientistPath.id,
        courseId: courseBySlug[slugify("Deep Learning with TensorFlow")].id,
        position: 4,
      },
    ],
  });

  await prisma.learningPathItem.createMany({
    data: [
      {
        learningPathId: backendEngineerPath.id,
        courseId: courseBySlug[slugify("Backend Development with Node.js")].id,
        position: 1,
      },
      {
        learningPathId: backendEngineerPath.id,
        courseId: courseBySlug[slugify("REST API Design")].id,
        position: 2,
      },
      {
        learningPathId: backendEngineerPath.id,
        courseId: courseBySlug[slugify("System Design Basics")].id,
        position: 3,
      },
    ],
  });

  /* ===================== RESOLVE CANONICAL COURSE ===================== */
  const mainCourse = courseBySlug[slugify("Python for Data Analysis")];

  const mainCourseItems = await prisma.courseItem.findMany({
    where: { courseId: mainCourse.id },
    include: { module: true, workshop: true },
    orderBy: { position: "asc" },
  });

  const mainModules = mainCourseItems
    .filter((i) => i.module)
    .map((i) => i.module!);

  const mainWorkshop = mainCourseItems.find((i) => i.workshop)?.workshop!;

  /* ===================== ENROLLMENT ===================== */
  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: mainCourse.id,
      progressPercent: 100,
      status: "COMPLETED",
    },
  });

  /* ===================== MODULE PROGRESS ===================== */
  await prisma.moduleProgress.createMany({
    data: mainModules.map((m) => ({
      userId: student.id,
      moduleId: m.id,
      completedAt: new Date(),
    })),
  });

  /* ===================== WORKSHOP SUBMISSION ===================== */
  await prisma.workshopSubmission.create({
    data: {
      userId: student.id,
      workshopId: mainWorkshop.id,
      submissionUrl: "/submissions/final.zip",
      score: 95,
      feedback: "Excellent analysis",
    },
  });

  /* ===================== REVIEW ===================== */
  await prisma.review.create({
    data: {
      userId: student.id,
      courseId: mainCourse.id,
      rating: 5,
      comment: "Very clear and practical course!",
    },
  });

  await prisma.course.update({
    where: { id: mainCourse.id },
    data: {
      avgRating: 5,
      reviewCount: 1,
    },
  });

  /* ===================== FAVORITE ===================== */
  await prisma.favorite.create({
    data: {
      userId: student.id,
      courseId: mainCourse.id,
    },
  });

  /* ===================== JOB CATEGORY ===================== */
  const jobCategoryNames = [
    "Data & AI",
    "Software Development",
    "IT & Infrastructure",
    "Product Management",
    "Design & Creative",
    "Marketing & Sales",
    "Finance & Accounting",
    "Human Resources",
    "Operations",
    "Customer Support",
  ];

  await prisma.jobCategory.createMany({
    data: jobCategoryNames.map((name) => ({
      name,
      slug: slugify(name),
    })),
  });

  const jobCategories = await prisma.jobCategory.findMany();
  const jobCategoryBySlug = Object.fromEntries(
    jobCategories.map((c) => [c.slug, c]),
  );

  /* ===================== JOB POSTING ===================== */
  const job = await prisma.jobPosting.create({
    data: {
      title: "Junior Data Analyst",
      slug: slugify("Junior Data Analyst"),
      description: "Analyze business data and create reports.",
      location: "Jakarta",
      status: "PUBLISHED",
      type: "FULL_TIME",
      workMode: "HYBRID",
      level: "JUNIOR",
      paycheckMin: 5000000,
      paycheckMax: 7000000,
      categoryId: jobCategoryBySlug[slugify("Data & AI")].id,
      userId: company.id,
    },
  });

  /* ===================== JOB APPLICATION ===================== */
  await prisma.jobApplication.create({
    data: {
      userId: student.id,
      jobId: job.id,
      status: "APPLIED",
    },
  });

  await prisma.jobPosting.update({
    where: { id: job.id },
    data: { applicators: 1 },
  });

  await prisma.profile.update({
    where: { id: companyProfile.id },
    data: {
      totalJobs: 1,
      totalApplicants: 1,
    },
  });

  /* ===================== SKILLS ===================== */
  await prisma.skill.createMany({
    data: [
      { userId: student.id, name: "Python" },
      { userId: student.id, name: "Pandas" },
      { userId: student.id, name: "SQL" },
    ],
  });

  /* ===================== EDUCATION ===================== */
  await prisma.education.createMany({
    data: [
      {
        userId: student.id,
        institution: "University of Indonesia",
        degree: "Bachelor of Science",
        fieldOfStudy: "Statistics",
        startDate: new Date("2018-08-01"),
        endDate: new Date("2022-07-01"),
        description:
          "Focused on data analysis, probability, and statistical modeling.",
      },
      {
        userId: student.id,
        institution: "EduTIA Bootcamp",
        degree: "Professional Certificate",
        fieldOfStudy: "Data Science",
        startDate: new Date("2023-01-01"),
        endDate: new Date("2023-06-01"),
        description: "Hands-on training in Python, SQL, and machine learning.",
      },
    ],
  });

  /* ===================== EXPERIENCE ===================== */
  await prisma.experience.createMany({
    data: [
      {
        userId: student.id,
        jobTitle: "Data Analyst Intern",
        companyName: "Insight Analytics",
        startDate: new Date("2021-06-01"),
        endDate: new Date("2021-12-01"),
      },
      {
        userId: student.id,
        jobTitle: "Junior Data Analyst",
        companyName: "TechCorp Indonesia",
        startDate: new Date("2022-08-01"),
        endDate: null,
      },
    ],
  });

  /* ===================== ADMIN ACTION ===================== */
  await prisma.adminAction.create({
    data: {
      userId: admin.id,
      actionType: "VERIFY_COMPANY",
    },
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
