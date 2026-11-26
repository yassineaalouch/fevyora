import { Suspense } from "react";
import type { Metadata } from "next";
import { PieceView } from "@/components/catalog/PieceView";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = { title: "Pièce" };

export default function PiecePage() {
  return (
    <Suspense fallback={<Container className="py-16 text-sm text-muted">Chargement...</Container>}>
      <PieceView />
    </Suspense>
  );
}
