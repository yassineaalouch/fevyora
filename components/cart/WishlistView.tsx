"use client";

import Link from "next/link";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { getProduct } from "@/lib/data";
import { useWishlist } from "@/lib/shop";

export function WishlistView() {
  const wishlist = useWishlist();
  const products = wishlist
    .map((slug) => getProduct(slug))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  if (products.length === 0) {
    return (
      <div className="rounded-[24px] border border-beige bg-ivory px-6 py-16 text-center">
        <p className="font-serif text-3xl text-ink">Vos favoris vous attendent</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
          Enregistrez les pièces qui vous plaisent pour les retrouver ici.
        </p>
        <Link
          href="/boutique"
          className="mt-8 inline-flex rounded-full bg-burgundy px-6 py-3 text-sm text-ivory transition hover:bg-wine"
        >
          Parcourir la boutique
        </Link>
      </div>
    );
  }

  return <ProductGrid products={products} />;
}
