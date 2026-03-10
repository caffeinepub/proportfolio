import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Loader2, Pencil, Plus, Star, Trash2, Trophy, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Skill } from "../backend.d";
import {
  useAddSkill,
  useMarkSkillAchieved,
  useRemoveSkill,
  useUpdateSkill,
} from "../hooks/useQueries";
import { SectionWrapper } from "./SectionWrapper";

interface Props {
  skills: Skill[];
  isAdmin: boolean;
}

const EMPTY_SKILL: Skill = {
  name: "",
  category: "",
  progress: 0n,
  achieved: false,
};

const CATEGORY_COLORS: Record<string, string> = {
  Languages: "bg-primary/10 text-primary border-primary/20",
  Frontend: "bg-accent/10 text-accent border-accent/20",
  Backend: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  DevOps: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  "AI/ML": "bg-destructive/10 text-destructive border-destructive/20",
  Platform:
    "bg-secondary-foreground/10 text-secondary-foreground border-secondary-foreground/20",
};

function getCategoryStyle(category: string) {
  return (
    CATEGORY_COLORS[category] ?? "bg-muted text-muted-foreground border-border"
  );
}

function getProgressBarClass(achieved: boolean) {
  if (achieved) return "skill-progress-bar-achieved";
  return "skill-progress-bar";
}

function formatAchievedDate(ts: bigint): string {
  const n = Number(ts);
  if (n > 2100 || n < 1900) {
    return new Date(n).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  }
  return n.toString();
}

function SkillModal({
  initial,
  onSave,
  isPending,
  trigger,
  ocidPrefix,
}: {
  initial: Skill;
  onSave: (s: Skill) => void;
  isPending: boolean;
  trigger: React.ReactNode;
  ocidPrefix: string;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Skill>(initial);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (v) setForm(initial);
        setOpen(v);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent data-ocid={`${ocidPrefix}.dialog`}>
        <DialogHeader>
          <DialogTitle>{initial.name ? "Edit Skill" : "Add Skill"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label>Skill Name</Label>
            <Input
              data-ocid={`${ocidPrefix}.name.input`}
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Category</Label>
            <Input
              data-ocid={`${ocidPrefix}.category.input`}
              value={form.category}
              onChange={(e) =>
                setForm((p) => ({ ...p, category: e.target.value }))
              }
              placeholder="e.g. Languages, Frontend, Backend"
            />
          </div>
          <div className="grid gap-2">
            <Label>Progress: {Number(form.progress)}%</Label>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[Number(form.progress)]}
              onValueChange={([v]) =>
                setForm((p) => ({ ...p, progress: BigInt(v) }))
              }
              data-ocid={`${ocidPrefix}.progress.input`}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            data-ocid={`${ocidPrefix}.cancel_button`}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave(form);
              setOpen(false);
            }}
            disabled={isPending || !form.name}
            data-ocid={`${ocidPrefix}.save_button`}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function SkillsSection({ skills, isAdmin }: Props) {
  const addSkill = useAddSkill();
  const updateSkill = useUpdateSkill();
  const markAchieved = useMarkSkillAchieved();
  const removeSkill = useRemoveSkill();

  return (
    <SectionWrapper
      id="skills"
      title="Skills"
      action={
        isAdmin ? (
          <SkillModal
            initial={EMPTY_SKILL}
            onSave={(s) =>
              addSkill.mutate(s, {
                onSuccess: () => toast.success("Skill added"),
                onError: () => toast.error("Failed to add skill"),
              })
            }
            isPending={addSkill.isPending}
            ocidPrefix="skills.add"
            trigger={
              <Button
                size="sm"
                data-ocid="skills.add.open_modal_button"
                className="gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" /> Add Skill
              </Button>
            }
          />
        ) : undefined
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill, idx) => {
          const progress = Number(skill.progress);
          return (
            <motion.div
              key={`${skill.name}-${idx}`}
              data-ocid={`skills.item.${idx + 1}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`bg-card rounded-xl shadow-card border p-4 hover:shadow-card-hover transition-shadow ${
                skill.achieved ? "border-amber-200" : "border-border"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-sm text-foreground">
                      {skill.name}
                    </h3>
                    {skill.achieved && (
                      <Trophy className="h-3.5 w-3.5 gold-badge flex-shrink-0" />
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs mt-1 ${getCategoryStyle(skill.category)}`}
                  >
                    {skill.category}
                  </Badge>
                </div>
                {isAdmin && (
                  <div className="flex gap-0.5 flex-shrink-0">
                    <SkillModal
                      initial={skill}
                      onSave={(s) =>
                        updateSkill.mutate(
                          { id: BigInt(idx), skill: s },
                          {
                            onSuccess: () => toast.success("Skill updated"),
                            onError: () => toast.error("Failed to update"),
                          },
                        )
                      }
                      isPending={updateSkill.isPending}
                      ocidPrefix={`skills.edit.${idx + 1}`}
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          data-ocid={`skills.edit_button.${idx + 1}`}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive hover:text-destructive"
                      data-ocid={`skills.delete_button.${idx + 1}`}
                      onClick={() =>
                        removeSkill.mutate(BigInt(idx), {
                          onSuccess: () => toast.success("Skill removed"),
                          onError: () => toast.error("Failed to remove"),
                        })
                      }
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="mt-2">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-muted-foreground">
                    Progress
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    {progress}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${getProgressBarClass(skill.achieved)}`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${progress}%` }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.8,
                      delay: idx * 0.05,
                      ease: "easeOut",
                    }}
                  />
                </div>
              </div>

              {skill.achieved ? (
                <div className="mt-3 flex items-center gap-1.5 gold-bg rounded-lg px-2 py-1 border">
                  <Star className="h-3 w-3 gold-badge fill-current" />
                  <span className="text-xs font-medium gold-badge">
                    Achieved
                    {skill.achievedDate
                      ? ` · ${formatAchievedDate(skill.achievedDate)}`
                      : ""}
                  </span>
                </div>
              ) : isAdmin ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full h-7 text-xs gap-1.5"
                  data-ocid={`skills.achieve_button.${idx + 1}`}
                  onClick={() =>
                    markAchieved.mutate(BigInt(idx), {
                      onSuccess: () =>
                        toast.success(`🏆 ${skill.name} marked as achieved!`),
                      onError: () => toast.error("Failed to mark as achieved"),
                    })
                  }
                >
                  <Zap className="h-3 w-3" /> Mark Achieved
                </Button>
              ) : null}
            </motion.div>
          );
        })}
        {skills.length === 0 && (
          <div
            data-ocid="skills.empty_state"
            className="col-span-full text-center py-12 text-muted-foreground bg-card rounded-xl border border-dashed border-border"
          >
            <Trophy className="h-8 w-8 mx-auto mb-3 opacity-30" />
            <p>No skills added yet.</p>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
