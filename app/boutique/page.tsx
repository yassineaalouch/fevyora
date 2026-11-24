import type { Metadata } from "next";
import { BoutiqueCatalog } from "@/components/boutique/BoutiqueCatalog";
import { BoutiqueHero } from "@/components/boutique/BoutiqueHero";
import { BoutiqueNewsletter } from "@/components/boutique/BoutiqueNewsletter";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Boutique",
  description:
    "Découvrez la boutique FEVYORA : abayas, ensembles, jupes et manteaux. Mode modeste moderne, livraison partout au Maroc.",
};

export default function BoutiquePage() {
  return (
    <>
      <BoutiqueHero />
      <Container className="py-10 lg:py-14">
        <BoutiqueCatalog />
        <div className="mt-12">
          <BoutiqueNewsletter />
        </div>
      </Container>
    </>
  );
}
