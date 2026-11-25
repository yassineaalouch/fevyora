import { ProductCard } from "@/components/catalog/ProductCard";
import type { Product } from "@/lib/types";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <p className="text-muted">Aucune pièce ne correspond à votre recherche.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-8 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
