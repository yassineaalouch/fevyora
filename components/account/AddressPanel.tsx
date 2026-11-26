"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { addAddress, deleteAddress, listAddresses, useAccount, type Address } from "@/lib/account";

const field = "mt-1.5 h-11 w-full rounded-full border border-beige bg-white px-4 outline-none";

export function AddressPanel() {
  const { ready, profile } = useAccount();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!profile) return;
    listAddresses().then(setAddresses).catch((cause: unknown) => {
      setError(cause instanceof Error ? cause.message : "Les adresses n'ont pas pu être lues.");
    });
  }, [profile]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setPending(true);
    setError("");
    try {
      setAddresses(await addAddress({
        label: String(data.get("label") ?? ""),
        city: String(data.get("city") ?? ""),
        address: String(data.get("address") ?? ""),
        phone: String(data.get("phone") ?? profile?.phone ?? ""),
        isDefault: data.get("isDefault") === "on",
      }));
      form.reset();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "L'adresse n'a pas été enregistrée.");
    } finally {
      setPending(false);
    }
  };

  const remove = async (id: string) => {
    setError("");
    try {
      setAddresses(await deleteAddress(id));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "L'adresse n'a pas été retirée.");
    }
  };

  if (!ready) return <p className="text-sm text-muted">Chargement...</p>;
  if (!profile) return <p className="text-sm text-muted">Connectez-vous pour enregistrer une adresse. <Link href="/compte/connexion/" className="underline">Connexion</Link></p>;

  return (
    <div className="grid gap-5">
      <ul className="grid gap-3">
        {addresses.map((item) => (
          <li key={item.id} className="rounded-[24px] bg-ivory p-5">
            <p className="text-sm text-muted">{item.label}{item.isDefault ? " · Par défaut" : ""}</p>
            <p className="mt-1">{item.address}, {item.city}</p>
            <p className="text-sm text-muted">{item.phone}</p>
            <button type="button" onClick={() => remove(item.id)} className="mt-3 text-sm text-burgundy underline">Retirer</button>
          </li>
        ))}
      </ul>
      <form onSubmit={onSubmit} className="grid gap-3 rounded-[24px] bg-ivory p-5">
        <p className="font-serif text-2xl">Nouvelle adresse</p>
        <label className="text-sm">Libellé<input name="label" placeholder="Maison" className={field} /></label>
        <label className="text-sm">Ville<input name="city" required autoComplete="address-level2" className={field} /></label>
        <label className="text-sm">Adresse<input name="address" required autoComplete="street-address" className={field} /></label>
        <label className="text-sm">Téléphone<input name="phone" type="tel" required defaultValue={profile.phone} className={field} /></label>
        <label className="flex items-center gap-2 text-sm"><input name="isDefault" type="checkbox" /> Adresse par défaut</label>
        {error ? <p role="alert" className="text-sm text-burgundy">{error}</p> : null}
        <button type="submit" disabled={pending} className="rounded-full bg-burgundy px-5 py-3 text-sm text-ivory disabled:opacity-60">
          {pending ? "Envoi..." : "Enregistrer"}
        </button>
      </form>
    </div>
  );
}
