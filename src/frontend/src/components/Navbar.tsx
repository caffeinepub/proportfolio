import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User } from "lucide-react";
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-200 ${
        scrolled ? "shadow-[0_1px_0_0_rgba(0,0,0,0.08)]" : ""
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            data-ocid="nav.link"
            className="font-semibold text-lg text-foreground hover:text-primary transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            {profileName || "Portfolio"}
          </button>

          <nav className="hidden md:flex items-center gap-0">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-ocid={`nav.${link.label.toLowerCase()}.link`}
                className={`px-3 py-4 text-sm font-medium transition-colors border-b-2 ${
                  activeSection === link.href.slice(1)
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground hover:border-border"
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
                  className="gap-1.5 text-sm"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={login}
                disabled={isLoggingIn}
                data-ocid="nav.login.button"
                className="gap-1.5 text-sm"
              >
                <LogIn className="h-3.5 w-3.5" />
                {isLoggingIn ? "Signing in..." : "Sign In"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
