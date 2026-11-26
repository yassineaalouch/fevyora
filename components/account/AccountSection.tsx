import Link from "next/link";
import type { ReactNode } from "react";

export function AccountSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-6 lg:py-16">
      <Link href="/compte/" className="text-sm text-muted">Compte</Link>
      <h1 className="mt-2 font-serif text-4xl text-ink">{title}</h1>
      <div className="mt-6">{children}</div>
    </div>
  );
}
