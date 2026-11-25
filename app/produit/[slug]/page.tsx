import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import { ProductPurchase } from "@/components/catalog/ProductPurchase";
import { Container } from "@/components/ui/Container";
import { getProduct, products } from "@/lib/data";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Pièce" };
  return { title: product.name, description: product.detail };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <Container className="py-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-12 lg:py-16">
      <div>
        <Link href="/collections" className="mb-3 inline-flex items-center gap-1 text-sm text-ink lg:hidden">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Retour
        </Link>
        <div className="relative aspect-[3/4] overflow-hidden rounded-[28px] bg-beige">
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
      <ProductPurchase product={product} />
    </Container>
  );
}
