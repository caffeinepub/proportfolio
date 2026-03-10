import { SectionWrapper } from "./SectionWrapper";

interface Props {
  bio: string;
}

export function AboutSection({ bio }: Props) {
  return (
    <SectionWrapper id="about" title="About">
      <div className="bg-card rounded-xl shadow-card border border-border p-6">
        <p className="text-foreground leading-relaxed text-base">{bio}</p>
      </div>
    </SectionWrapper>
  );
}
