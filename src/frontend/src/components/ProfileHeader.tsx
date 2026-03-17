import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Github, Linkedin, Loader2, Mail, MapPin, Pencil } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Profile } from "../backend.d";
import { useUpdateProfile } from "../hooks/useQueries";

interface Props {
  profile: Profile;
  isAdmin: boolean;
}

export function ProfileHeader({ profile, isAdmin }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Profile>(profile);
  const updateProfile = useUpdateProfile();

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync(form);
      toast.success("Profile updated successfully");
      setOpen(false);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <section className="pt-16 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-card rounded-lg shadow-card border border-border overflow-hidden"
        >
          {/* Cover Banner — flat neutral strip */}
          <div className="h-24 sm:h-32 bg-muted" />

          <div className="px-6 pb-6 flex flex-col items-center text-center">
            <div className="flex flex-col items-center gap-3 -mt-10 sm:-mt-14">
              {/* Avatar */}
              <Avatar className="h-20 w-20 sm:h-28 sm:w-28 ring-4 ring-card shadow-sm flex-shrink-0">
                <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                <AvatarFallback className="bg-secondary text-foreground text-2xl font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              {isAdmin && (
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      data-ocid="profile.edit_button"
                      className="gap-1.5"
                      onClick={() => setForm(profile)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className="max-w-lg max-h-[90vh] overflow-y-auto"
                    data-ocid="profile.dialog"
                  >
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-2">
                      {(
                        [
                          ["name", "Full Name", "text"],
                          ["title", "Professional Title", "text"],
                          ["location", "Location", "text"],
                          ["email", "Email", "email"],
                          ["linkedIn", "LinkedIn URL", "url"],
                          ["github", "GitHub URL", "url"],
                          ["avatarUrl", "Avatar URL", "url"],
                        ] as const
                      ).map(([field, label, type]) => (
                        <div key={field} className="grid gap-1.5">
                          <Label htmlFor={`profile-${field}`}>{label}</Label>
                          <Input
                            id={`profile-${field}`}
                            type={type}
                            data-ocid={`profile.${field}.input`}
                            value={(form as any)[field] as string}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                [field]: e.target.value,
                              }))
                            }
                          />
                        </div>
                      ))}
                      <div className="grid gap-1.5">
                        <Label htmlFor="profile-bio">Bio</Label>
                        <Textarea
                          id="profile-bio"
                          data-ocid="profile.bio.textarea"
                          rows={4}
                          value={form.bio}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              bio: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        data-ocid="profile.cancel_button"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={updateProfile.isPending}
                        data-ocid="profile.save_button"
                      >
                        {updateProfile.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <div className="mt-4 flex flex-col items-center">
              <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
                {profile.name}
              </h1>
              <p className="text-muted-foreground font-medium mt-1 text-sm">
                {profile.title}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
                {profile.location && (
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {profile.location}
                  </span>
                )}
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    data-ocid="profile.email.link"
                    className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    {profile.email}
                  </a>
                )}
                {profile.linkedIn && (
                  <a
                    href={profile.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ocid="profile.linkedin.link"
                    className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                  >
                    <Linkedin className="h-3.5 w-3.5" />
                    LinkedIn
                  </a>
                )}
                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ocid="profile.github.link"
                    className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                  >
                    <Github className="h-3.5 w-3.5" />
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
