import { products } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      {/* Hero */}
      <section className="mb-12 sm:mb-16">
        <h1 className="text-2xl sm:text-3xl font-light tracking-tight leading-tight">
          <span className="text-[var(--color-accent)]">Greg Girard</span>
          <br />
          <span className="text-[var(--color-text-muted)]">HKG–TYO 1974–2023</span>
        </h1>
        <p className="mt-4 text-sm text-[var(--color-text-muted)] max-w-xl leading-relaxed">
          Exhibition merchandise — photography books and limited edition prints.
          <br />
          展覽周邊商品 — 攝影集及限量版海報。
        </p>
      </section>

      {/* Product Grid */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 sm:gap-y-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
