import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";
import { EditorialHeader } from "@/components/catalog/EditorialHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Panier",
  description: "Votre panier FEVYORA. Paiement à la livraison partout au Maroc.",
};

export default function CartPage() {
  return (
    <>
      <EditorialHeader eyebrow="Panier" title="Votre sélection" />
      <Container className="py-14 lg:py-16">
        <CartView />
      </Container>
    </>
  );
}
