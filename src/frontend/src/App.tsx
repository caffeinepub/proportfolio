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
      className="min-h-screen apple-dark flex items-center justify-center"
      data-ocid="app.loading_state"
    >
      <div className="flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-white/10 animate-pulse" />
        <div className="space-y-3 text-center">
          <div className="h-8 w-48 bg-white/10 rounded-full animate-pulse mx-auto" />
          <div className="h-4 w-32 bg-white/10 rounded-full animate-pulse mx-auto" />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { data: portfolio, isLoading } = usePortfolio();
  const { data: isAdmin = false } = useIsAdmin();

  const displayPortfolio = portfolio ?? SAMPLE_PORTFOLIO;

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <LoadingSkeleton />
        <Toaster richColors position="bottom-right" />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar profileName={displayPortfolio.profile.name} />

      <main>
        {/* Hero — dark */}
        <ProfileHeader profile={displayPortfolio.profile} isAdmin={isAdmin} />

        {/* About — white */}
        <AboutSection bio={displayPortfolio.profile.bio} />

        {/* Experience — light gray */}
        <ExperienceSection
          experiences={displayPortfolio.workExperience}
          isAdmin={isAdmin}
        />

        {/* Education — white */}
        <EducationSection
          education={displayPortfolio.education}
          isAdmin={isAdmin}
        />

        {/* Skills — dark */}
        <SkillsSection skills={displayPortfolio.skills} isAdmin={isAdmin} />

        {/* Hobbies — white */}
        <HobbiesSection hobbies={displayPortfolio.hobbies} isAdmin={isAdmin} />
      </main>

      <Footer />
      <Toaster richColors position="bottom-right" />
    </div>
  );
}
