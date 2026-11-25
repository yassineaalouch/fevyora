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
    <section className="bg-ivory" aria-labelledby="newsletter-title">
      <Container className="py-8 sm:py-10 lg:py-12">
        <div className="rounded-[24px] bg-[#f3ebe3] px-5 py-4 sm:px-7 lg:px-8 lg:py-[18px]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
            <div className="flex min-w-0 items-center gap-3.5 lg:w-[340px] lg:shrink-0">
              <HangerIcon className="h-10 w-10 shrink-0 text-ink sm:h-11 sm:w-11" />
              <div>
                <h2 id="newsletter-title" className="flex items-start gap-1.5 font-serif text-[1.55rem] leading-none font-medium text-ink sm:text-[1.7rem]">
                  Restez connectée
                  <StarMark className="mt-0.5 h-3 w-3 shrink-0 text-[#c6a15a]" />
                </h2>
                <p className="mt-1.5 text-[13px] leading-snug text-[#7d655e]">
                  Inscrivez-vous à notre newsletter pour ne rien manquer de nos nouveautés et offres
                  exclusives.
                </p>
              </div>
            </div>

            <form onSubmit={onSubmit} noValidate className="min-w-0 flex-1">
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
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
                  className="h-11 w-full min-w-0 rounded-full border border-[#eadfd4] bg-white px-5 text-sm text-ink outline-none placeholder:text-[#a08d86] sm:min-w-[220px] sm:flex-1"
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

            <div className="hidden h-7 w-px shrink-0 bg-ink/20 lg:block" aria-hidden="true" />

            <ul className="flex items-center gap-3.5 text-ink lg:shrink-0 lg:gap-4">
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
