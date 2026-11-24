"use client";

import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";
import { HangerIcon, SocialIcon, StarMark } from "@/components/icons/BrandIcons";
import { Container } from "@/components/ui/Container";
import { socialLinks } from "@/lib/data";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = email.trim();

    if (!value) {
      setSuccess("");
      setError("Veuillez entrer votre adresse email.");
      return;
    }

    if (!emailPattern.test(value)) {
      setSuccess("");
      setError("Veuillez entrer une adresse email valide.");
      return;
    }

    setError("");
    setSuccess("Merci. Vous êtes bien inscrite à la newsletter.");
    setEmail("");
  };

  return (
    <section className="relative bg-burgundy" aria-labelledby="newsletter-title">
      <div className="absolute inset-x-0 top-0 h-1/2 bg-ivory" aria-hidden="true" />
      <Container className="relative py-3 sm:py-4">
        <div className="rounded-[28px] bg-[#f7f1ea] px-5 py-5 sm:px-7 sm:py-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-6">
            <div className="flex min-w-0 items-center gap-4 lg:w-[400px] lg:shrink-0">
              <HangerIcon className="h-12 w-12 shrink-0 text-ink sm:h-14 sm:w-14" />
              <div>
                <h2 id="newsletter-title" className="flex items-center gap-2 font-serif text-[1.65rem] leading-none font-medium text-ink sm:text-3xl">
                  Restez connectée
                  <StarMark className="h-3.5 w-3.5 text-[#c4a574]" />
                </h2>
                <p className="mt-1.5 text-[13px] leading-snug text-muted">
                  Inscrivez-vous à notre newsletter pour ne rien manquer de nos nouveautés et offres
                  exclusives.
                </p>
              </div>
            </div>

            <form onSubmit={onSubmit} noValidate className="min-w-0 flex-1">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label htmlFor="newsletter-email" className="sr-only">
                  Adresse email
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="Votre adresse email..."
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "newsletter-error" : success ? "newsletter-success" : undefined}
                  className="h-11 w-full rounded-full border border-beige/80 bg-ivory px-5 text-sm outline-none placeholder:text-muted/70 sm:min-w-0 sm:flex-1"
                />
                <button
                  type="submit"
                  className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-burgundy px-5 text-sm text-ivory transition hover:bg-wine"
                >
                  S&apos;inscrire
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              {error ? (
                <p id="newsletter-error" role="alert" className="mt-2 text-sm text-burgundy">
                  {error}
                </p>
              ) : null}
              {success ? (
                <p id="newsletter-success" role="status" className="mt-2 text-sm text-ink">
                  {success}
                </p>
              ) : null}
            </form>

            <div className="hidden h-8 w-px shrink-0 bg-ink/15 lg:block" aria-hidden="true" />

            <ul className="flex items-center gap-4 text-ink lg:shrink-0">
              {socialLinks.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.name}
                    className="grid h-8 w-8 place-items-center transition hover:text-burgundy"
                  >
                    <SocialIcon name={item.icon} className="h-[18px] w-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
