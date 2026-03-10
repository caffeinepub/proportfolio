import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Skills", href: "#skills" },
  { label: "Hobbies", href: "#hobbies" },
];

export function Navbar({ profileName }: { profileName: string }) {
  const { login, clear, identity, isLoggingIn } = useInternetIdentity();
  const [scrolled, setScrolled] = useState(false);
  const [isHero, setIsHero] = useState(true);
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      // Hero section is roughly 100vh
      setIsHero(window.scrollY < window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );
    const sections = document.querySelectorAll("section[id]");
    for (const s of sections) observer.observe(s);
    return () => observer.disconnect();
  }, []);

  const isDark = isHero && !scrolled;

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? isHero
            ? "apple-nav-dark-scrolled"
            : "apple-nav-scrolled"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[980px] mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            data-ocid="nav.link"
            className={`font-display font-semibold text-sm transition-colors cursor-pointer bg-transparent border-none p-0 ${
              isDark
                ? "text-white/90 hover:text-white"
                : "text-foreground hover:text-foreground/70"
            }`}
          >
            {profileName || "Portfolio"}
          </button>

          {/* Center links */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-ocid={`nav.${link.label.toLowerCase()}.link`}
                className={`text-xs font-medium tracking-wide transition-colors ${
                  activeSection === link.href.slice(1)
                    ? isDark
                      ? "text-white"
                      : "text-foreground"
                    : isDark
                      ? "text-white/60 hover:text-white/90"
                      : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-2">
            {identity ? (
              <div className="flex items-center gap-2">
                <span
                  className={`hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${
                    isDark
                      ? "text-white/50 bg-white/10"
                      : "text-muted-foreground bg-muted"
                  }`}
                >
                  <User className="h-3 w-3" />
                  <span className="max-w-[100px] truncate">
                    {identity.getPrincipal().toString().slice(0, 8)}…
                  </span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clear}
                  data-ocid="nav.logout.button"
                  className={`gap-1.5 text-xs h-7 ${
                    isDark
                      ? "text-white/70 hover:text-white hover:bg-white/10"
                      : ""
                  }`}
                >
                  <LogOut className="h-3 w-3" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={login}
                disabled={isLoggingIn}
                data-ocid="nav.login.button"
                className={`gap-1.5 text-xs h-7 rounded-full px-4 ${
                  isDark
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-foreground text-background hover:bg-foreground/90"
                }`}
              >
                <LogIn className="h-3 w-3" />
                {isLoggingIn ? "Signing in…" : "Sign In"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
