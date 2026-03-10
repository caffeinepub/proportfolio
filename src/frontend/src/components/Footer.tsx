export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const utm = `utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer style={{ backgroundColor: "oklch(0.11 0 0)" }}>
      <div
        className="max-w-[980px] mx-auto px-6 md:px-12 py-10"
        style={{ borderTop: "1px solid oklch(0.2 0 0)" }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: "oklch(0.4 0 0)" }}>
            © {year} ProPortfolio. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "oklch(0.4 0 0)" }}>
            Built with <span style={{ color: "oklch(0.6 0 0)" }}>♥</span> using{" "}
            <a
              href={`https://caffeine.ai?${utm}`}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
              style={{ color: "oklch(0.65 0 0)" }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
