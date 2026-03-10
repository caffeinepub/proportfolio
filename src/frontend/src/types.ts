export interface SkillWithId {
  id: bigint;
  name: string;
  category: string;
  progress: bigint;
  achieved: boolean;
  achievedDate?: bigint;
}

export interface WorkExperienceWithId {
  id: bigint;
  company: string;
  role: string;
  description: string;
  startDate: bigint;
  endDate?: bigint;
}

export interface EducationWithId {
  id: bigint;
  institution: string;
  degree: string;
  field: string;
  startYear: bigint;
  endYear?: bigint;
}

export interface HobbyWithId {
  id: bigint;
  name: string;
  icon: string;
  description: string;
}
