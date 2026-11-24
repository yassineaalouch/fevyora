"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { addToCart, toggleWishlist, useWishlist } from "@/lib/shop";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const wishlist = useWishlist();
  const wished = wishlist.includes(product.slug);
  const [notice, setNotice] = useState("");

  return (
    <article className="group">
      <div className="relative aspect-[3/4] overflow-hidden rounded-[22px] bg-beige">
        <Link href={`/collections/${product.collection}`} className="absolute inset-0">
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 100vw"
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
          />
          <span className="sr-only">{product.name}</span>
        </Link>
        <button
          type="button"
          aria-pressed={wished}
          aria-label={wished ? `Retirer ${product.name} des favoris` : `Ajouter ${product.name} aux favoris`}
          onClick={() => toggleWishlist(product.slug)}
          className="absolute top-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-ivory/90 text-ink shadow-sm transition hover:text-burgundy"
        >
          <Heart className="h-4 w-4" fill={wished ? "currentColor" : "none"} strokeWidth={1.6} />
        </button>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl leading-tight text-ink">
            <Link href={`/collections/${product.collection}`} className="hover:text-burgundy">
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-muted">{product.detail}</p>
        </div>
        <p className="shrink-0 text-sm text-ink">{formatPrice(product.price)}</p>
      </div>
      <button
        type="button"
        className="mt-3 text-sm tracking-wide text-burgundy underline-offset-4 hover:underline"
        onClick={() => {
          addToCart(product.slug);
          setNotice("Ajouté au panier");
          window.setTimeout(() => setNotice(""), 1800);
        }}
      >
        Ajouter au panier
      </button>
      <p role="status" className="mt-1 min-h-5 text-xs text-muted">
        {notice}
      </p>
    </article>
  );
}
