export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--color-text-muted)]">
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
          <span>Greg Girard: HKG–TYO 1974–2023</span>
          <span className="hidden sm:inline">·</span>
          <span>WKM Gallery</span>
        </div>
        <a
          href="https://www.perplexity.ai/computer"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--color-text-faint)] transition-colors"
        >
          Created with Perplexity Computer
        </a>
      </div>
    </footer>
  );
}
