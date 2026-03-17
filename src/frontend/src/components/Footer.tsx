export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const utm = `utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="border-t border-border bg-muted mt-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-center text-sm text-muted-foreground">
          © {year}. Built with <span className="text-primary">♥</span> using{" "}
          <a
            href={`https://caffeine.ai?${utm}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
