"use client";

import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice, deliveryOptions } from "@/lib/products";

export function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const getTotal = useCartStore((s) => s.getTotal);
  const getItemCount = useCartStore((s) => s.getItemCount);
  const customerInfo = useCartStore((s) => s.customerInfo);
  const setCustomerInfo = useCartStore((s) => s.setCustomerInfo);

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"cart" | "info" | "confirm">("cart");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const drawerRef = useRef<HTMLDivElement>(null);

  const itemCount = getItemCount();
  const subtotal = getTotal();

  const deliveryOption = deliveryOptions.find(
    (d) => d.id === customerInfo.deliveryMethod
  );
  const deliveryPrice = deliveryOption?.price ?? 0;
  const total = subtotal + deliveryPrice;

  const hasBooks = items.some((i) => i.product.category === "book");

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setStep("cart");
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const validateInfo = () => {
    const newErrors: Record<string, string> = {};
    if (!customerInfo.email.trim() || !/\S+@\S+\.\S+/.test(customerInfo.email))
      newErrors.email = "Valid email required";
    if (!customerInfo.fullName.trim()) newErrors.fullName = "Name required";
    if (!customerInfo.phone.trim()) newErrors.phone = "Phone required";
    if (
      customerInfo.deliveryMethod !== "pickup" &&
      !customerInfo.shippingAddress.trim()
    )
      newErrors.shippingAddress = "Address required for delivery";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async () => {
    if (!validateInfo()) return;
    setIsCheckingOut(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
          })),
          customerInfo,
          deliveryMethod: customerInfo.deliveryMethod,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Checkout failed. Please try again.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      {/* Cart toggle button — fixed top-right */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 right-4 z-40 flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors"
        style={{
          background: "var(--accent)",
          color: "var(--accent-text)",
        }}
        aria-label="Open cart"
        data-testid="button-open-cart"
      >
        <span>Cart</span>
        {itemCount > 0 && (
          <span
            className="text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
            style={{
              background: "var(--accent-text)",
              color: "var(--accent)",
            }}
          >
            {itemCount}
          </span>
        )}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 backdrop-blur-sm"
          style={{ background: "var(--overlay)" }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-full max-w-md z-50 shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          background: "var(--bg)",
          borderLeft: "1px solid var(--border)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <h2 className="text-base font-semibold">
            Your Order{itemCount > 0 && ` (${itemCount})`}
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="text-xl leading-none transition-colors"
            style={{ color: "var(--text-tertiary)" }}
            aria-label="Close cart"
            data-testid="button-close-cart"
          >
            ×
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                Your cart is empty.
              </p>
              <button
                onClick={() => setOpen(false)}
                className="mt-4 text-xs underline underline-offset-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Continue browsing
              </button>
            </div>
          ) : step === "cart" ? (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.product.id}
                  className="flex gap-3 pb-4"
                  style={{ borderBottom: "1px solid var(--border-light)" }}
                  data-testid={`cart-item-${item.product.id}`}
                >
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs font-mono"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {item.product.sku}
                    </p>
                    <p className="text-sm font-medium leading-snug truncate">
                      {item.product.name}
                    </p>
                    {item.product.preorder && (
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        Pre-order · {item.product.availableDate}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <div
                        className="flex items-center"
                        style={{ border: "1px solid var(--border)" }}
                      >
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="w-7 h-7 flex items-center justify-center text-sm"
                          style={{ color: "var(--text-secondary)" }}
                          data-testid={`button-cart-decrease-${item.product.id}`}
                        >
                          −
                        </button>
                        <span className="w-7 text-center text-xs font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="w-7 h-7 flex items-center justify-center text-sm"
                          style={{ color: "var(--text-secondary)" }}
                          disabled={item.quantity >= item.product.maxQty}
                          data-testid={`button-cart-increase-${item.product.id}`}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-xs transition-colors hover:opacity-70"
                        style={{ color: "var(--text-tertiary)" }}
                        data-testid={`button-remove-${item.product.id}`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                    {item.quantity > 1 && (
                      <p
                        className="text-xs"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        {formatPrice(item.product.price)} each
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : step === "info" ? (
            <div className="space-y-4">
              <InputField
                label="Email"
                type="email"
                value={customerInfo.email}
                onChange={(v) => setCustomerInfo({ email: v })}
                error={errors.email}
                testId="input-email"
              />
              <InputField
                label="Full Name 姓名"
                value={customerInfo.fullName}
                onChange={(v) => setCustomerInfo({ fullName: v })}
                error={errors.fullName}
                testId="input-name"
              />
              <InputField
                label="Phone 電話號碼"
                type="tel"
                value={customerInfo.phone}
                onChange={(v) => setCustomerInfo({ phone: v })}
                error={errors.phone}
                testId="input-phone"
              />

              {customerInfo.deliveryMethod !== "pickup" && (
                <InputField
                  label="Shipping Address 送貨地址"
                  value={customerInfo.shippingAddress}
                  onChange={(v) => setCustomerInfo({ shippingAddress: v })}
                  error={errors.shippingAddress}
                  testId="input-address"
                />
              )}

              <div>
                <label
                  className="block text-xs font-medium uppercase tracking-wider mb-1.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Remarks 備註
                </label>
                <textarea
                  value={customerInfo.remarks}
                  onChange={(e) =>
                    setCustomerInfo({ remarks: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 text-sm focus:outline-none transition-colors resize-none"
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                  data-testid="input-remarks"
                />
              </div>
            </div>
          ) : (
            /* Confirm step */
            <div className="space-y-4">
              <div className="text-xs space-y-2" style={{ color: "var(--text-secondary)" }}>
                <p>
                  <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                    {customerInfo.fullName}
                  </span>
                </p>
                <p>{customerInfo.email}</p>
                <p>{customerInfo.phone}</p>
                {customerInfo.deliveryMethod !== "pickup" && (
                  <p>{customerInfo.shippingAddress}</p>
                )}
                <p style={{ color: "var(--text-primary)" }}>
                  {deliveryOption?.label} — {deliveryOption?.description}
                </p>
              </div>
              <div className="pt-4 space-y-2" style={{ borderTop: "1px solid var(--border)" }}>
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {item.product.name} × {item.quantity}
                    </span>
                    <span>{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            className="px-6 py-4 space-y-4"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            {/* Delivery method selector — show on cart step */}
            {step === "cart" && (
              <div>
                <label
                  className="text-xs font-medium uppercase tracking-wider block mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Delivery Method
                </label>
                <div className="space-y-1.5">
                  {deliveryOptions
                    .filter((d) => !d.bookOnly || hasBooks)
                    .map((opt) => (
                      <label
                        key={opt.id}
                        className="flex items-center justify-between px-3 py-2 cursor-pointer transition-colors"
                        style={{
                          border:
                            customerInfo.deliveryMethod === opt.id
                              ? "1px solid var(--accent)"
                              : "1px solid var(--border)",
                          background:
                            customerInfo.deliveryMethod === opt.id
                              ? "var(--bg-surface)"
                              : "transparent",
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="shipping"
                            value={opt.id}
                            checked={customerInfo.deliveryMethod === opt.id}
                            onChange={() =>
                              setCustomerInfo({ deliveryMethod: opt.id })
                            }
                            className="sr-only"
                          />
                          <span className="text-xs" style={{ color: "var(--text-primary)" }}>
                            {opt.label}
                          </span>
                        </div>
                        <span className="text-xs font-medium">
                          {opt.price === 0 ? "Free" : formatPrice(opt.price)}
                        </span>
                      </label>
                    ))}
                </div>
              </div>
            )}

            {/* Totals */}
            <div
              className="space-y-1.5 pt-2"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <div
                className="flex justify-between text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div
                className="flex justify-between text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                <span>Shipping</span>
                <span>
                  {deliveryPrice === 0 ? "Free" : formatPrice(deliveryPrice)}
                </span>
              </div>
              <div
                className="flex justify-between text-base font-semibold pt-1.5"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              {step !== "cart" && (
                <button
                  onClick={() =>
                    setStep(step === "confirm" ? "info" : "cart")
                  }
                  className="flex-1 py-2.5 text-sm font-medium transition-colors"
                  style={{
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                  data-testid="button-back"
                >
                  Back
                </button>
              )}
              <button
                onClick={() => {
                  if (step === "cart") setStep("info");
                  else if (step === "info") {
                    if (validateInfo()) setStep("confirm");
                  } else handleCheckout();
                }}
                disabled={isCheckingOut}
                className="flex-1 py-2.5 text-sm font-medium tracking-wide uppercase transition-all duration-200 disabled:opacity-50"
                style={{
                  background: "var(--accent)",
                  color: "var(--accent-text)",
                }}
                data-testid="button-checkout"
              >
                {step === "cart" && "Checkout"}
                {step === "info" && "Review Order"}
                {step === "confirm" &&
                  (isCheckingOut ? "Processing..." : "Pay with Stripe")}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function InputField({
  label,
  type = "text",
  value,
  onChange,
  error,
  testId,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  testId: string;
}) {
  return (
    <div>
      <label
        className="block text-xs font-medium uppercase tracking-wider mb-1.5"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm focus:outline-none transition-colors"
        style={{
          background: "var(--bg-surface)",
          border: error
            ? "1px solid #ef4444"
            : "1px solid var(--border)",
          color: "var(--text-primary)",
        }}
        data-testid={testId}
      />
      {error && (
        <p className="text-[10px] mt-1" style={{ color: "#ef4444" }}>
          {error}
        </p>
      )}
    </div>
  );
}
