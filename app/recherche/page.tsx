import { Suspense } from "react";
import type { Metadata } from "next";
import { EditorialHeader } from "@/components/catalog/EditorialHeader";
import { SearchExperience } from "@/components/search/SearchExperience";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Recherche",
  description: "Recherchez une pièce FEVYORA.",
};

export default function SearchPage() {
  return (
    <>
      <EditorialHeader eyebrow="Recherche" title="Trouver une pièce" />
      <Container className="py-14 lg:py-16">
        <Suspense fallback={<p className="text-muted">Recherche en cours...</p>}>
          <SearchExperience />
        </Suspense>
      </Container>
    </>
  );
}
