import type { Portfolio } from "./backend.d";

export const SAMPLE_PORTFOLIO: Portfolio = {
  profile: {
    name: "Alex Morgan",
    title: "Senior Software Engineer",
    location: "San Francisco, CA",
    email: "alex.morgan@example.com",
    linkedIn: "https://linkedin.com/in/alexmorgan",
    github: "https://github.com/alexmorgan",
    bio: "Passionate software engineer with 8+ years of experience building scalable distributed systems and beautiful user interfaces. I thrive at the intersection of cutting-edge technology and human-centered design. Currently focused on decentralized applications and the future of the open web.",
    avatarUrl: "/assets/generated/avatar-alex-morgan.dim_200x200.jpg",
  },
  workExperience: [
    {
      company: "Stripe",
      role: "Senior Software Engineer",
      description:
        "Led the design and implementation of real-time payment processing infrastructure handling 10M+ transactions per day. Reduced latency by 40% through distributed caching architecture. Mentored a team of 5 junior engineers and established code review culture.",
      startDate: 2021n,
      endDate: undefined,
    },
    {
      company: "Airbnb",
      role: "Software Engineer II",
      description:
        "Built core features for the host management dashboard used by 4M+ hosts globally. Redesigned the search ranking algorithm improving conversion by 18%. Contributed to the open-source React Native components library.",
      startDate: 2018n,
      endDate: 2021n,
    },
    {
      company: "YC Startup (Stealth)",
      role: "Full-Stack Engineer",
      description:
        "Founding engineer at a Series A fintech startup. Architected the full-stack platform from scratch using TypeScript, React, and Node.js. Helped scale from 0 to 50,000 users in the first year.",
      startDate: 2016n,
      endDate: 2018n,
    },
  ],
  education: [
    {
      institution: "University of California, Berkeley",
      degree: "B.S.",
      field: "Computer Science",
      startYear: 2012n,
      endYear: 2016n,
    },
    {
      institution: "Stanford Online",
      degree: "Certificate",
      field: "Machine Learning",
      startYear: 2019n,
      endYear: 2020n,
    },
  ],
  skills: [
    {
      name: "TypeScript",
      category: "Languages",
      progress: 95n,
      achieved: true,
      achievedDate: 1672531200000n,
    },
    {
      name: "React",
      category: "Frontend",
      progress: 92n,
      achieved: true,
      achievedDate: 1640995200000n,
    },
    {
      name: "Distributed Systems",
      category: "Backend",
      progress: 85n,
      achieved: true,
      achievedDate: 1704067200000n,
    },
    { name: "Rust", category: "Languages", progress: 60n, achieved: false },
    {
      name: "WebAssembly",
      category: "Platform",
      progress: 45n,
      achieved: false,
    },
    {
      name: "Machine Learning",
      category: "AI/ML",
      progress: 38n,
      achieved: false,
    },
    { name: "Kubernetes", category: "DevOps", progress: 72n, achieved: false },
    {
      name: "GraphQL",
      category: "Backend",
      progress: 80n,
      achieved: true,
      achievedDate: 1656633600000n,
    },
  ],
  hobbies: [
    {
      name: "Rock Climbing",
      icon: "🧗",
      description:
        "Indoor and outdoor bouldering enthusiast. Currently projecting V7 problems at Mission Cliffs.",
    },
    {
      name: "Open Source",
      icon: "💻",
      description:
        "Maintaining several TypeScript libraries and contributing to the React ecosystem in my spare time.",
    },
    {
      name: "Coffee Roasting",
      icon: "☕",
      description:
        "Home roaster experimenting with single-origin beans from Ethiopia and Colombia. Obsessed with the perfect V60 pour.",
    },
    {
      name: "Photography",
      icon: "📷",
      description:
        "Street and landscape photography with a focus on minimalist compositions and natural light.",
    },
    {
      name: "Surfing",
      icon: "🏄",
      description:
        "Weekend warrior at Ocean Beach. Chasing the perfect San Francisco winter swell.",
    },
  ],
};
