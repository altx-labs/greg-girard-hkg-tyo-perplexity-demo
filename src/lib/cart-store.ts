"use client";

import { create } from "zustand";
import type { Product } from "./products";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerInfo {
  email: string;
  fullName: string;
  phone: string;
  deliveryMethod: string;
  shippingAddress: string;
  remarks: string;
}

interface CartStore {
  items: CartItem[];
  customerInfo: CustomerInfo;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setCustomerInfo: (info: Partial<CustomerInfo>) => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  customerInfo: {
    email: "",
    fullName: "",
    phone: "",
    deliveryMethod: "pickup",
    shippingAddress: "",
    remarks: "",
  },

  addItem: (product) => {
    set((state) => {
      const existing = state.items.find(
        (item) => item.product.id === product.id
      );
      if (existing) {
        if (existing.quantity >= product.maxQty) return state;
        return {
          items: state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return { items: [...state.items, { product, quantity: 1 }] };
    });
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    }));
  },

  updateQuantity: (productId, quantity) => {
    set((state) => {
      if (quantity <= 0) {
        return {
          items: state.items.filter((item) => item.product.id !== productId),
        };
      }
      return {
        items: state.items.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.min(quantity, item.product.maxQty) }
            : item
        ),
      };
    });
  },

  clearCart: () => {
    set({
      items: [],
      customerInfo: {
        email: "",
        fullName: "",
        phone: "",
        deliveryMethod: "pickup",
        shippingAddress: "",
        remarks: "",
      },
    });
  },

  setCustomerInfo: (info) => {
    set((state) => ({
      customerInfo: { ...state.customerInfo, ...info },
    }));
  },

  getTotal: () => {
    const state = get();
    return state.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  },

  getItemCount: () => {
    const state = get();
    return state.items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
