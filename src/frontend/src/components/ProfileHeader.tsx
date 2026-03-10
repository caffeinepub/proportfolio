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
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
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
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax: background moves up slower than scroll
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

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
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center"
      style={{ backgroundColor: "oklch(0.11 0 0)" }}
    >
      {/* Subtle radial gradient background */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 40%, oklch(0.22 0 0), transparent 70%)",
            position: "absolute",
            inset: 0,
          }}
        />
        <div
          style={{
            background:
              "radial-gradient(ellipse 40% 40% at 20% 80%, oklch(0.18 0 0 / 0.5), transparent)",
            position: "absolute",
            inset: 0,
          }}
        />
      </motion.div>

      {/* Admin edit button — floating top right */}
      {isAdmin && (
        <div className="absolute top-20 right-6 z-10">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                data-ocid="profile.edit_button"
                className="gap-1.5 text-white/50 hover:text-white hover:bg-white/10 text-xs"
                onClick={() => setForm(profile)}
              >
                <Pencil className="h-3 w-3" />
                Edit
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
                      setForm((prev) => ({ ...prev, bio: e.target.value }))
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
        </div>
      )}

      {/* Main hero content */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Avatar className="h-28 w-28 md:h-36 md:w-36 ring-1 ring-white/20 mx-auto mb-8">
            <AvatarImage src={profile.avatarUrl} alt={profile.name} />
            <AvatarFallback
              style={{ backgroundColor: "oklch(0.22 0 0)", color: "white" }}
              className="text-3xl font-display font-bold"
            >
              {initials}
            </AvatarFallback>
          </Avatar>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.1,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="font-display font-bold text-white text-5xl md:text-7xl lg:text-8xl tracking-tight leading-none mb-4"
        >
          {profile.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.22,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="text-xl md:text-2xl font-body font-light mb-8"
          style={{ color: "oklch(0.65 0 0)" }}
        >
          {profile.title}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.35,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="flex flex-wrap items-center justify-center gap-3 mt-2"
        >
          {profile.location && (
            <span
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border"
              style={{
                color: "oklch(0.65 0 0)",
                borderColor: "oklch(0.28 0 0)",
                backgroundColor: "oklch(0.16 0 0)",
              }}
            >
              <MapPin className="h-3.5 w-3.5" />
              {profile.location}
            </span>
          )}
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              data-ocid="profile.email.link"
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border transition-colors"
              style={{
                color: "oklch(0.75 0 0)",
                borderColor: "oklch(0.28 0 0)",
                backgroundColor: "oklch(0.16 0 0)",
              }}
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
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border transition-colors"
              style={{
                color: "oklch(0.75 0 0)",
                borderColor: "oklch(0.28 0 0)",
                backgroundColor: "oklch(0.16 0 0)",
              }}
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
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border transition-colors"
              style={{
                color: "oklch(0.75 0 0)",
                borderColor: "oklch(0.28 0 0)",
                backgroundColor: "oklch(0.16 0 0)",
              }}
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
          )}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 2,
            ease: "easeInOut",
          }}
          className="w-px h-12"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.5 0 0), transparent)",
          }}
        />
      </motion.div>
    </section>
  );
}
