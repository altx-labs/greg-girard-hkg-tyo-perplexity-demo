"use client";

import { X, Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice, deliveryOptions } from "@/lib/products";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const getTotal = useCartStore((s) => s.getTotal);
  const customerInfo = useCartStore((s) => s.customerInfo);
  const setCustomerInfo = useCartStore((s) => s.setCustomerInfo);
  const [step, setStep] = useState<"cart" | "info" | "confirm">("cart");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const drawerRef = useRef<HTMLDivElement>(null);

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

  const deliveryOption = deliveryOptions.find(
    (d) => d.id === customerInfo.deliveryMethod
  );
  const deliveryPrice = deliveryOption?.price ?? 0;
  const subtotal = getTotal();
  const total = subtotal + deliveryPrice;

  const hasBooks = items.some((i) => i.product.category === "book");

  const validateInfo = () => {
    const newErrors: Record<string, string> = {};
    if (!customerInfo.email.trim() || !/\S+@\S+\.\S+/.test(customerInfo.email))
      newErrors.email = "Valid email required";
    if (!customerInfo.fullName.trim())
      newErrors.fullName = "Name required";
    if (!customerInfo.phone.trim())
      newErrors.phone = "Phone required";
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[var(--color-bg)] border-l border-[var(--color-border)] flex flex-col animate-slide-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <h2 className="text-sm font-medium tracking-wider uppercase">
            {step === "cart" && "Cart"}
            {step === "info" && "Your Details"}
            {step === "confirm" && "Confirm Order"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            data-testid="button-close-cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <p className="text-sm text-[var(--color-text-muted)] mb-1">
                Your cart is empty
              </p>
              <p className="text-xs text-[var(--color-text-faint)]">
                Browse the collection to add items
              </p>
            </div>
          ) : step === "cart" ? (
            <div className="divide-y divide-[var(--color-border)]">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-5"
                  data-testid={`cart-item-${item.product.id}`}
                >
                  <div className="relative w-16 h-20 rounded-sm overflow-hidden shrink-0 bg-[var(--color-surface)]">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium leading-snug truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-[var(--color-accent)] mt-0.5">
                      {formatPrice(item.product.price)}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="w-6 h-6 flex items-center justify-center rounded border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-text-faint)] transition-colors"
                        data-testid={`button-decrease-${item.product.id}`}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm w-5 text-center font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.product.maxQty}
                        className="w-6 h-6 flex items-center justify-center rounded border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-text-faint)] transition-colors disabled:opacity-30"
                        data-testid={`button-increase-${item.product.id}`}
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="ml-auto p-1 text-[var(--color-text-faint)] hover:text-[var(--color-error)] transition-colors"
                        data-testid={`button-remove-${item.product.id}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : step === "info" ? (
            <div className="p-5 space-y-4">
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

              <div>
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-2 uppercase tracking-wider">
                  Delivery 送貨方式
                </label>
                <div className="space-y-2">
                  {deliveryOptions
                    .filter((d) => !d.bookOnly || hasBooks)
                    .map((option) => (
                      <label
                        key={option.id}
                        className={`flex items-center gap-3 p-3 rounded border cursor-pointer transition-colors ${
                          customerInfo.deliveryMethod === option.id
                            ? "border-[var(--color-accent)] bg-[var(--color-accent-muted)]"
                            : "border-[var(--color-border)] hover:border-[var(--color-text-faint)]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="delivery"
                          value={option.id}
                          checked={customerInfo.deliveryMethod === option.id}
                          onChange={(e) =>
                            setCustomerInfo({
                              deliveryMethod: e.target.value,
                            })
                          }
                          className="accent-[var(--color-accent)]"
                        />
                        <div className="flex-1 flex items-center justify-between">
                          <span className="text-sm">
                            {option.label}{" "}
                            <span className="text-[var(--color-text-muted)]">
                              {option.labelCn}
                            </span>
                          </span>
                          <span className="text-xs font-medium text-[var(--color-accent)]">
                            {option.description}
                          </span>
                        </div>
                      </label>
                    ))}
                </div>
              </div>

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
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">
                  Remarks 備註
                </label>
                <textarea
                  value={customerInfo.remarks}
                  onChange={(e) =>
                    setCustomerInfo({ remarks: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded focus:border-[var(--color-accent)] focus:outline-none transition-colors resize-none"
                  data-testid="input-remarks"
                />
              </div>
            </div>
          ) : (
            /* Confirm step */
            <div className="p-5 space-y-4">
              <div className="text-xs text-[var(--color-text-muted)] space-y-2">
                <p>
                  <span className="font-medium text-[var(--color-text)]">
                    {customerInfo.fullName}
                  </span>
                </p>
                <p>{customerInfo.email}</p>
                <p>{customerInfo.phone}</p>
                {customerInfo.deliveryMethod !== "pickup" && (
                  <p>{customerInfo.shippingAddress}</p>
                )}
                <p className="text-[var(--color-accent)]">
                  {deliveryOption?.label} — {deliveryOption?.description}
                </p>
              </div>
              <div className="border-t border-[var(--color-border)] pt-4 space-y-2">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="text-[var(--color-accent)]">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[var(--color-border)] p-5 space-y-3">
            {step !== "cart" && deliveryPrice > 0 && (
              <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
                <span>Delivery</span>
                <span>{formatPrice(deliveryPrice)}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                {step === "cart" ? "Subtotal" : "Total"}
              </span>
              <span className="text-base font-medium text-[var(--color-accent)]">
                {formatPrice(step === "cart" ? subtotal : total)}
              </span>
            </div>

            <div className="flex gap-2">
              {step !== "cart" && (
                <button
                  onClick={() =>
                    setStep(step === "confirm" ? "info" : "cart")
                  }
                  className="flex-1 py-2.5 text-sm font-medium border border-[var(--color-border)] rounded hover:border-[var(--color-text-faint)] transition-colors"
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
                className="flex-1 py-2.5 text-sm font-medium bg-[var(--color-accent)] text-[var(--color-bg)] rounded hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                data-testid="button-checkout"
              >
                {step === "cart" && (
                  <>
                    Checkout <ArrowRight size={14} />
                  </>
                )}
                {step === "info" && "Review Order"}
                {step === "confirm" &&
                  (isCheckingOut ? "Processing..." : "Pay with Stripe")}
              </button>
            </div>

            <div className="flex items-start gap-2 pt-1">
              <p className="text-[10px] text-[var(--color-text-faint)] leading-relaxed">
                By proceeding, you confirm your order for exhibition merchandise
                and agree to the privacy policy for processing this order.
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
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
      <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 text-sm bg-[var(--color-surface)] border rounded focus:outline-none transition-colors ${
          error
            ? "border-[var(--color-error)]"
            : "border-[var(--color-border)] focus:border-[var(--color-accent)]"
        }`}
        data-testid={testId}
      />
      {error && (
        <p className="text-[10px] text-[var(--color-error)] mt-1">{error}</p>
      )}
    </div>
  );
}
