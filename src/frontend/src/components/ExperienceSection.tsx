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
import { Briefcase, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { WorkExperience } from "../backend.d";
import {
  useAddWorkExperience,
  useRemoveWorkExperience,
  useUpdateWorkExperience,
} from "../hooks/useQueries";
import { SectionWrapper } from "./SectionWrapper";

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

  const formatYear = (ts: bigint) => {
    const n = Number(ts);
    if (n > 2100 || n < 1900) {
      return new Date(n / 1_000_000).getFullYear().toString();
    }
    return n.toString();
  };

  return (
    <SectionWrapper
      id="experience"
      title="Experience"
      action={
        isAdmin ? (
          <ExperienceModal
            initial={EMPTY_EXP}
            onSave={(e) => {
              addExp.mutate(e, {
                onSuccess: () => toast.success("Experience added"),
                onError: () => toast.error("Failed to add experience"),
              });
            }}
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
        ) : undefined
      }
    >
      <div className="space-y-4">
        {experiences.map((exp, idx) => (
          <div
            key={`${exp.company}-${idx}`}
            data-ocid={`experience.item.${idx + 1}`}
            className="bg-card rounded-xl shadow-card border border-border p-6 hover:shadow-card-hover transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-foreground">
                    {exp.role}
                  </h3>
                  <p className="text-primary font-semibold text-sm">
                    {exp.company}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatYear(exp.startDate)} –{" "}
                    {exp.endDate ? formatYear(exp.endDate) : "Present"}
                  </p>
                </div>
              </div>
              {isAdmin && (
                <div className="flex gap-1 flex-shrink-0">
                  <ExperienceModal
                    initial={exp}
                    onSave={(e) =>
                      updateExp.mutate(
                        { id: BigInt(idx), entry: e },
                        {
                          onSuccess: () => toast.success("Experience updated"),
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
                        onSuccess: () => toast.success("Experience removed"),
                        onError: () => toast.error("Failed to remove"),
                      })
                    }
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed ml-14">
              {exp.description}
            </p>
          </div>
        ))}
        {experiences.length === 0 && (
          <div
            data-ocid="experience.empty_state"
            className="text-center py-12 text-muted-foreground bg-card rounded-xl border border-dashed border-border"
          >
            <Briefcase className="h-8 w-8 mx-auto mb-3 opacity-30" />
            <p>No work experience added yet.</p>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
