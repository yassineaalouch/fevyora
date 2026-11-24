import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { EditorialHeader } from "@/components/catalog/EditorialHeader";
import { Container } from "@/components/ui/Container";
import { images } from "@/lib/data";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "FEVYORA est une maison de mode modeste moderne. Élégance, confort et personnalité, conçus pour les femmes au Maroc.",
};

const values = [
  {
    title: "Élégance",
    text: "Des lignes contemporaines, jamais criardes. La modestie se dessine avec précision.",
  },
  {
    title: "Confort",
    text: "Des coupes amples et des tissus souples, pensés pour accompagner la journée entière.",
  },
  {
    title: "Personnalité",
    text: "Des pièces intemporelles que l'on porte à sa façon, sans se déguiser.",
  },
];

export default function AboutPage() {
  return (
    <>
      <EditorialHeader
        eyebrow="À propos"
        title="Une marque, une vision"
        text="FEVYORA habille une modestie moderne : présente, confortable, et résolument actuelle."
      />
      <Container className="grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-16">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[24px]">
          <Image
            src={images.fabric}
            alt="Velours bordeaux, matière signature de FEVYORA"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-base leading-relaxed text-muted">
            Chez FEVYORA, nous croyons en une mode modeste moderne, qui allie élégance, confort et
            personnalité. Notre mission est de vous offrir des pièces intemporelles, conçues avec
            soin pour révéler votre style, à votre façon.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted">
            La maison s&apos;adresse aux femmes du Maroc qui cherchent une garde-robe premium, loin
            des coupes génériques. Chaque silhouette reste couvrante, fluide et contemporaine.
          </p>
          <dl className="mt-8 space-y-5">
            {values.map((value) => (
              <div key={value.title}>
                <dt className="font-serif text-2xl text-ink">{value.title}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted">{value.text}</dd>
              </div>
            ))}
          </dl>
          <Link
            href="/contact"
            className="mt-8 inline-flex rounded-full bg-burgundy px-6 py-3 text-sm text-ivory transition hover:bg-wine"
          >
            Écrire à la maison
          </Link>
        </div>
      </Container>
    </>
  );
}
