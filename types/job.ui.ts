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

export const EXPERIENCE_LEVEL_LABELS: Record<ExperienceLevel, string> = {
  JUNIOR: "Junior",
  MID: "Mid",
  SENIOR: "Senior",
  LEAD: "Lead",
};

export const TYPE_LABELS: Record<JobType, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACT: "Contract",
  FREELANCE: "Freelance",
  INTERNSHIP: "Internship",
};
