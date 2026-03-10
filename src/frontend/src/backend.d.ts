import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Skill {
    achieved: boolean;
    achievedDate?: bigint;
    name: string;
    progress: bigint;
    category: string;
}
export interface WorkExperience {
    endDate?: bigint;
    role: string;
    description: string;
    company: string;
    startDate: bigint;
}
export interface Education {
    field: string;
    startYear: bigint;
    endYear?: bigint;
    institution: string;
    degree: string;
}
export interface Portfolio {
    education: Array<Education>;
    workExperience: Array<WorkExperience>;
    skills: Array<Skill>;
    profile: Profile;
    hobbies: Array<Hobby>;
}
export interface Hobby {
    icon: string;
    name: string;
    description: string;
}
export interface Profile {
    bio: string;
    linkedIn: string;
    title: string;
    name: string;
    email: string;
    avatarUrl: string;
    location: string;
    github: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addEducation(entry: Education): Promise<bigint>;
    addHobby(hobby: Hobby): Promise<bigint>;
    addSkill(skill: Skill): Promise<bigint>;
    addWorkExperience(entry: WorkExperience): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    getFullPortfolio(): Promise<Portfolio>;
    isCallerAdmin(): Promise<boolean>;
    markSkillAchieved(id: bigint): Promise<void>;
    removeEducation(id: bigint): Promise<void>;
    removeHobby(id: bigint): Promise<void>;
    removeSkill(id: bigint): Promise<void>;
    removeWorkExperience(id: bigint): Promise<void>;
    updateEducation(id: bigint, entry: Education): Promise<void>;
    updateHobby(id: bigint, hobby: Hobby): Promise<void>;
    updateProfile(profile: Profile): Promise<void>;
    updateSkill(id: bigint, skill: Skill): Promise<void>;
    updateSkillProgress(id: bigint, progress: bigint): Promise<void>;
    updateWorkExperience(id: bigint, entry: WorkExperience): Promise<void>;
}
