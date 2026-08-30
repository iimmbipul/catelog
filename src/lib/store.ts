"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  mrp: number;
  qty: number;
  /* Cart line identity is (productId, fragrance, color) — so a customer can
   * order the same candle in different fragrances or colors as separate lines. */
  fragrance?: string;
  color?: string;
}

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  giftMessage: string;
  notes: string;
  add: (item: CartItem) => void;
  remove: (productId: string, fragrance?: string, color?: string) => void;
  setQty: (productId: string, qty: number, fragrance?: string, color?: string) => void;
  clear: () => void;
  applyCoupon: (code: string | null) => void;
  setGiftMessage: (v: string) => void;
  setNotes: (v: string) => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      couponCode: null,
      giftMessage: "",
      notes: "",
      add: (item) =>
        set((s) => {
          const sameLine = (i: CartItem) =>
            i.productId === item.productId &&
            (i.fragrance ?? "") === (item.fragrance ?? "") &&
            (i.color ?? "") === (item.color ?? "");
          const existing = s.items.find(sameLine);
          if (existing) {
            return {
              items: s.items.map((i) => (sameLine(i) ? { ...i, qty: i.qty + item.qty } : i)),
            };
          }
          return { items: [...s.items, item] };
        }),
      remove: (productId, fragrance, color) =>
        set((s) => ({
          items: s.items.filter(
            (i) =>
              !(
                i.productId === productId &&
                (i.fragrance ?? "") === (fragrance ?? "") &&
                (i.color ?? "") === (color ?? "")
              ),
          ),
        })),
      setQty: (productId, qty, fragrance, color) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.productId === productId &&
            (i.fragrance ?? "") === (fragrance ?? "") &&
            (i.color ?? "") === (color ?? "")
              ? { ...i, qty: Math.max(1, qty) }
              : i,
          ),
        })),
      clear: () => set({ items: [], couponCode: null, giftMessage: "", notes: "" }),
      applyCoupon: (code) => set({ couponCode: code }),
      setGiftMessage: (v) => set({ giftMessage: v }),
      setNotes: (v) => set({ notes: v }),
    }),
    { name: "ww-cart", storage: createJSONStorage(() => localStorage) },
  ),
);

interface WishlistState {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((s) => ({
          ids: s.ids.includes(id) ? s.ids.filter((i) => i !== id) : [...s.ids, id],
        })),
      has: (id) => get().ids.includes(id),
    }),
    { name: "ww-wishlist", storage: createJSONStorage(() => localStorage) },
  ),
);

export interface Toast {
  id: number;
  title: string;
  subtitle?: string;
  image?: string;
  href?: string;
}

interface UIState {
  cartOpen: boolean;
  searchOpen: boolean;
  menuOpen: boolean;
  toasts: Toast[];
  setCartOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  setMenuOpen: (v: boolean) => void;
  showToast: (t: Omit<Toast, "id">) => void;
  dismissToast: (id: number) => void;
}

export const useUI = create<UIState>((set) => ({
  cartOpen: false,
  searchOpen: false,
  menuOpen: false,
  toasts: [],
  setCartOpen: (v) => set({ cartOpen: v }),
  setSearchOpen: (v) => set({ searchOpen: v }),
  setMenuOpen: (v) => set({ menuOpen: v }),
  showToast: (t) =>
    set((s) => {
      const id = Date.now() + Math.random();
      const toast: Toast = { id, ...t };
      // Auto-dismiss after 3.5s
      if (typeof window !== "undefined") {
        setTimeout(() => {
          set((cur) => ({ toasts: cur.toasts.filter((x) => x.id !== id) }));
        }, 3500);
      }
      return { toasts: [...s.toasts, toast] };
    }),
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
