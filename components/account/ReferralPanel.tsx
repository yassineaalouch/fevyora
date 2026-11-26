"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { referralInfo, useAccount } from "@/lib/account";

export function ReferralPanel() {
  const { ready, profile } = useAccount();
  const [code, setCode] = useState("");
  const [count, setCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!profile) return;
    referralInfo().then((info) => {
      setCode(info.code);
      setCount(info.count);
    }).catch(() => undefined);
  }, [profile]);

  if (!ready) return <p className="text-sm text-muted">Chargement...</p>;
  if (!profile) return <p className="text-sm text-muted">Connectez-vous pour obtenir votre code. <Link href="/compte/connexion/" className="underline">Connexion</Link></p>;

  const link = `https://fevyora.com/compte/inscription/?parrain=${code}`;

  return (
    <div className="rounded-[24px] bg-ivory p-5">
      <p className="font-serif text-3xl">{code || "..."}</p>
      <p className="mt-2 text-sm text-muted">{count} inscription{count > 1 ? "s" : ""} avec votre code.</p>
      <p className="mt-4 break-all text-sm">{link}</p>
      <button
        type="button"
        className="mt-4 rounded-full bg-burgundy px-5 py-3 text-sm text-ivory"
        onClick={() => {
          void navigator.clipboard.writeText(link);
          setCopied(true);
        }}
      >
        {copied ? "Lien copié" : "Copier le lien"}
      </button>
    </div>
  );
}
