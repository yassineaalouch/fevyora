"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronRight,
  ClipboardList,
  Heart,
  Headset,
  Info,
  LogOut,
  Mail,
  MapPin,
  Settings,
  User,
  Users,
} from "lucide-react";
import { logout, useAccount } from "@/lib/account";

const links = [
  { href: "/compte/commandes/", label: "Mes commandes", icon: ClipboardList },
  { href: "/favoris/", label: "Mes favoris", icon: Heart },
  { href: "/compte/adresses/", label: "Mes adresses", icon: MapPin },
  { href: "/favoris/", label: "Ma liste de souhaits", icon: Bell },
  { href: "/compte/parrainage/", label: "Parrainage", icon: Users },
  { href: "/contact/", label: "Aide & Support", icon: Headset },
  { href: "/a-propos/", label: "À propos de FEVYORA", icon: Info },
  { href: "/contact/", label: "Nous contacter", icon: Mail },
];

export function AccountHome() {
  const router = useRouter();
  const { ready, profile } = useAccount();

  const signOut = () => {
    logout();
    router.push("/compte/");
    router.refresh();
  };

  return (
    <div className="mx-auto w-full max-w-xl px-4 pt-4 pb-8 lg:py-16">
      <section className="relative">
        <div className="h-28 rounded-[28px] bg-[linear-gradient(145deg,#6d2836_0%,#4a101c_58%,#3c0d16_100%)]" />
        <Link href="/compte/parametres/" aria-label="Paramètres" className="absolute top-4 right-4 grid h-9 w-9 place-items-center text-ivory">
          <Settings className="h-5 w-5" strokeWidth={1.6} />
        </Link>
        <div className="absolute top-[4.6rem] left-6 grid h-[4.25rem] w-[4.25rem] place-items-center rounded-full bg-ivory text-muted shadow-[0_8px_20px_rgba(74,16,28,0.12)]">
          <User className="h-7 w-7" strokeWidth={1.5} aria-hidden="true" />
        </div>
        <div className="px-6 pt-6">
          <p className="text-[15px] font-medium tracking-[0.14em] text-ink uppercase">
            {profile?.fullName || "Mon compte"}
          </p>
          <p className="mt-0.5 text-sm text-muted">{profile?.email || "Espace client FEVYORA"}</p>
        </div>
      </section>

      {!ready ? <p className="mt-6 text-sm text-muted">Chargement...</p> : null}

      {ready && !profile ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Link href="/compte/connexion/" className="rounded-full bg-burgundy px-5 py-3 text-center text-sm text-ivory">Se connecter</Link>
          <Link href="/compte/inscription/" className="rounded-full border border-burgundy/35 px-5 py-3 text-center text-sm text-burgundy">Créer un compte</Link>
        </div>
      ) : null}

      <ul className="mt-5 border-t border-beige">
        {links.map((item) => (
          <li key={item.label} className="border-b border-beige/80">
            <Link href={item.href} className="flex items-center gap-3.5 px-3 py-3.5 text-[15px] text-ink">
              <item.icon className="h-[1.15rem] w-[1.15rem] text-burgundy/80" strokeWidth={1.6} aria-hidden="true" />
              <span className="flex-1">{item.label}</span>
              <ChevronRight className="h-4 w-4 text-muted/80" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>

      {profile ? (
        <button type="button" onClick={signOut} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-burgundy/35 py-3 text-sm text-burgundy">
          <LogOut className="h-4 w-4" strokeWidth={1.7} aria-hidden="true" />
          Se déconnecter
        </button>
      ) : null}
    </div>
  );
}
