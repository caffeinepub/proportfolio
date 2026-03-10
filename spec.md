# ProPortfolio

## Current State
A LinkedIn-style portfolio site with a card-based layout, standard navbar, profile header, and sections for about, experience, education, skills, and hobbies. Uses light blue color scheme, soft shadows, and basic fade-in animations.

## Requested Changes (Diff)

### Add
- Apple-style full-bleed hero section with large cinematic headline and scroll-triggered fade-in
- Scroll-driven section reveals using IntersectionObserver (opacity + translateY, like apple.com product pages)
- Sticky text pinning effects within sections as user scrolls
- Parallax background movement on hero
- Smooth horizontal scroll reveal for skills/hobbies cards
- Section-to-section transitions with alternating dark/light backgrounds (like Apple product pages)
- Large bold typographic numbers/stats with scroll-triggered count-up

### Modify
- Navbar: full-width translucent frosted glass with blur, minimal links, no border until scrolled -- Apple-style
- Color palette: near-black (#000 / #1d1d1f) for hero + dark sections, pure white for light sections -- Apple-style high contrast
- Typography: very large display sizes (text-7xl+) for section headlines, thin/light weight subheadings
- Profile header: replace card with full-bleed cinematic dark hero with name as giant headline
- About section: two-column split with large pull-quote text on left, body on right (Apple-style editorial)
- Experience section: timeline-style with large year markers, horizontal rule separators
- Skills section: large number display with animated progress arcs rather than bars
- Hobbies section: full-width dark card grid with hover scale effects
- Footer: minimal centered Apple-style footer with small gray legal-style text

### Remove
- Card-based section wrappers with border/shadow boxes
- Gold badge color scheme
- Blue primary color accent throughout
- Rounded-2xl card wrapping all sections

## Implementation Plan
1. Update index.css with new Apple-inspired color tokens: near-black, white, gray-mid -- OKLCH values; add scroll animation utilities
2. Rebuild App.tsx with full-bleed section layout, remove max-width card containers
3. Rebuild Navbar with Apple frosted glass style, hide border until scrolled
4. Rebuild ProfileHeader as full-bleed dark cinematic hero with parallax
5. Rebuild AboutSection as editorial two-column with large pull quote
6. Rebuild ExperienceSection as vertical timeline with large year markers
7. Rebuild SkillsSection with circular arc progress and large number display
8. Rebuild HobbiesSection as full-bleed dark grid with hover effects
9. Add useScrollReveal hook for scroll-triggered animations on all sections
10. Add SectionWrapper with IntersectionObserver-based reveal animation
