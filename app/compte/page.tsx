import type { Metadata } from "next";
import { AccountPanel } from "@/components/forms/AccountPanel";
import { EditorialHeader } from "@/components/catalog/EditorialHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Compte",
  description: "Espace client FEVYORA.",
};

export default function AccountPage() {
  return (
    <>
      <EditorialHeader
        eyebrow="Compte"
        title="Votre espace"
        text="Retrouvez bientôt vos commandes, vos favoris et vos adresses de livraison."
      />
      <Container className="py-14 lg:py-16">
        <AccountPanel />
      </Container>
    </>
  );
}
