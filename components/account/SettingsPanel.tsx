"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { changePassword, updateProfile, useAccount } from "@/lib/account";

const field = "mt-1.5 h-11 w-full rounded-full border border-beige bg-white px-4 outline-none";

export function SettingsPanel() {
  const { ready, profile } = useAccount();
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [pending, setPending] = useState(false);

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    setInfo("");
    try {
      await updateProfile(String(data.get("fullName") ?? ""), String(data.get("phone") ?? ""));
      setInfo("Profil enregistré.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Le profil n'a pas été enregistré.");
    } finally {
      setPending(false);
    }
  };

  const savePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    setInfo("");
    try {
      await changePassword(String(data.get("password") ?? ""));
      event.currentTarget.reset();
      setInfo("Mot de passe modifié.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Le mot de passe n'a pas été modifié.");
    } finally {
      setPending(false);
    }
  };

  if (!ready) return <p className="text-sm text-muted">Chargement...</p>;
  if (!profile) return <p className="text-sm text-muted">Connectez-vous pour modifier votre compte. <Link href="/compte/connexion/" className="underline">Connexion</Link></p>;

  return (
    <div className="grid gap-5">
      <form onSubmit={saveProfile} className="grid gap-3 rounded-[24px] bg-ivory p-5">
        <p className="font-serif text-2xl">Profil</p>
        <label className="text-sm">Nom<input name="fullName" required defaultValue={profile.fullName} className={field} /></label>
        <label className="text-sm">Téléphone<input name="phone" type="tel" required defaultValue={profile.phone} className={field} /></label>
        <p className="text-sm text-muted">{profile.email}</p>
        <button type="submit" disabled={pending} className="rounded-full bg-burgundy px-5 py-3 text-sm text-ivory disabled:opacity-60">Enregistrer</button>
      </form>
      <form onSubmit={savePassword} className="grid gap-3 rounded-[24px] bg-ivory p-5">
        <p className="font-serif text-2xl">Mot de passe</p>
        <label className="text-sm">Nouveau mot de passe<input name="password" type="password" required minLength={8} autoComplete="new-password" className={field} /></label>
        <button type="submit" disabled={pending} className="rounded-full border border-burgundy/35 px-5 py-3 text-sm text-burgundy disabled:opacity-60">Modifier</button>
      </form>
      {error ? <p role="alert" className="text-sm text-burgundy">{error}</p> : null}
      {info ? <p role="status" className="text-sm text-ink">{info}</p> : null}
    </div>
  );
}
