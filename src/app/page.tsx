import { products } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { CartDrawer } from "@/components/cart-drawer";
import { Footer } from "@/components/footer";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const posters = products.filter((p) => p.category === "poster");
  const books = products.filter((p) => p.category === "book");

  return (
    <main className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text-primary)" }}>
      {/* Cart button (fixed top-right) */}
      <CartDrawer />

      {/* Header */}
      <header
        className="px-6 py-8 md:px-12 lg:px-16"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <p
                className="text-xs font-medium tracking-[0.2em] uppercase mb-3"
                style={{ color: "var(--text-tertiary)" }}
              >
                WKM Gallery
              </p>
              <h1 className="text-2xl md:text-3xl font-light tracking-tight leading-tight">
                Greg Girard
                <span
                  className="block text-xl md:text-2xl mt-0.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  HKG–TYO 1974–2023
                </span>
              </h1>
              <p
                className="mt-4 text-sm max-w-xl leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Exhibition merchandise — limited edition poster and photography
                books. Pre-order items ship upon availability.
              </p>
              <p
                className="mt-2 text-xs"
                style={{ color: "var(--text-tertiary)" }}
              >
                格雷格．吉拉德：HKG–TYO 1974–2023 展覽周邊商品
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16 py-12">
        {/* Poster section */}
        {posters.length > 0 && (
          <section className="mb-14">
            <h2
              className="text-xs font-medium tracking-[0.2em] uppercase mb-6 pb-3"
              style={{
                color: "var(--text-tertiary)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              Poster
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {posters.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Books section */}
        {books.length > 0 && (
          <section>
            <h2
              className="text-xs font-medium tracking-[0.2em] uppercase mb-6 pb-3"
              style={{
                color: "var(--text-tertiary)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              Photography Books
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {books.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
