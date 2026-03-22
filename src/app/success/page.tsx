"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/cart-store";
import Link from "next/link";

export default function SuccessPage() {
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "var(--bg)", color: "var(--text-primary)" }}
    >
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "var(--accent)" }}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: "var(--accent-text)" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-light mb-3">Order Confirmed</h1>
        <p
          className="text-sm leading-relaxed mb-2"
          style={{ color: "var(--text-secondary)" }}
        >
          Thank you for your order. A confirmation email has been sent to you.
        </p>
        <p
          className="text-xs mb-8"
          style={{ color: "var(--text-tertiary)" }}
        >
          感謝您的訂購。確認電郵已發送至您的電子郵件地址。
        </p>

        <div
          className="p-4 mb-8 text-left"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
          }}
        >
          <p
            className="text-xs leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            <strong style={{ color: "var(--text-primary)" }}>
              Pre-order items
            </strong>{" "}
            will ship once available. In-stock items and the exhibition poster
            will be processed promptly. You will receive shipping notifications
            via email.
          </p>
        </div>

        <Link
          href="/"
          className="inline-block px-8 py-3 text-sm font-medium tracking-wide uppercase transition-colors"
          style={{
            background: "var(--accent)",
            color: "var(--accent-text)",
          }}
          data-testid="link-back-to-store"
        >
          Back to Store
        </Link>

        <p
          className="mt-6 text-xs"
          style={{ color: "var(--text-tertiary)" }}
        >
          WKM Gallery · Greg Girard: HKG–TYO 1974–2023
        </p>
      </div>
    </main>
  );
}
