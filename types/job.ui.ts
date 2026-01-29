import {
  ExperienceLevel,
  JobCategory,
  JobPosting,
  JobType,
  Profile,
} from "@prisma/client";

export type JobUI = JobPosting & {
  category: JobCategory;
  user: {
    profile: Profile | null;
  };
};
