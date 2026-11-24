import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="text-[11px] tracking-[0.38em] text-muted uppercase">FEVYORA</p>
      <h1 className="mt-3 font-serif text-5xl text-ink">Page introuvable</h1>
      <p className="mx-auto mt-4 max-w-md text-muted">
        Cette adresse ne correspond à aucune pièce de la maison. Revenez à la collection.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full bg-burgundy px-6 py-3 text-sm text-ivory"
      >
        Retour à l&apos;accueil
      </Link>
    </Container>
  );
}
