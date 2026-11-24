import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { Container } from "@/components/ui/Container";
import { collections, getCollection, getProductsByCollection } from "@/lib/data";

type CollectionPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return collections.map((collection) => ({ slug: collection.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return { title: "Collection" };
  return {
    title: collection.name,
    description: collection.description,
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const pieces = getProductsByCollection(collection.slug);
  const others = collections.filter((item) => item.slug !== collection.slug);

  return (
    <>
      <section className="border-b border-ink/10">
        <Container className="grid items-center gap-8 py-12 lg:grid-cols-2 lg:py-16">
          <div>
            <p className="text-[11px] tracking-[0.38em] text-muted uppercase">Collection</p>
            <h1 className="mt-3 font-serif text-5xl leading-tight font-medium text-ink sm:text-6xl">
              {collection.name}
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted">{collection.description}</p>
          </div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-[24px] bg-beige">
            <Image
              src={collection.image}
              alt={collection.imageAlt}
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>
      <Container className="py-14 lg:py-16">
        <h2 className="mb-8 font-serif text-3xl text-ink">Pièce signature</h2>
        <ProductGrid products={pieces} />
        <h2 className="mt-16 mb-6 font-serif text-3xl text-ink">Autres collections</h2>
        <ul className="grid gap-3 sm:grid-cols-3">
          {others.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/collections/${item.slug}`}
                className="block rounded-2xl border border-beige bg-ivory px-4 py-4 text-sm transition hover:border-burgundy/30"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
