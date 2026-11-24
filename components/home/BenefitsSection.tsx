import { Gem, Headset, ShieldCheck, Truck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { benefits } from "@/lib/data";
import type { Benefit } from "@/lib/types";

const icons = {
  gem: Gem,
  truck: Truck,
  shield: ShieldCheck,
  headset: Headset,
} as const;

function BenefitItem({ benefit }: { benefit: Benefit }) {
  const Icon = icons[benefit.icon];

  return (
    <div className="flex items-start gap-3 px-2 py-4 sm:px-4">
      <Icon className="mt-0.5 h-6 w-6 shrink-0 text-ink" strokeWidth={1.4} aria-hidden="true" />
      <div>
        <p className="text-sm font-semibold tracking-wide text-ink">{benefit.title}</p>
        <p className="mt-0.5 text-sm text-muted">{benefit.text}</p>
      </div>
    </div>
  );
}

export function BenefitsSection() {
  return (
    <section className="border-y border-ink/10 bg-cream" aria-labelledby="benefits-title">
      <h2 id="benefits-title" className="sr-only">
        Nos engagements
      </h2>
      <Container className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:py-2">
        {benefits.map((benefit) => (
          <BenefitItem key={benefit.title} benefit={benefit} />
        ))}
      </Container>
    </section>
  );
}
