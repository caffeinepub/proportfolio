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
import { Heart, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Hobby } from "../backend.d";
import {
  useAddHobby,
  useRemoveHobby,
  useUpdateHobby,
} from "../hooks/useQueries";
import { SectionWrapper } from "./SectionWrapper";

interface Props {
  hobbies: Hobby[];
  isAdmin: boolean;
}

const EMPTY_HOBBY: Hobby = { name: "", icon: "✨", description: "" };

function HobbyModal({
  initial,
  onSave,
  isPending,
  trigger,
  ocidPrefix,
}: {
  initial: Hobby;
  onSave: (h: Hobby) => void;
  isPending: boolean;
  trigger: React.ReactNode;
  ocidPrefix: string;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Hobby>(initial);

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
          <DialogTitle>{initial.name ? "Edit Hobby" : "Add Hobby"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-3 gap-3">
            <div className="grid gap-1.5">
              <Label>Icon (emoji)</Label>
              <Input
                data-ocid={`${ocidPrefix}.icon.input`}
                value={form.icon}
                onChange={(e) =>
                  setForm((p) => ({ ...p, icon: e.target.value }))
                }
                className="text-center text-lg"
              />
            </div>
            <div className="col-span-2 grid gap-1.5">
              <Label>Name</Label>
              <Input
                data-ocid={`${ocidPrefix}.name.input`}
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Description</Label>
            <Textarea
              rows={3}
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

export function HobbiesSection({ hobbies, isAdmin }: Props) {
  const addHobby = useAddHobby();
  const updateHobby = useUpdateHobby();
  const removeHobby = useRemoveHobby();

  return (
    <SectionWrapper
      id="hobbies"
      title="Hobbies & Interests"
      action={
        isAdmin ? (
          <HobbyModal
            initial={EMPTY_HOBBY}
            onSave={(h) =>
              addHobby.mutate(h, {
                onSuccess: () => toast.success("Hobby added"),
                onError: () => toast.error("Failed to add hobby"),
              })
            }
            isPending={addHobby.isPending}
            ocidPrefix="hobbies.add"
            trigger={
              <Button
                size="sm"
                data-ocid="hobbies.add.open_modal_button"
                className="gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </Button>
            }
          />
        ) : undefined
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {hobbies.map((hobby, idx) => (
          <motion.div
            key={`${hobby.name}-${idx}`}
            data-ocid={`hobbies.item.${idx + 1}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.07 }}
            className="bg-card rounded-xl shadow-card border border-border p-5 hover:shadow-card-hover transition-shadow group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl" role="img" aria-label={hobby.name}>
                  {hobby.icon}
                </span>
                <h3 className="font-display font-bold text-foreground">
                  {hobby.name}
                </h3>
              </div>
              {isAdmin && (
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <HobbyModal
                    initial={hobby}
                    onSave={(h) =>
                      updateHobby.mutate(
                        { id: BigInt(idx), hobby: h },
                        {
                          onSuccess: () => toast.success("Hobby updated"),
                          onError: () => toast.error("Failed to update"),
                        },
                      )
                    }
                    isPending={updateHobby.isPending}
                    ocidPrefix={`hobbies.edit.${idx + 1}`}
                    trigger={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        data-ocid={`hobbies.edit_button.${idx + 1}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    }
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    data-ocid={`hobbies.delete_button.${idx + 1}`}
                    onClick={() =>
                      removeHobby.mutate(BigInt(idx), {
                        onSuccess: () => toast.success("Hobby removed"),
                        onError: () => toast.error("Failed to remove"),
                      })
                    }
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {hobby.description}
            </p>
          </motion.div>
        ))}
        {hobbies.length === 0 && (
          <div
            data-ocid="hobbies.empty_state"
            className="col-span-full text-center py-12 text-muted-foreground bg-card rounded-xl border border-dashed border-border"
          >
            <Heart className="h-8 w-8 mx-auto mb-3 opacity-30" />
            <p>No hobbies added yet.</p>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
