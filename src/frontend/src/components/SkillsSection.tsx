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
import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Skill } from "../backend.d";
import {
  useAddSkill,
  useMarkSkillAchieved,
  useRemoveSkill,
  useUpdateSkill,
} from "../hooks/useQueries";

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

// SVG Arc progress indicator
function ArcProgress({
  progress,
  achieved,
}: { progress: number; achieved: boolean }) {
  const r = 42;
  const circ = 2 * Math.PI * r;
  const ref = useRef<SVGCircleElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true });
  const offset = circ - (progress / 100) * circ;

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center"
      style={{ width: 104, height: 104 }}
    >
      <svg
        width="104"
        height="104"
        viewBox="0 0 104 104"
        role="img"
        aria-label={`Progress: ${progress}%`}
        className="-rotate-90"
      >
        {/* Track */}
        <circle
          cx="52"
          cy="52"
          r={r}
          fill="none"
          strokeWidth="4"
          stroke="oklch(0.25 0 0)"
        />
        {/* Progress arc */}
        <circle
          ref={ref}
          cx="52"
          cy="52"
          r={r}
          fill="none"
          strokeWidth="4"
          stroke={achieved ? "oklch(0.78 0.15 85)" : "oklch(0.88 0 0)"}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={inView ? offset : circ}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-bold text-xl text-white leading-none">
          {progress}
        </span>
        <span className="text-xs" style={{ color: "oklch(0.5 0 0)" }}>
          %
        </span>
      </div>
    </div>
  );
}

// Count-up hook
function useCountUp(target: number, active: boolean, duration = 1200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, active, duration]);

  return count;
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

export function SkillsSection({ skills, isAdmin }: Props) {
  const addSkill = useAddSkill();
  const updateSkill = useUpdateSkill();
  const markAchieved = useMarkSkillAchieved();
  const removeSkill = useRemoveSkill();
  const statsRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true });
  const sectionInView = useInView(sectionRef, {
    once: true,
    margin: "-8% 0px",
  });

  const totalSkills = skills.length;
  const masteredCount = skills.filter((s) => s.achieved).length;
  const inProgressCount = skills.filter(
    (s) => !s.achieved && Number(s.progress) > 0 && Number(s.progress) < 100,
  ).length;

  const countTotal = useCountUp(totalSkills, statsInView);
  const countMastered = useCountUp(masteredCount, statsInView);
  const countInProgress = useCountUp(inProgressCount, statsInView);

  const itemVariants: any = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.08,
        ease: "easeOut",
      },
    }),
  };

  return (
    <section id="skills" className="apple-dark">
      <div
        className="max-w-[980px] mx-auto px-6 md:px-12 py-24 md:py-32"
        ref={sectionRef}
      >
        <span className="text-xs font-semibold tracking-[0.18em] uppercase text-white/30 mb-4 block">
          Skills
        </span>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex items-end justify-between mb-14"
        >
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-none text-white">
            Skills
          </h2>
          {isAdmin && (
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
                  className="gap-1.5 bg-white text-black hover:bg-white/90"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Skill
                </Button>
              }
            />
          )}
        </motion.div>

        {/* Stats row */}
        <div
          ref={statsRef}
          className="grid grid-cols-3 gap-4 md:gap-8 mb-16 pb-14"
          style={{ borderBottom: "1px solid oklch(0.25 0 0)" }}
        >
          {[
            {
              label: "Total Skills",
              value: String(countTotal).padStart(2, "0"),
            },
            {
              label: "Mastered",
              value: String(countMastered).padStart(2, "0"),
            },
            {
              label: "In Progress",
              value: String(countInProgress).padStart(2, "0"),
            },
          ].map(({ label, value }) => (
            <div key={label} className="text-center md:text-left">
              <div
                className="font-display font-bold text-5xl md:text-7xl leading-none tracking-tight"
                style={{ color: "oklch(0.88 0 0)" }}
              >
                {value}
              </div>
              <p
                className="text-xs mt-2 tracking-widest uppercase"
                style={{ color: "oklch(0.47 0 0)" }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Skills grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill, idx) => {
            const progress = Number(skill.progress);
            return (
              <motion.div
                key={`${skill.name}-${idx}`}
                custom={idx}
                variants={itemVariants}
                initial="hidden"
                animate={sectionInView ? "visible" : "hidden"}
                data-ocid={`skills.item.${idx + 1}`}
                className="relative rounded-2xl p-5 group"
                style={{ backgroundColor: "oklch(0.16 0 0)" }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                {/* Admin controls */}
                {isAdmin && (
                  <div className="absolute top-3 right-3 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
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
                          className="h-6 w-6 text-white/40 hover:text-white hover:bg-white/10"
                          data-ocid={`skills.edit_button.${idx + 1}`}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-white/40 hover:text-destructive hover:bg-white/10"
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

                {/* Arc + info */}
                <div className="flex items-start gap-4">
                  <ArcProgress progress={progress} achieved={skill.achieved} />
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-display font-bold text-sm text-white leading-tight">
                        {skill.name}
                      </h3>
                      {skill.achieved && (
                        <Trophy className="h-3.5 w-3.5 flex-shrink-0 gold-badge" />
                      )}
                    </div>
                    <p
                      className="text-xs mt-1"
                      style={{ color: "oklch(0.5 0 0)" }}
                    >
                      {skill.category}
                    </p>
                    {skill.achieved ? (
                      <div className="mt-3 flex items-center gap-1.5 gold-bg rounded-md px-2 py-1 border">
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
                        variant="ghost"
                        size="sm"
                        className="mt-3 w-full h-7 text-xs gap-1.5 text-white/50 hover:text-white hover:bg-white/10 border border-white/10"
                        data-ocid={`skills.achieve_button.${idx + 1}`}
                        onClick={() =>
                          markAchieved.mutate(BigInt(idx), {
                            onSuccess: () =>
                              toast.success(
                                `🏆 ${skill.name} marked as achieved!`,
                              ),
                            onError: () =>
                              toast.error("Failed to mark as achieved"),
                          })
                        }
                      >
                        <Zap className="h-3 w-3" /> Mark Achieved
                      </Button>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {skills.length === 0 && (
            <div
              data-ocid="skills.empty_state"
              className="col-span-full text-center py-16"
              style={{ color: "oklch(0.4 0 0)" }}
            >
              <Trophy className="h-8 w-8 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No skills added yet.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
