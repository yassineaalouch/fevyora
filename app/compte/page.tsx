import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight, Heart, Home, MapPin, ShoppingBag, User } from "lucide-react";
import { AccountPanel } from "@/components/forms/AccountPanel";
import { EditorialHeader } from "@/components/catalog/EditorialHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Compte",
  description: "Espace client FEVYORA.",
};

export default function AccountPage() {
  const links = [
    { href: "/panier", label: "Mes commandes", icon: ShoppingBag },
    { href: "/favoris", label: "Mes favoris", icon: Heart },
    { href: "/contact", label: "Mes adresses", icon: MapPin },
    { href: "/", label: "Accueil", icon: Home },
    { href: "/a-propos", label: "À propos de FEVYORA", icon: User },
    { href: "/contact", label: "Nous contacter", icon: User },
  ];

  return (
    <>
      <div className="lg:hidden">
        <div className="bg-burgundy px-5 py-8 text-ivory">
          <p className="font-serif text-2xl">Mon compte</p>
          <p className="mt-1 text-sm text-ivory/75">Espace client FEVYORA</p>
        </div>
        <ul className="px-3 py-3">
          {links.map((item) => (
            <li key={item.label}>
              <Link href={item.href} className="flex items-center gap-3 rounded-2xl px-3 py-3 text-ink">
                <item.icon className="h-5 w-5 text-burgundy" strokeWidth={1.6} aria-hidden="true" />
                <span className="flex-1">{item.label}</span>
                <ChevronRight className="h-4 w-4 text-muted" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
        <Container className="pb-6">
          <AccountPanel />
        </Container>
      </div>
      <div className="hidden lg:block">
        <EditorialHeader
          eyebrow="Compte"
          title="Votre espace"
          text="Retrouvez bientôt vos commandes, vos favoris et vos adresses de livraison."
        />
        <Container className="py-14 lg:py-16">
          <AccountPanel />
        </Container>
      </div>
    </>
  );
}
