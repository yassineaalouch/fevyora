import Image from "next/image";
import { images } from "@/lib/data";

export function BoutiqueHero() {
  return (
    <section className="relative -mt-[var(--nav-height)] h-[calc(300px+var(--nav-height))] overflow-hidden bg-cream sm:h-[calc(360px+var(--nav-height))] lg:h-[calc(420px+var(--nav-height))]">
      <Image
        src={images.boutiqueHero}
        alt="Femme en blouse bordeaux à volants dans une galerie d'arches"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[72%_center]"
      />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[42%] bg-gradient-to-r from-cream/75 via-cream/25 to-transparent" />
      <div className="relative mx-auto flex h-full w-full max-w-[1240px] items-center px-5 pt-[var(--nav-height)] sm:px-8 lg:px-10">
        <div>
          <h1 className="font-serif text-6xl leading-none font-medium text-ink sm:text-7xl lg:text-8xl">
            Boutique
          </h1>
          <p className="mt-3 font-script text-3xl text-ink/85 sm:text-4xl">
            Découvrez notre collection
            <span className="ml-2 font-sans text-[0.55em]" aria-hidden="true">
              ♡
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
