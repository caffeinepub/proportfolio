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
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { Education } from "../backend.d";
import {
  useAddEducation,
  useRemoveEducation,
  useUpdateEducation,
} from "../hooks/useQueries";

interface Props {
  education: Education[];
  isAdmin: boolean;
}

const EMPTY_EDU: Education = {
  institution: "",
  degree: "",
  field: "",
  startYear: BigInt(new Date().getFullYear() - 4),
  endYear: BigInt(new Date().getFullYear()),
};

function EducationModal({
  initial,
  onSave,
  isPending,
  trigger,
  ocidPrefix,
}: {
  initial: Education;
  onSave: (e: Education) => void;
  isPending: boolean;
  trigger: React.ReactNode;
  ocidPrefix: string;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Education>(initial);

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
          <DialogTitle>
            {initial.institution ? "Edit Education" : "Add Education"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label>Institution</Label>
            <Input
              data-ocid={`${ocidPrefix}.institution.input`}
              value={form.institution}
              onChange={(e) =>
                setForm((p) => ({ ...p, institution: e.target.value }))
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Degree</Label>
              <Input
                data-ocid={`${ocidPrefix}.degree.input`}
                value={form.degree}
                onChange={(e) =>
                  setForm((p) => ({ ...p, degree: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Field of Study</Label>
              <Input
                data-ocid={`${ocidPrefix}.field.input`}
                value={form.field}
                onChange={(e) =>
                  setForm((p) => ({ ...p, field: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Start Year</Label>
              <Input
                type="number"
                data-ocid={`${ocidPrefix}.startyear.input`}
                value={Number(form.startYear)}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    startYear: BigInt(e.target.value || 0),
                  }))
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label>End Year (blank = ongoing)</Label>
              <Input
                type="number"
                data-ocid={`${ocidPrefix}.endyear.input`}
                value={form.endYear ? Number(form.endYear) : ""}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    endYear: e.target.value
                      ? BigInt(e.target.value)
                      : undefined,
                  }))
                }
              />
            </div>
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
            disabled={isPending || !form.institution}
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

export function EducationSection({ education, isAdmin }: Props) {
  const addEdu = useAddEducation();
  const updateEdu = useUpdateEducation();
  const removeEdu = useRemoveEducation();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.1,
        ease: "easeOut",
      },
    }),
  };

  return (
    <section id="education" className="apple-light">
      <div
        className="max-w-[980px] mx-auto px-6 md:px-12 py-24 md:py-32"
        ref={ref}
      >
        <span className="text-xs font-semibold tracking-[0.18em] uppercase text-foreground/30 mb-4 block">
          Education
        </span>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex items-end justify-between mb-14"
        >
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-none text-foreground">
            Education
          </h2>
          {isAdmin && (
            <EducationModal
              initial={EMPTY_EDU}
              onSave={(e) =>
                addEdu.mutate(e, {
                  onSuccess: () => toast.success("Education added"),
                  onError: () => toast.error("Failed to add"),
                })
              }
              isPending={addEdu.isPending}
              ocidPrefix="education.add"
              trigger={
                <Button
                  size="sm"
                  data-ocid="education.add.open_modal_button"
                  className="gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" /> Add
                </Button>
              }
            />
          )}
        </motion.div>

        <div className="space-y-0">
          {education.map((edu, idx) => (
            <motion.div
              key={`${edu.institution}-${idx}`}
              custom={idx}
              variants={itemVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              data-ocid={`education.item.${idx + 1}`}
              className="relative md:grid md:grid-cols-[160px_1fr] gap-10 mb-12 last:mb-0"
            >
              {/* Year column */}
              <div className="hidden md:block">
                <span
                  className="font-display font-bold text-4xl leading-none"
                  style={{ color: "oklch(0.82 0 0)" }}
                >
                  {Number(edu.startYear)}
                </span>
                <p className="text-xs mt-1" style={{ color: "oklch(0.6 0 0)" }}>
                  – {edu.endYear ? Number(edu.endYear) : "Present"}
                </p>
              </div>

              {/* Content */}
              <div className="border-t border-border pt-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display font-bold text-lg text-foreground leading-tight">
                      {edu.institution}
                    </h3>
                    <p
                      className="text-sm font-medium mt-0.5"
                      style={{ color: "oklch(0.47 0 0)" }}
                    >
                      {edu.degree} in {edu.field}
                    </p>
                    <p
                      className="text-xs mt-0.5 md:hidden"
                      style={{ color: "oklch(0.6 0 0)" }}
                    >
                      {Number(edu.startYear)} –{" "}
                      {edu.endYear ? Number(edu.endYear) : "Present"}
                    </p>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-1 flex-shrink-0">
                      <EducationModal
                        initial={edu}
                        onSave={(e) =>
                          updateEdu.mutate(
                            { id: BigInt(idx), entry: e },
                            {
                              onSuccess: () =>
                                toast.success("Education updated"),
                              onError: () => toast.error("Failed to update"),
                            },
                          )
                        }
                        isPending={updateEdu.isPending}
                        ocidPrefix={`education.edit.${idx + 1}`}
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            data-ocid={`education.edit_button.${idx + 1}`}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        data-ocid={`education.delete_button.${idx + 1}`}
                        onClick={() =>
                          removeEdu.mutate(BigInt(idx), {
                            onSuccess: () => toast.success("Education removed"),
                            onError: () => toast.error("Failed to remove"),
                          })
                        }
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {education.length === 0 && (
            <div
              data-ocid="education.empty_state"
              className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl"
            >
              <p className="text-sm">No education entries yet.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
