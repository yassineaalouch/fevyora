import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { MobileCatalog } from "@/components/catalog/MobileCatalog";
import { EditorialHeader } from "@/components/catalog/EditorialHeader";
import { Container } from "@/components/ui/Container";
import { collections } from "@/lib/data";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Abayas et robes, ensembles, jupes et tops, vestes et manteaux. Les collections FEVYORA.",
};

export default function CollectionsPage() {
  return (
    <>
      <div className="lg:hidden">
        <div className="flex items-center justify-between px-4 pt-2">
          <h1 className="font-serif text-2xl text-ink">Collections</h1>
        </div>
        <MobileCatalog />
      </div>
      <div className="hidden lg:block">
      <EditorialHeader
        eyebrow="Collections"
        title="Des pièces uniques pour chaque moment"
        text="Quatre familles, une même exigence : une mode modeste moderne, confortable et précise."
      />
      <Container className="grid gap-8 py-14 sm:grid-cols-2 lg:py-16">
        {collections.map((collection) => (
          <Link
            key={collection.slug}
            href={`/collections/${collection.slug}`}
            className="group overflow-hidden rounded-[24px] bg-ivory"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={collection.image}
                alt={collection.imageAlt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover transition duration-700 group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex items-end justify-between gap-4 px-5 py-5">
              <div>
                <h2 className="font-serif text-3xl text-ink">{collection.name}</h2>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{collection.description}</p>
              </div>
              <ArrowRight className="mb-1 h-4 w-4 shrink-0" aria-hidden="true" />
            </div>
          </Link>
        ))}
      </Container>
      </div>
    </>
  );
}
