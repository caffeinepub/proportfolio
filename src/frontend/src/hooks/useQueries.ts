import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Education,
  Hobby,
  Profile,
  Skill,
  WorkExperience,
} from "../backend.d";
import { SAMPLE_PORTFOLIO } from "../sampleData";
import { useActor } from "./useActor";

export function usePortfolio() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["portfolio"],
    queryFn: async () => {
      if (!actor) return SAMPLE_PORTFOLIO;
      try {
        const portfolio = await actor.getFullPortfolio();
        const isEmpty =
          portfolio.workExperience.length === 0 &&
          portfolio.skills.length === 0 &&
          portfolio.hobbies.length === 0;
        return isEmpty ? SAMPLE_PORTFOLIO : portfolio;
      } catch {
        return SAMPLE_PORTFOLIO;
      }
    },
    enabled: !isFetching,
    staleTime: 30_000,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch {
        return false;
      }
    },
    enabled: !isFetching,
    staleTime: 60_000,
  });
}

export function useUpdateProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (profile: Profile) => actor!.updateProfile(profile),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["portfolio"] }),
  });
}

export function useAddWorkExperience() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (entry: WorkExperience) => actor!.addWorkExperience(entry),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["portfolio"] }),
  });
}

export function useUpdateWorkExperience() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, entry }: { id: bigint; entry: WorkExperience }) =>
      actor!.updateWorkExperience(id, entry),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["portfolio"] }),
  });
}

export function useRemoveWorkExperience() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => actor!.removeWorkExperience(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["portfolio"] }),
  });
}

export function useAddEducation() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (entry: Education) => actor!.addEducation(entry),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["portfolio"] }),
  });
}

export function useUpdateEducation() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, entry }: { id: bigint; entry: Education }) =>
      actor!.updateEducation(id, entry),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["portfolio"] }),
  });
}

export function useRemoveEducation() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => actor!.removeEducation(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["portfolio"] }),
  });
}

export function useAddSkill() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (skill: Skill) => actor!.addSkill(skill),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["portfolio"] }),
  });
}

export function useUpdateSkill() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, skill }: { id: bigint; skill: Skill }) =>
      actor!.updateSkill(id, skill),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["portfolio"] }),
  });
}

export function useUpdateSkillProgress() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, progress }: { id: bigint; progress: bigint }) =>
      actor!.updateSkillProgress(id, progress),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["portfolio"] }),
  });
}

export function useMarkSkillAchieved() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => actor!.markSkillAchieved(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["portfolio"] }),
  });
}

export function useRemoveSkill() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => actor!.removeSkill(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["portfolio"] }),
  });
}

export function useAddHobby() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (hobby: Hobby) => actor!.addHobby(hobby),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["portfolio"] }),
  });
}

export function useUpdateHobby() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, hobby }: { id: bigint; hobby: Hobby }) =>
      actor!.updateHobby(id, hobby),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["portfolio"] }),
  });
}

export function useRemoveHobby() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => actor!.removeHobby(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["portfolio"] }),
  });
}
