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
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { WorkExperience } from "../backend.d";
import {
  useAddWorkExperience,
  useRemoveWorkExperience,
  useUpdateWorkExperience,
} from "../hooks/useQueries";

interface Props {
  experiences: WorkExperience[];
  isAdmin: boolean;
}

const EMPTY_EXP: WorkExperience = {
  company: "",
  role: "",
  description: "",
  startDate: BigInt(new Date().getFullYear()),
  endDate: undefined,
};

function ExperienceModal({
  initial,
  onSave,
  isPending,
  trigger,
  ocidPrefix,
}: {
  initial: WorkExperience;
  onSave: (e: WorkExperience) => void;
  isPending: boolean;
  trigger: React.ReactNode;
  ocidPrefix: string;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<WorkExperience>(initial);

  const handleOpen = (v: boolean) => {
    if (v) setForm(initial);
    setOpen(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent data-ocid={`${ocidPrefix}.dialog`}>
        <DialogHeader>
          <DialogTitle>
            {initial.company ? "Edit Experience" : "Add Experience"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label>Company</Label>
            <Input
              data-ocid={`${ocidPrefix}.company.input`}
              value={form.company}
              onChange={(e) =>
                setForm((p) => ({ ...p, company: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Role / Title</Label>
            <Input
              data-ocid={`${ocidPrefix}.role.input`}
              value={form.role}
              onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Start Year</Label>
              <Input
                type="number"
                data-ocid={`${ocidPrefix}.startdate.input`}
                value={Number(form.startDate)}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    startDate: BigInt(e.target.value || 0),
                  }))
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label>End Year (blank = present)</Label>
              <Input
                type="number"
                data-ocid={`${ocidPrefix}.enddate.input`}
                value={form.endDate ? Number(form.endDate) : ""}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    endDate: e.target.value
                      ? BigInt(e.target.value)
                      : undefined,
                  }))
                }
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Description</Label>
            <Textarea
              rows={4}
              data-ocid={`${ocidPrefix}.description.textarea`}
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
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
            disabled={isPending || !form.company || !form.role}
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

export function ExperienceSection({ experiences, isAdmin }: Props) {
  const addExp = useAddWorkExperience();
  const updateExp = useUpdateWorkExperience();
  const removeExp = useRemoveWorkExperience();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });

  const formatYear = (ts: bigint) => {
    const n = Number(ts);
    if (n > 2100 || n < 1900)
      return new Date(n / 1_000_000).getFullYear().toString();
    return n.toString();
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  };

  return (
    <section id="experience" className="apple-gray">
      <div
        className="max-w-[980px] mx-auto px-6 md:px-12 py-24 md:py-32"
        ref={ref}
      >
        <span className="text-xs font-semibold tracking-[0.18em] uppercase text-foreground/30 mb-4 block">
          Experience
        </span>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex items-end justify-between mb-14"
        >
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-none text-foreground">
            Experience
          </h2>
          {isAdmin && (
            <ExperienceModal
              initial={EMPTY_EXP}
              onSave={(e) =>
                addExp.mutate(e, {
                  onSuccess: () => toast.success("Experience added"),
                  onError: () => toast.error("Failed to add experience"),
                })
              }
              isPending={addExp.isPending}
              ocidPrefix="experience.add"
              trigger={
                <Button
                  size="sm"
                  data-ocid="experience.add.open_modal_button"
                  className="gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" /> Add
                </Button>
              }
            />
          )}
        </motion.div>

        {/* Timeline */}
        <div className="relative pl-8 md:pl-0">
          {experiences.map((exp, idx) => (
            <motion.div
              key={`${exp.company}-${idx}`}
              custom={idx}
              variants={itemVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              data-ocid={`experience.item.${idx + 1}`}
              className="relative md:grid md:grid-cols-[160px_1fr] gap-10 mb-12 last:mb-0"
            >
              {/* Year column */}
              <div className="hidden md:block">
                <span
                  className="font-display font-bold text-4xl leading-none"
                  style={{ color: "oklch(0.82 0 0)" }}
                >
                  {formatYear(exp.startDate)}
                </span>
                <p className="text-xs mt-1" style={{ color: "oklch(0.6 0 0)" }}>
                  – {exp.endDate ? formatYear(exp.endDate) : "Present"}
                </p>
              </div>

              {/* Content */}
              <div className="border-t border-border pt-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display font-bold text-lg text-foreground leading-tight">
                      {exp.role}
                    </h3>
                    <p
                      className="text-sm font-medium mt-0.5"
                      style={{ color: "oklch(0.47 0 0)" }}
                    >
                      {exp.company}
                    </p>
                    <p
                      className="text-xs mt-0.5 md:hidden"
                      style={{ color: "oklch(0.6 0 0)" }}
                    >
                      {formatYear(exp.startDate)} –{" "}
                      {exp.endDate ? formatYear(exp.endDate) : "Present"}
                    </p>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-1 flex-shrink-0">
                      <ExperienceModal
                        initial={exp}
                        onSave={(e) =>
                          updateExp.mutate(
                            { id: BigInt(idx), entry: e },
                            {
                              onSuccess: () =>
                                toast.success("Experience updated"),
                              onError: () => toast.error("Failed to update"),
                            },
                          )
                        }
                        isPending={updateExp.isPending}
                        ocidPrefix={`experience.edit.${idx + 1}`}
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            data-ocid={`experience.edit_button.${idx + 1}`}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        data-ocid={`experience.delete_button.${idx + 1}`}
                        onClick={() =>
                          removeExp.mutate(BigInt(idx), {
                            onSuccess: () =>
                              toast.success("Experience removed"),
                            onError: () => toast.error("Failed to remove"),
                          })
                        }
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
                <p
                  className="mt-3 text-sm leading-relaxed"
                  style={{ color: "oklch(0.47 0 0)" }}
                >
                  {exp.description}
                </p>
              </div>
            </motion.div>
          ))}

          {experiences.length === 0 && (
            <div
              data-ocid="experience.empty_state"
              className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl"
            >
              <p className="text-sm">No work experience added yet.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
