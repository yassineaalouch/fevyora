import type { Metadata } from "next";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { BrandStorySection } from "@/components/home/BrandStorySection";
import { CollectionsSection } from "@/components/home/CollectionsSection";
import { HeroSection } from "@/components/home/HeroSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  description:
    "FEVYORA présente une mode modeste moderne : abayas, robes, ensembles, jupes et manteaux. Élégance, confort et confiance, avec livraison partout au Maroc.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <CollectionsSection />
      <BrandStorySection />
      <NewsletterSection />
      <Footer className="bg-burgundy -mb-[calc(4.25rem+env(safe-area-inset-bottom))] pb-[calc(4.25rem+env(safe-area-inset-bottom))] text-ivory lg:mb-0 lg:hidden lg:pb-0" />
    </>
  );
}
