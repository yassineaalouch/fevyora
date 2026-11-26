"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { FillImage } from "@/components/catalog/FillImage";
import { ProductPurchase } from "@/components/catalog/ProductPurchase";
import { Container } from "@/components/ui/Container";
import { loadCatalog } from "@/lib/live";
import type { Product } from "@/lib/types";

export function PieceView() {
  const params = useSearchParams();
  const slug = params.get("slug") ?? "";
  const [product, setProduct] = useState<Product | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let alive = true;
    loadCatalog().then((list) => {
      if (!alive) return;
      const found = list.find((item) => item.slug === slug);
      if (found) setProduct(found);
      else setMissing(true);
    }).catch(() => {
      if (alive) setMissing(true);
    });
    return () => {
      alive = false;
    };
  }, [slug]);

  if (!slug || missing) {
    return (
      <Container className="py-16 text-center">
        <p className="font-serif text-3xl">Cette pièce n&apos;est pas disponible.</p>
        <Link href="/boutique/" className="mt-6 inline-flex text-sm text-burgundy">Retour à la boutique</Link>
      </Container>
    );
  }
  if (!product) return <Container className="py-16 text-sm text-muted">Chargement...</Container>;

  return (
    <Container className="py-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-12 lg:py-16">
      <div>
        <Link href="/boutique/" className="mb-3 inline-flex items-center gap-1 text-sm text-ink lg:hidden">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Retour
        </Link>
        <div className="relative aspect-[3/4] overflow-hidden rounded-[28px] bg-beige">
          <FillImage src={product.image} alt={product.imageAlt} sizes="(min-width: 1024px) 50vw, 100vw" />
        </div>
      </div>
      <ProductPurchase product={product} />
    </Container>
  );
}
