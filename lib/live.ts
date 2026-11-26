"use client";

import { useEffect, useState } from "react";
import { apiBase } from "@/lib/api";
import { products } from "@/lib/data";
import type { Product } from "@/lib/types";

type Row = {
  slug?: string;
  name?: string;
  price?: number;
  compare_at?: number | null;
  collection?: string;
  image?: string;
  detail?: string;
  sizes?: string[] | null;
  active?: boolean;
};

const staticSlugs = new Set(products.map((product) => product.slug));

export function productHref(slug: string) {
  return staticSlugs.has(slug) ? `/produit/${slug}/` : `/piece/?slug=${encodeURIComponent(slug)}`;
}

export function mergeProducts(rows: Row[]): Product[] {
  const active = rows.filter((row) => row.active !== false && typeof row.slug === "string");
  const bySlug = new Map(active.map((row) => [row.slug as string, row]));
  const inactive = new Set(rows.filter((row) => row.active === false && row.slug).map((row) => row.slug as string));
  const merged = products.flatMap((product) => {
    if (inactive.has(product.slug)) return [];
    const row = bySlug.get(product.slug);
    if (!row) return [product];
    return [{
      ...product,
      name: row.name || product.name,
      price: typeof row.price === "number" ? row.price : product.price,
      compareAt: typeof row.compare_at === "number" ? row.compare_at : product.compareAt,
      detail: row.detail || product.detail,
      sizes: row.sizes?.length ? row.sizes : product.sizes,
    }];
  });
  for (const row of active) {
    if (!row.slug || staticSlugs.has(row.slug)) continue;
    merged.push({
      slug: row.slug,
      name: row.name || "Pièce",
      price: typeof row.price === "number" ? row.price : 0,
      compareAt: typeof row.compare_at === "number" ? row.compare_at : undefined,
      collection: row.collection || "ensembles",
      image: row.image || "",
      imageAlt: row.name || "Pièce FEVYORA",
      detail: row.detail || "",
      sizes: row.sizes ?? [],
      badge: "Nouveau",
    });
  }
  return merged;
}

let cache: Product[] | null = null;
let pending: Promise<Product[]> | null = null;

export function loadCatalog() {
  if (cache) return Promise.resolve(cache);
  if (!pending) {
    pending = fetch(`${apiBase()}/products`)
      .then((response) => (response.ok ? response.json() : []))
      .then((rows: unknown) => {
        cache = mergeProducts(Array.isArray(rows) ? (rows as Row[]) : []);
        return cache;
      })
      .catch(() => products);
  }
  return pending;
}

export function useLiveProducts() {
  const [list, setList] = useState<Product[]>(products);
  useEffect(() => {
    loadCatalog().then(setList).catch(() => setList(products));
  }, []);
  return list;
}
