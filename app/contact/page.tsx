import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { EditorialHeader } from "@/components/catalog/EditorialHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Contact",
  description: "Écrivez à FEVYORA. Livraison partout au Maroc et paiement à la livraison.",
};

export default function ContactPage() {
  return (
    <>
      <EditorialHeader
        eyebrow="Contact"
        title="Nous écrire"
        text="Une question de taille, de tissu ou de livraison ? Laissez-nous un message."
      />
      <Container className="grid gap-10 py-14 lg:grid-cols-[minmax(0,1fr)_280px] lg:py-16">
        <ContactForm />
        <aside className="space-y-6 text-sm leading-relaxed text-muted">
          <div>
            <p className="font-serif text-2xl text-ink">Livraison</p>
            <p className="mt-2">Partout au Maroc, avec un suivi clair avant l&apos;envoi.</p>
          </div>
          <div>
            <p className="font-serif text-2xl text-ink">Paiement</p>
            <p className="mt-2">Paiement à la livraison, en toute confiance.</p>
          </div>
          <div>
            <p className="font-serif text-2xl text-ink">Service</p>
            <p className="mt-2">Toujours à votre écoute, pour choisir une pièce qui vous ressemble.</p>
          </div>
        </aside>
      </Container>
    </>
  );
}
