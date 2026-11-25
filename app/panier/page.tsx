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
      <div className="px-4 pt-3 lg:hidden">
        <h1 className="font-serif text-2xl text-ink">Panier</h1>
      </div>
      <div className="hidden lg:block">
        <EditorialHeader eyebrow="Panier" title="Votre sélection" />
      </div>
      <Container className="py-6 lg:py-16">
        <CartView />
      </Container>
    </>
  );
}
