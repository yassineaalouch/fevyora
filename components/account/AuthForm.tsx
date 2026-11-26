"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { listFavorites, login, recover, referredBy, signup, syncFavorite } from "@/lib/account";
import { getWishSnapshot, replaceWishlist } from "@/lib/shop";

const field = "mt-1.5 h-11 w-full rounded-full border border-beige bg-white px-4 outline-none";

async function mergeFavorites() {
  const remote = await listFavorites();
  const local = getWishSnapshot();
  replaceWishlist([...new Set([...remote, ...local])]);
  await Promise.all(local.filter((slug) => !remote.includes(slug)).map((slug) => syncFavorite(slug, true)));
}

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [pending, setPending] = useState(false);
  const [forgot, setForgot] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setInfo("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    setPending(true);
    try {
      if (forgot) {
        await recover(email);
        setInfo("Si un compte existe, un email de réinitialisation a été envoyé.");
        return;
      }
      if (mode === "signup") {
        const result = await signup({
          fullName: String(form.get("fullName") ?? ""),
          email,
          phone: String(form.get("phone") ?? ""),
          password,
        });
        if (result.confirmEmail) {
          setInfo("Compte créé. Connectez-vous avec cet email.");
          return;
        }
      } else {
        await login(email, password);
      }
      await mergeFavorites().catch(() => undefined);
      router.push("/compte/");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "La demande n'a pas abouti.");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-3 rounded-[28px] bg-ivory p-5 sm:p-6">
      <p className="font-serif text-3xl text-ink">{forgot ? "Mot de passe oublié" : mode === "signup" ? "Créer un compte" : "Connexion"}</p>
      {mode === "signup" && !forgot ? (
        <>
          <label className="text-sm">Nom
            <input name="fullName" required autoComplete="name" className={field} />
          </label>
          <label className="text-sm">Téléphone
            <input name="phone" type="tel" required autoComplete="tel" className={field} />
          </label>
        </>
      ) : null}
      <label className="text-sm">Email
        <input name="email" type="email" required autoComplete="email" className={field} />
      </label>
      {forgot ? null : (
        <label className="text-sm">Mot de passe
          <input name="password" type="password" required minLength={8} autoComplete={mode === "signup" ? "new-password" : "current-password"} className={field} />
        </label>
      )}
      {mode === "signup" && referredBy() ? <p className="text-sm text-muted">Code parrain : {referredBy()}</p> : null}
      {error ? <p role="alert" className="text-sm text-burgundy">{error}</p> : null}
      {info ? <p role="status" className="text-sm text-ink">{info}</p> : null}
      <button type="submit" disabled={pending} className="mt-1 rounded-full bg-burgundy px-5 py-3 text-sm text-ivory disabled:opacity-60">
        {pending ? "Envoi..." : forgot ? "Envoyer le lien" : mode === "signup" ? "Créer mon compte" : "Se connecter"}
      </button>
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
        {mode === "login" ? (
          <button type="button" className="underline" onClick={() => { setForgot((value) => !value); setError(""); setInfo(""); }}>
            {forgot ? "Retour à la connexion" : "Mot de passe oublié"}
          </button>
        ) : null}
        <Link href={mode === "signup" ? "/compte/connexion/" : "/compte/inscription/"} className="underline">
          {mode === "signup" ? "J'ai déjà un compte" : "Créer un compte"}
        </Link>
      </div>
    </form>
  );
}
