export function Footer() {
  return (
    <footer
      className="px-6 py-8 md:px-12 lg:px-16 mt-16"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            © WKM Gallery · All prices in Hong Kong Dollars (HKD)
          </p>
          <p
            className="text-xs mt-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            Credit card payment accepted · Pre-order items ship upon
            availability
          </p>
        </div>
        <div className="text-xs text-right space-y-1">
          <p style={{ color: "var(--text-tertiary)" }}>
            Secure checkout powered by Stripe
          </p>
          <a
            href="https://www.perplexity.ai/computer"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:opacity-70"
            style={{ color: "var(--text-faint)" }}
          >
            Created with Perplexity Computer
          </a>
        </div>
      </div>
    </footer>
  );
}
