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
import { GraduationCap, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Education } from "../backend.d";
import {
  useAddEducation,
  useRemoveEducation,
  useUpdateEducation,
} from "../hooks/useQueries";
import { SectionWrapper } from "./SectionWrapper";

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

  return (
    <SectionWrapper
      id="education"
      title="Education"
      action={
        isAdmin ? (
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
        ) : undefined
      }
    >
      <div className="space-y-4">
        {education.map((edu, idx) => (
          <div
            key={`${edu.institution}-${idx}`}
            data-ocid={`education.item.${idx + 1}`}
            className="bg-card rounded-xl shadow-card border border-border p-6 hover:shadow-card-hover transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-foreground">
                    {edu.institution}
                  </h3>
                  <p className="text-sm text-primary font-medium">
                    {edu.degree} in {edu.field}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {Number(edu.startYear)} –{" "}
                    {edu.endYear ? Number(edu.endYear) : "Present"}
                  </p>
                </div>
              </div>
              {isAdmin && (
                <div className="flex gap-1 flex-shrink-0">
                  <EducationModal
                    initial={edu}
                    onSave={(e) =>
                      updateEdu.mutate(
                        { id: BigInt(idx), entry: e },
                        {
                          onSuccess: () => toast.success("Education updated"),
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
        ))}
        {education.length === 0 && (
          <div
            data-ocid="education.empty_state"
            className="text-center py-12 text-muted-foreground bg-card rounded-xl border border-dashed border-border"
          >
            <GraduationCap className="h-8 w-8 mx-auto mb-3 opacity-30" />
            <p>No education entries yet.</p>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
