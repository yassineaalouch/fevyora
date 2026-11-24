import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

type EditorialHeaderProps = {
  eyebrow: string;
  title: string;
  text?: string;
  children?: ReactNode;
};

export function EditorialHeader({ eyebrow, title, text, children }: EditorialHeaderProps) {
  return (
    <header className="border-b border-ink/10 bg-cream">
      <Container className="py-12 sm:py-16 lg:py-20">
        <p className="text-[11px] tracking-[0.38em] text-muted uppercase">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-serif text-5xl leading-tight font-medium text-ink sm:text-6xl">
          {title}
        </h1>
        {text ? <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">{text}</p> : null}
        {children}
      </Container>
    </header>
  );
}
