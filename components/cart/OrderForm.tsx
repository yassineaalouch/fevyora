"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { accessToken, getSession, listAddresses } from "@/lib/account";
type Line = {
  slug: string;
  quantity: number;
};

const ordersUrl =
  process.env.NEXT_PUBLIC_ORDERS_URL || "https://fevyora-orders.yaalouch77.workers.dev";

function ordersEndpoint() {
  const value = ordersUrl.trim().replace(/\/$/, "");
  if (!value) return "";
  return value.endsWith("/orders") ? value : `${value}/orders`;
}

export function OrderForm({ lines, onSuccess }: { lines: Line[]; onSuccess: () => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const profile = getSession()?.profile;
    const form = formRef.current;
    if (!profile || !form) return;
    const name = form.elements.namedItem("customerName");
    const phone = form.elements.namedItem("phone");
    if (name instanceof HTMLInputElement && !name.value) name.value = profile.fullName;
    if (phone instanceof HTMLInputElement && !phone.value) phone.value = profile.phone;
    listAddresses().then((addresses) => {
      const preferred = addresses.find((item) => item.isDefault) ?? addresses[0];
      if (!preferred || !formRef.current) return;
      const city = formRef.current.elements.namedItem("city");
      const address = formRef.current.elements.namedItem("address");
      if (city instanceof HTMLInputElement && !city.value) city.value = preferred.city;
      if (address instanceof HTMLInputElement && !address.value) address.value = preferred.address;
    }).catch(() => undefined);
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const endpoint = ordersEndpoint();
    if (!endpoint) {
      setError("Le service de commande n'est pas encore configuré.");
      return;
    }

    const form = new FormData(event.currentTarget);
    setPending(true);
    try {
      const token = await accessToken();
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          customerName: form.get("customerName"),
          phone: form.get("phone"),
          city: form.get("city"),
          address: form.get("address"),
          note: form.get("note"),
          items: lines,
        }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(payload.error || "La commande n'a pas pu être envoyée.");
        return;
      }
      onSuccess();
    } catch {
      setError("La connexion au service de commande a échoué.");
    } finally {
      setPending(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={onSubmit} className="mt-6 grid gap-3">
      <label className="grid gap-1 text-sm">
        Nom
        <input name="customerName" required autoComplete="name" className="h-11 rounded-full border border-beige bg-white px-4" />
      </label>
      <label className="grid gap-1 text-sm">
        Téléphone
        <input name="phone" type="tel" required autoComplete="tel" className="h-11 rounded-full border border-beige bg-white px-4" />
      </label>
      <label className="grid gap-1 text-sm">
        Ville
        <input name="city" required autoComplete="address-level2" className="h-11 rounded-full border border-beige bg-white px-4" />
      </label>
      <label className="grid gap-1 text-sm">
        Adresse
        <input name="address" required autoComplete="street-address" className="h-11 rounded-full border border-beige bg-white px-4" />
      </label>
      <label className="grid gap-1 text-sm">
        Note
        <input name="note" className="h-11 rounded-full border border-beige bg-white px-4" />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-full rounded-full bg-burgundy px-5 py-3 text-sm text-ivory transition hover:bg-wine disabled:opacity-60"
      >
        {pending ? "Envoi..." : "Passer la commande"}
      </button>
      {error ? <p role="alert" className="text-sm text-burgundy">{error}</p> : null}
    </form>
  );
}
