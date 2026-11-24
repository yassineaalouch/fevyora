"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { FlowerArt } from "@/components/icons/BrandIcons";
import { images } from "@/lib/data";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function BoutiqueNewsletter() {
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
    <section className="overflow-hidden rounded-[28px] bg-[#f6ebe4]" aria-labelledby="boutique-newsletter">
      <div className="grid items-center lg:grid-cols-[240px_minmax(0,1fr)_150px]">
        <div className="relative h-52 sm:h-60 lg:h-full lg:min-h-[210px]">
          <Image
            src={images.boutiqueNewsletter}
            alt="Femme en hijab bordeaux, lunettes à la main"
            fill
            sizes="(min-width: 1024px) 240px, 100vw"
            className="object-cover object-[center_20%]"
          />
        </div>
        <div className="px-5 py-8 sm:px-8">
          <h2 id="boutique-newsletter" className="flex items-center gap-2 font-serif text-3xl text-ink sm:text-4xl">
            Restez connectée
            <Sparkles className="h-5 w-5 text-burgundy" aria-hidden="true" />
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Inscrivez-vous à notre newsletter pour ne rien manquer de nos nouveautés et offres exclusives.
          </p>
          <form onSubmit={onSubmit} noValidate className="mt-5 flex max-w-xl flex-col gap-3 sm:flex-row">
            <label htmlFor="boutique-email" className="sr-only">
              Adresse email
            </label>
            <input
              id="boutique-email"
              type="email"
              autoComplete="email"
              placeholder="Votre adresse email..."
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
                setSuccess("");
              }}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "boutique-email-error" : undefined}
              className="h-12 flex-1 rounded-full border border-beige bg-ivory px-5 text-sm outline-none"
            />
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-burgundy px-6 text-sm text-ivory transition hover:bg-wine"
            >
              S&apos;inscrire
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
          {error ? (
            <p id="boutique-email-error" role="alert" className="mt-2 text-sm text-burgundy">
              {error}
            </p>
          ) : null}
          {success ? (
            <p role="status" className="mt-2 text-sm text-ink">
              {success}
            </p>
          ) : null}
        </div>
        <FlowerArt className="mx-auto hidden h-40 w-28 text-[#b08978] lg:block" />
      </div>
    </section>
  );
}
