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
import type { Hobby } from "../backend.d";
import {
  useAddHobby,
  useRemoveHobby,
  useUpdateHobby,
} from "../hooks/useQueries";

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
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });

  const itemVariants: any = {
    hidden: { opacity: 0, y: 24, scale: 0.96 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: i * 0.08,
        ease: "easeOut",
      },
    }),
  };

  return (
    <section id="hobbies" className="apple-light">
      <div
        className="max-w-[980px] mx-auto px-6 md:px-12 py-24 md:py-32"
        ref={ref}
      >
        <span className="text-xs font-semibold tracking-[0.18em] uppercase text-foreground/30 mb-4 block">
          Hobbies
        </span>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex items-end justify-between mb-14"
        >
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-none text-foreground">
            Interests
          </h2>
          {isAdmin && (
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
          )}
        </motion.div>

        {/* Desktop grid */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-4">
          {hobbies.map((hobby, idx) => (
            <motion.div
              key={`${hobby.name}-${idx}`}
              custom={idx}
              variants={itemVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              data-ocid={`hobbies.item.${idx + 1}`}
              className="rounded-2xl p-6 group relative cursor-default"
              style={{ backgroundColor: "oklch(0.11 0 0)" }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 20px 60px 0 rgba(0,0,0,0.3)",
                transition: { duration: 0.2 },
              }}
            >
              {isAdmin && (
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                        className="h-7 w-7 text-white/40 hover:text-white hover:bg-white/10"
                        data-ocid={`hobbies.edit_button.${idx + 1}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    }
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white/40 hover:text-destructive hover:bg-white/10"
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
              <div className="text-4xl mb-4" role="img" aria-label={hobby.name}>
                {hobby.icon}
              </div>
              <h3 className="font-display font-bold text-base text-white mb-2">
                {hobby.name}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "oklch(0.5 0 0)" }}
              >
                {hobby.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Mobile snap scroll */}
        <div className="sm:hidden snap-x-container">
          {hobbies.map((hobby, idx) => (
            <motion.div
              key={`${hobby.name}-mobile-${idx}`}
              data-ocid={`hobbies.item.${idx + 1}`}
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="snap-x-item rounded-2xl p-6 relative"
              style={{ backgroundColor: "oklch(0.11 0 0)" }}
            >
              <div className="text-4xl mb-4" role="img" aria-label={hobby.name}>
                {hobby.icon}
              </div>
              <h3 className="font-display font-bold text-base text-white mb-2">
                {hobby.name}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "oklch(0.5 0 0)" }}
              >
                {hobby.description}
              </p>
            </motion.div>
          ))}
        </div>

        {hobbies.length === 0 && (
          <div
            data-ocid="hobbies.empty_state"
            className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl"
          >
            <p className="text-sm">No hobbies added yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
