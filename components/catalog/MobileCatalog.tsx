"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { products } from "@/lib/data";
import { addToCart, toggleWishlist, useWishlist } from "@/lib/shop";
import type { Product } from "@/lib/types";

const filters = [
  { id: "toutes", label: "Toutes" },
  { id: "abayas-robes", label: "Abayas" },
  { id: "ensembles", label: "Ensembles" },
  { id: "vestes-manteaux", label: "Vestes" },
] as const;

export function MobileCatalog() {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("toutes");
  const [ready, setReady] = useState(false);
  const wishlist = useWishlist();

  useEffect(() => setReady(true), []);
  const visible = useMemo(
    () => (filter === "toutes" ? products : products.filter((product) => product.collection === filter)),
    [filter],
  );

  return (
    <div className="px-4 pt-3 pb-6">
      <div className="flex gap-2 overflow-x-auto pb-4">
        {filters.map((item) => {
          const on = filter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(item.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm ${on ? "bg-burgundy text-ivory" : "bg-ivory text-ink"}`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-5">
        {visible.map((product) => (
          <li key={product.slug}>
            <MobileProductTile product={product} wished={ready && wishlist.includes(product.slug)} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function MobileProductTile({ product, wished }: { product: Product; wished: boolean }) {
  return (
    <article>
      <div className="relative aspect-[3/4] overflow-hidden rounded-[22px] bg-beige">
        <Link href={`/produit/${product.slug}`} className="absolute inset-0">
          <Image src={product.image} alt={product.imageAlt} fill sizes="50vw" className="object-cover" />
          <span className="sr-only">{product.name}</span>
        </Link>
        <button
          type="button"
          aria-pressed={wished}
          aria-label={wished ? `Retirer ${product.name} des favoris` : `Ajouter ${product.name} aux favoris`}
          onClick={() => toggleWishlist(product.slug)}
          className="absolute top-2.5 right-2.5 grid h-8 w-8 place-items-center rounded-full bg-ivory/90 text-ink"
        >
          <Heart className="h-3.5 w-3.5" fill={wished ? "currentColor" : "none"} strokeWidth={1.7} />
        </button>
      </div>
      <div className="mt-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="truncate text-sm text-ink">
            <Link href={`/produit/${product.slug}`}>{product.name}</Link>
          </h2>
          <p className="text-sm text-ink">{formatPrice(product.price)}</p>
        </div>
        <button
          type="button"
          aria-label={`Ajouter ${product.name} au panier`}
          onClick={() => addToCart(product.slug)}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-burgundy text-ivory"
        >
          <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.7} />
        </button>
      </div>
    </article>
  );
}
