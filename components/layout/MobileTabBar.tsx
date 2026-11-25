"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Heart, Home, LayoutGrid, ShoppingBag, User } from "lucide-react";
import { useCart, useWishlist } from "@/lib/shop";

const tabs = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/collections", label: "Collections", icon: LayoutGrid },
  { href: "/favoris", label: "Favoris", icon: Heart },
  { href: "/panier", label: "Panier", icon: ShoppingBag },
  { href: "/compte", label: "Compte", icon: User },
] as const;

function active(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileTabBar() {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const cart = useCart();
  const wishlist = useWishlist();
  const count = ready ? cart.reduce((sum, line) => sum + line.quantity, 0) : 0;
  const saved = ready ? wishlist.length : 0;

  useEffect(() => setReady(true), []);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-ivory/95 backdrop-blur lg:hidden"
      aria-label="Navigation mobile"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5 px-1 pt-1.5 pb-[max(0.4rem,env(safe-area-inset-bottom))]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const on = active(pathname, tab.href);
          const badge = tab.href === "/panier" ? count : tab.href === "/favoris" ? saved : 0;
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={on ? "page" : undefined}
                className={`relative flex flex-col items-center gap-0.5 py-1 text-[10px] ${on ? "text-burgundy" : "text-muted"}`}
              >
                <Icon className="h-5 w-5" strokeWidth={1.6} fill={on && tab.href === "/favoris" ? "currentColor" : "none"} />
                {badge > 0 ? (
                  <span className="absolute top-0 right-[22%] flex h-4 min-w-4 items-center justify-center rounded-full bg-burgundy px-1 text-[9px] leading-none text-ivory">
                    {badge > 9 ? "9+" : badge}
                  </span>
                ) : null}
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
