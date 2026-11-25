"use client";

import { useState } from "react";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { catalogColors } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import { addToCart, toggleWishlist, useWishlist } from "@/lib/shop";
import type { Product } from "@/lib/types";

export function ProductPurchase({ product }: { product: Product }) {
  const wishlist = useWishlist();
  const wished = wishlist.includes(product.slug);
  const colors = catalogColors.filter((color) => product.colors?.includes(color.id));
  const sizes = product.sizes?.length ? product.sizes : ["S", "M", "L", "XL"];
  const [color, setColor] = useState(colors[0]?.id ?? "");
  const [size, setSize] = useState(sizes[0] ?? "M");
  const [notice, setNotice] = useState("");
  const discount =
    product.compareAt && product.compareAt > product.price
      ? Math.round((1 - product.price / product.compareAt) * 100)
      : 0;

  return (
    <div className="px-5 py-5 lg:px-0 lg:py-0">
      <h1 className="font-serif text-3xl text-ink">{product.name}</h1>
      {product.rating ? (
        <p className="mt-2 flex items-center gap-1.5 text-sm text-ink">
          <Star className="h-3.5 w-3.5 fill-[#e2b340] text-[#e2b340]" aria-hidden="true" />
          {product.rating.toFixed(1)}
          {product.reviews ? <span className="text-muted">({product.reviews} avis)</span> : null}
        </p>
      ) : null}
      <p className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-2xl font-medium text-burgundy">{formatPrice(product.price)}</span>
        {product.compareAt ? (
          <span className="text-sm text-muted line-through">{formatPrice(product.compareAt)}</span>
        ) : null}
        {discount > 0 ? (
          <span className="rounded-full bg-[#f3d36b] px-2 py-0.5 text-xs font-medium text-ink">-{discount}%</span>
        ) : null}
      </p>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{product.detail}</p>

      {colors.length > 0 ? (
        <fieldset className="mt-6">
          <legend className="text-sm text-ink">Couleur</legend>
          <div className="mt-2 flex gap-2">
            {colors.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-label={item.label}
                aria-pressed={color === item.id}
                onClick={() => setColor(item.id)}
                className={`h-7 w-7 rounded-full border-2 ${color === item.id ? "border-burgundy" : "border-transparent"}`}
                style={{ background: item.hex }}
              />
            ))}
          </div>
        </fieldset>
      ) : null}

      <fieldset className="mt-5">
        <legend className="text-sm text-ink">Taille</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {sizes.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={size === item}
              onClick={() => setSize(item)}
              className={`grid h-10 min-w-10 place-items-center rounded-full px-3 text-sm ${
                size === item ? "bg-burgundy text-ivory" : "bg-ivory text-ink"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </fieldset>

      <button
        type="button"
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-burgundy text-sm text-ivory"
        onClick={() => {
          addToCart(product.slug);
          setNotice(`${product.name}, taille ${size}, ajoutée au panier.`);
        }}
      >
        <ShoppingBag className="h-4 w-4" aria-hidden="true" />
        Ajouter au panier
      </button>
      <button
        type="button"
        aria-pressed={wished}
        onClick={() => toggleWishlist(product.slug)}
        className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-full border border-beige text-sm text-ink"
      >
        <Heart className="h-4 w-4" fill={wished ? "currentColor" : "none"} aria-hidden="true" />
        {wished ? "Dans les favoris" : "Ajouter aux favoris"}
      </button>
      {notice ? (
        <p role="status" className="mt-3 text-sm text-ink">
          {notice}
        </p>
      ) : null}
    </div>
  );
}
