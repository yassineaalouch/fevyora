import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { images } from "@/lib/data";

function StoryCopy({ labelled = false }: { labelled?: boolean }) {
  return (
    <div className="max-w-md">
      <h2 id={labelled ? "story-title" : undefined} className="flex items-center gap-3 font-serif text-3xl leading-none font-medium text-ink xl:text-4xl">
        <span>Une marque, une vision</span>
        <Heart className="h-6 w-6 shrink-0 xl:h-7 xl:w-7" strokeWidth={1.4} aria-hidden="true" />
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted xl:text-[15px]">
        Chez FEVYORA, nous croyons en une mode modeste moderne, qui allie élégance, confort et
        personnalité. Notre mission est de vous offrir des pièces intemporelles, conçues avec soin
        pour révéler votre style, à votre façon.
      </p>
      <Link
        href="/a-propos"
        className="mt-5 inline-flex items-center gap-2.5 rounded-full bg-burgundy px-5 py-2.5 text-sm text-ivory transition hover:bg-wine"
      >
        En savoir plus
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

export function BrandStorySection() {
  return (
    <section className="bg-ivory">
      <div className="lg:hidden">
        <div className="relative aspect-[1600/306] w-full">
          <Image
            src={images.vision}
            alt="Velours bordeaux et illustration florale, une marque et une vision"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="px-5 py-10 sm:px-10">
          <StoryCopy />
        </div>
      </div>

      <div className="relative hidden aspect-[1600/306] w-full lg:block">
        <Image
          src={images.vision}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 grid grid-cols-[48%_1fr] items-center">
          <div className="flex justify-center px-6">
            <Logo tone="light" />
          </div>
          <div className="pr-24 pl-6 xl:pr-32 xl:pl-10">
            <StoryCopy labelled />
          </div>
        </div>
      </div>
    </section>
  );
}
