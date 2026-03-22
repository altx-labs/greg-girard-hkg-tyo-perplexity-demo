"use client";

import Image from "next/image";
import { type Product, formatPrice } from "@/lib/products";
import { useCartStore } from "@/lib/cart-store";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      className="group flex flex-col transition-all duration-200"
      style={{
        background: "var(--bg)",
        border: "1px solid var(--border)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = "var(--text-tertiary)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = "var(--border)")
      }
      data-testid={`card-product-${product.id}`}
    >
      {/* Image */}
      <div
        className="relative aspect-[3/4] overflow-hidden"
        style={{ background: "var(--image-placeholder)" }}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
        />
        {product.preorder && (
          <div className="absolute top-2 left-2">
            <span
              className="text-[10px] font-medium tracking-widest uppercase px-2 py-1"
              style={{
                background: "var(--badge-bg)",
                color: "var(--badge-text)",
              }}
            >
              Pre-order
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3 sm:p-4 gap-3">
        <div>
          <p
            className="text-[10px] font-mono tracking-wider mb-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            {product.sku}
          </p>
          <h3 className="text-sm font-medium leading-snug">
            {product.name}
          </h3>
          {product.nameCn && product.nameCn !== product.name && (
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--text-secondary)" }}
            >
              {product.nameCn}
            </p>
          )}
          {product.preorder && product.availableDate && (
            <p
              className="text-xs mt-1"
              style={{ color: "var(--text-tertiary)" }}
            >
              Available {product.availableDate}
            </p>
          )}
        </div>

        <div className="mt-auto">
          <p className="text-sm font-semibold mb-3">
            {formatPrice(product.price)}
          </p>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Qty selector */}
            <div
              className="flex items-center"
              style={{ border: "1px solid var(--border)" }}
            >
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-7 h-8 sm:w-8 flex items-center justify-center text-sm transition-colors"
                style={{ color: "var(--text-secondary)" }}
                aria-label="Decrease quantity"
                data-testid={`button-decrease-${product.id}`}
              >
                −
              </button>
              <span
                className="w-6 sm:w-8 text-center text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => Math.min(product.maxQty, q + 1))}
                className="w-7 h-8 sm:w-8 flex items-center justify-center text-sm transition-colors"
                style={{ color: "var(--text-secondary)" }}
                aria-label="Increase quantity"
                data-testid={`button-increase-${product.id}`}
              >
                +
              </button>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAdd}
              className="flex-1 h-8 text-[10px] sm:text-xs font-medium tracking-wide uppercase transition-all duration-200 whitespace-nowrap px-2"
              style={{
                background: added ? "var(--success)" : "var(--accent)",
                color: "var(--accent-text)",
              }}
              data-testid={`button-add-${product.id}`}
            >
              {added ? "✓" : "Add"}
              <span className="hidden sm:inline">{added ? "" : " to Cart"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
