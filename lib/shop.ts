"use client";

import { useSyncExternalStore } from "react";

export type CartLine = {
  slug: string;
  quantity: number;
};

const CART_KEY = "velora-cart";
const WISH_KEY = "velora-wishlist";

const SERVER_CART: CartLine[] = [];
const SERVER_WISH: string[] = [];

let cartSnapshot: CartLine[] = SERVER_CART;
let wishSnapshot: string[] = SERVER_WISH;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const line = value as { slug?: unknown; quantity?: unknown };
  return (
    typeof line.slug === "string" &&
    typeof line.quantity === "number" &&
    Number.isFinite(line.quantity) &&
    line.quantity > 0
  );
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;

  try {
    const cartRaw = localStorage.getItem(CART_KEY);
    const wishRaw = localStorage.getItem(WISH_KEY);

    if (cartRaw) {
      const parsed: unknown = JSON.parse(cartRaw);
      if (Array.isArray(parsed)) {
        cartSnapshot = parsed.filter(isCartLine);
      }
    }

    if (wishRaw) {
      const parsed: unknown = JSON.parse(wishRaw);
      if (Array.isArray(parsed)) {
        wishSnapshot = parsed.filter(
          (item): item is string => typeof item === "string",
        );
      }
    }
  } catch {
    cartSnapshot = [];
    wishSnapshot = [];
  }
}

function persist() {
  localStorage.setItem(CART_KEY, JSON.stringify(cartSnapshot));
  localStorage.setItem(WISH_KEY, JSON.stringify(wishSnapshot));
  emit();
}

export function subscribeShop(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getCartSnapshot() {
  hydrate();
  return cartSnapshot;
}

export function getWishSnapshot() {
  hydrate();
  return wishSnapshot;
}

export function getServerCartSnapshot() {
  return SERVER_CART;
}

export function getServerWishSnapshot() {
  return SERVER_WISH;
}

export function addToCart(slug: string) {
  hydrate();
  const existing = cartSnapshot.find((line) => line.slug === slug);
  cartSnapshot = existing
    ? cartSnapshot.map((line) =>
        line.slug === slug ? { ...line, quantity: line.quantity + 1 } : line,
      )
    : [...cartSnapshot, { slug, quantity: 1 }];
  persist();
}

export function setQuantity(slug: string, quantity: number) {
  hydrate();
  cartSnapshot =
    quantity <= 0
      ? cartSnapshot.filter((line) => line.slug !== slug)
      : cartSnapshot.map((line) =>
          line.slug === slug ? { ...line, quantity } : line,
        );
  persist();
}

export function removeFromCart(slug: string) {
  setQuantity(slug, 0);
}

export function clearCart() {
  hydrate();
  cartSnapshot = [];
  persist();
}

export function toggleWishlist(slug: string) {
  hydrate();
  wishSnapshot = wishSnapshot.includes(slug)
    ? wishSnapshot.filter((item) => item !== slug)
    : [...wishSnapshot, slug];
  persist();
}

export function useCart() {
  return useSyncExternalStore(
    subscribeShop,
    getCartSnapshot,
    getServerCartSnapshot,
  );
}

export function useWishlist() {
  return useSyncExternalStore(
    subscribeShop,
    getWishSnapshot,
    getServerWishSnapshot,
  );
}
