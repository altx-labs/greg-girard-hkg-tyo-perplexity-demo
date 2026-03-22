"use client";

import { CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { useCartStore } from "@/lib/cart-store";

export default function SuccessPage() {
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <div className="flex justify-center mb-6">
        <CheckCircle
          size={48}
          strokeWidth={1}
          className="text-[var(--color-success)]"
        />
      </div>
      <h1 className="text-xl font-medium mb-3">Order Confirmed</h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-2 leading-relaxed">
        Thank you for your purchase. You will receive a confirmation email
        shortly.
      </p>
      <p className="text-sm text-[var(--color-text-muted)] mb-8 leading-relaxed">
        感謝您的購買。您將很快收到確認電郵。
      </p>
      <a
        href="/"
        className="inline-block px-6 py-2.5 text-sm font-medium border border-[var(--color-border)] rounded hover:border-[var(--color-text-faint)] transition-colors"
        data-testid="link-back-to-store"
      >
        Back to Store
      </a>
    </div>
  );
}
