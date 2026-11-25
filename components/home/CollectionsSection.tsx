import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { collections } from "@/lib/data";

export function CollectionsSection() {
  return (
    <section className="bg-cream py-16 sm:py-20 lg:py-24" aria-labelledby="collections-title">
      <Container>
        <div className="mb-3 flex items-center justify-center gap-4 text-ink/40">
          <span className="h-px w-12 bg-current sm:w-16" />
          <span className="h-1.5 w-1.5 rotate-45 bg-current" />
          <span className="h-px w-12 bg-current sm:w-16" />
        </div>
        <div className="text-center">
          <h2 id="collections-title" className="font-serif text-4xl font-medium text-ink sm:text-5xl">
            Nos Collections
          </h2>
          <p className="mt-3 text-sm text-muted sm:text-base">
            Des pièces uniques pour chaque moment <span aria-hidden="true">♡</span>
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {collections.map((collection) => (
            <Link
              key={collection.slug}
              href={`/collections/${collection.slug}`}
              className="group relative overflow-hidden rounded-[22px] bg-beige shadow-[0_12px_30px_rgba(43,23,21,0.06)]"
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={collection.image}
                  alt={collection.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 78vw"
                  className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <span className="absolute bottom-3 left-1/2 inline-flex max-w-[calc(100%-0.75rem)] -translate-x-1/2 items-center gap-1 rounded-full bg-ivory/95 px-2.5 py-1.5 text-[11px] whitespace-nowrap text-ink shadow-sm transition group-hover:bg-white sm:bottom-4 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
                {collection.name}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
