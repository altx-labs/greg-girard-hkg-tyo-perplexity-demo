"use client";

import Image from "next/image";
import { Plus, Check } from "lucide-react";
import { type Product, formatPrice } from "@/lib/products";
import { useCartStore } from "@/lib/cart-store";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const inCart = items.find((i) => i.product.id === product.id);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    if (inCart && inCart.quantity >= product.maxQty) return;
    addItem(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div
      className="group flex flex-col"
      data-testid={`card-product-${product.id}`}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-[var(--color-surface)]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />

        {/* Pre-order badge */}
        {product.status === "preorder" && (
          <div className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-medium tracking-wider uppercase bg-[var(--color-bg)]/80 backdrop-blur-sm rounded-sm text-[var(--color-accent)]">
            Pre-order · {product.availableDate}
          </div>
        )}

        {/* Add to cart overlay */}
        <button
          onClick={handleAdd}
          disabled={inCart !== undefined && inCart.quantity >= product.maxQty}
          className="absolute bottom-3 right-3 w-9 h-9 flex items-center justify-center rounded-full
            bg-[var(--color-accent)] text-[var(--color-bg)] 
            opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0
            transition-all duration-300
            hover:bg-[var(--color-accent-hover)]
            disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={`Add ${product.name} to cart`}
          data-testid={`button-add-${product.id}`}
        >
          {justAdded ? <Check size={16} strokeWidth={2} /> : <Plus size={16} strokeWidth={2} />}
        </button>
      </div>

      {/* Info */}
      <div className="mt-3 flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium leading-snug text-[var(--color-text)]">
            {product.name}
          </h3>
        </div>
        {product.nameCn !== product.name && (
          <p className="text-xs text-[var(--color-text-muted)]">
            {product.nameCn}
          </p>
        )}
        <p className="text-sm font-medium text-[var(--color-accent)] mt-0.5">
          {formatPrice(product.price)}
        </p>
        <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-faint)]">
          {product.sku}
        </p>
      </div>
    </div>
  );
}
