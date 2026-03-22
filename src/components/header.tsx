"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useState } from "react";
import { CartDrawer } from "./cart-drawer";

export function Header() {
  const itemCount = useCartStore((s) => s.getItemCount());
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex flex-col leading-tight">
            <span className="text-sm font-medium tracking-widest uppercase text-[var(--color-accent)]">
              Greg Girard
            </span>
            <span className="text-[11px] tracking-wide text-[var(--color-text-muted)]">
              HKG–TYO 1974–2023
            </span>
          </a>

          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            aria-label="Open cart"
            data-testid="button-open-cart"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 flex items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-bg)] text-[10px] font-semibold">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
