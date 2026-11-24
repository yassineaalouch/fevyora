import type { Metadata } from "next";
import { WishlistView } from "@/components/cart/WishlistView";
import { EditorialHeader } from "@/components/catalog/EditorialHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Favoris",
  description: "Vos pièces FEVYORA enregistrées.",
};

export default function WishlistPage() {
  return (
    <>
      <EditorialHeader eyebrow="Favoris" title="Pièces gardées de côté" />
      <Container className="py-14 lg:py-16">
        <WishlistView />
      </Container>
    </>
  );
}
