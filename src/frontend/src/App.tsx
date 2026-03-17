import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { AboutSection } from "./components/AboutSection";
import { EducationSection } from "./components/EducationSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { Footer } from "./components/Footer";
import { HobbiesSection } from "./components/HobbiesSection";
import { Navbar } from "./components/Navbar";
import { ProfileHeader } from "./components/ProfileHeader";
import { SkillsSection } from "./components/SkillsSection";
import { useIsAdmin, usePortfolio } from "./hooks/useQueries";
import { SAMPLE_PORTFOLIO } from "./sampleData";

function LoadingSkeleton() {
  return (
    <div
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 space-y-4"
      data-ocid="app.loading_state"
    >
      <div className="bg-card rounded-lg border border-border overflow-hidden shadow-card">
        <Skeleton className="h-32 w-full" />
        <div className="p-6 space-y-3">
          <Skeleton className="h-10 w-10 rounded-full -mt-8" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-card rounded-lg border border-border p-6 space-y-3 shadow-card"
        >
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const { data: portfolio, isLoading } = usePortfolio();
  const { data: isAdmin = false } = useIsAdmin();

  const displayPortfolio = portfolio ?? SAMPLE_PORTFOLIO;

  return (
    <div className="min-h-screen bg-background">
      <Navbar profileName={displayPortfolio.profile.name} />

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <main>
          <ProfileHeader profile={displayPortfolio.profile} isAdmin={isAdmin} />

          <div className="space-y-0 divide-y divide-border">
            <AboutSection bio={displayPortfolio.profile.bio} />

            <ExperienceSection
              experiences={displayPortfolio.workExperience}
              isAdmin={isAdmin}
            />

            <EducationSection
              education={displayPortfolio.education}
              isAdmin={isAdmin}
            />

            <SkillsSection skills={displayPortfolio.skills} isAdmin={isAdmin} />

            <HobbiesSection
              hobbies={displayPortfolio.hobbies}
              isAdmin={isAdmin}
            />
          </div>
        </main>
      )}

      <Footer />
      <Toaster richColors position="bottom-right" />
    </div>
  );
}
