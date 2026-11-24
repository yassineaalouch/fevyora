"use client";

import { FormEvent, useState } from "react";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (name.trim().length < 2) {
      setSuccess("");
      setError("Veuillez indiquer votre nom.");
      return;
    }
    if (!emailPattern.test(email.trim())) {
      setSuccess("");
      setError("Veuillez entrer une adresse email valide.");
      return;
    }
    if (message.trim().length < 10) {
      setSuccess("");
      setError("Votre message doit contenir au moins 10 caractères.");
      return;
    }

    setError("");
    setSuccess("Merci. Votre message a bien été préparé. Notre équipe vous répondra avec soin.");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-[24px] bg-ivory p-6 sm:p-8">
      <div>
        <label htmlFor="contact-name" className="text-sm text-ink">
          Nom
        </label>
        <input
          id="contact-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          className="mt-1.5 h-12 w-full rounded-2xl border border-beige bg-cream px-4 outline-none"
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="text-sm text-ink">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          className="mt-1.5 h-12 w-full rounded-2xl border border-beige bg-cream px-4 outline-none"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="text-sm text-ink">
          Message
        </label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={5}
          className="mt-1.5 w-full rounded-2xl border border-beige bg-cream px-4 py-3 outline-none"
        />
      </div>
      {error ? (
        <p role="alert" className="text-sm text-burgundy">
          {error}
        </p>
      ) : null}
      {success ? (
        <p role="status" className="text-sm text-ink">
          {success}
        </p>
      ) : null}
      <button
        type="submit"
        className="rounded-full bg-burgundy px-6 py-3 text-sm text-ivory transition hover:bg-wine"
      >
        Envoyer
      </button>
    </form>
  );
}
