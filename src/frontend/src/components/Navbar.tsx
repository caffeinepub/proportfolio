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
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );
    const sections = document.querySelectorAll("section[id]");
    for (const s of sections) observer.observe(s);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-card/95 backdrop-blur-sm shadow-card border-b border-border"
          : "bg-card/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            data-ocid="nav.link"
            className="font-display font-bold text-xl text-primary hover:opacity-80 transition-opacity cursor-pointer bg-transparent border-none p-0"
          >
            {profileName || "Portfolio"}
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-ocid={`nav.${link.label.toLowerCase()}.link`}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === link.href.slice(1)
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {identity ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  <User className="h-3 w-3" />
                  <span className="max-w-[120px] truncate">
                    {identity.getPrincipal().toString().slice(0, 8)}...
                  </span>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clear}
                  data-ocid="nav.logout.button"
                  className="gap-1.5"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={login}
                disabled={isLoggingIn}
                data-ocid="nav.login.button"
                className="gap-1.5"
              >
                <LogIn className="h-3.5 w-3.5" />
                {isLoggingIn ? "Signing in..." : "Sign In"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
