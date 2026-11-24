"use client";

import { FormEvent, useState } from "react";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AccountPanel() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!emailPattern.test(email.trim())) {
      setSuccess("");
      setError("Veuillez entrer une adresse email valide.");
      return;
    }
    setError("");
    setSuccess("Merci. Nous vous préviendrons à cette adresse dès l'ouverture de l'espace client.");
    setEmail("");
  };

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-lg rounded-[24px] bg-ivory p-6 sm:p-8">
      <p className="text-sm leading-relaxed text-muted">
        L&apos;espace client ouvre bientôt. Laissez votre email pour être prévenue en premier.
      </p>
      <label htmlFor="account-email" className="mt-6 block text-sm text-ink">
        Email
      </label>
      <input
        id="account-email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="mt-1.5 h-12 w-full rounded-full border border-beige bg-cream px-4 outline-none"
      />
      {error ? (
        <p role="alert" className="mt-3 text-sm text-burgundy">
          {error}
        </p>
      ) : null}
      {success ? (
        <p role="status" className="mt-3 text-sm text-ink">
          {success}
        </p>
      ) : null}
      <button
        type="submit"
        className="mt-5 rounded-full bg-burgundy px-6 py-3 text-sm text-ivory transition hover:bg-wine"
      >
        Me prévenir
      </button>
    </form>
  );
}
