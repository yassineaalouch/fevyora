"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { mainNav, socialLinks } from "@/lib/data";
import type { NavLink } from "@/lib/types";
import { FlowerArt, SocialIcon } from "@/components/icons/BrandIcons";
import { useCart, useWishlist } from "@/lib/shop";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function cartCountLabel(count: number) {
  if (count > 9) return "9+";
  return String(count);
}

export function Header() {
  const pathname = usePathname();
  const cart = useCart();
  const wishlist = useWishlist();
  const count = cart.reduce((sum, line) => sum + line.quantity, 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [canAnimate, setCanAnimate] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMenuOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    const frame = requestAnimationFrame(() => setCanAnimate(true));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const publish = () => {
      if (window.scrollY > 12) return;
      document.documentElement.style.setProperty("--nav-height", `${el.offsetHeight}px`);
    };
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const motion = canAnimate ? "transition-all duration-500 ease-out" : "";

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-40 ${motion} ${
        scrolled || menuOpen
          ? "bg-cream shadow-[0_1px_0_rgba(43,23,21,0.08)]"
          : "bg-cream shadow-none lg:bg-transparent"
      }`}
    >
      <Container className={`${motion} ${scrolled ? "py-2" : "py-2.5 lg:pt-3.5 lg:pb-12"}`}>
        <div className="relative grid grid-cols-[auto_1fr_auto] items-center gap-3 lg:grid-cols-[1fr_auto_1fr]">
          <div className="flex items-center justify-self-start">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-ivory lg:hidden"
              aria-label="Ouvrir le menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <Link
              href="/"
              aria-label="FEVYORA, accueil"
              aria-hidden={!scrolled}
              tabIndex={scrolled ? undefined : -1}
              className={`hidden overflow-hidden lg:inline-flex ${motion} ${
                scrolled ? "w-11 opacity-100" : "pointer-events-none w-0 opacity-0"
              }`}
            >
              <Image
                src="/images/logo/logo.webp"
                alt=""
                width={337}
                height={347}
                className="h-11 w-11 shrink-0 object-contain"
              />
            </Link>
            <form
              action="/recherche"
              role="search"
              className={`hidden lg:block ${motion} ${scrolled ? "ml-3 w-[10.5rem] xl:w-60" : "ml-0 w-[13.5rem] xl:w-[15.5rem]"}`}
            >
              <label htmlFor="site-search" className="sr-only">
                Rechercher un article
              </label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <input
                  id="site-search"
                  name="q"
                  type="search"
                  placeholder="Rechercher un article..."
                  className="h-9 w-full rounded-full border border-beige/90 bg-ivory pr-4 pl-10 text-[13px] text-ink outline-none placeholder:text-muted/75 focus:border-burgundy/30"
                />
              </div>
            </form>
          </div>

          <div
            className={`hidden min-w-0 justify-self-center overflow-hidden lg:block ${motion} ${
              scrolled ? "pointer-events-none max-h-0 max-w-0 opacity-0" : "max-h-28 max-w-sm opacity-100"
            }`}
          >
            <Link
              href="/"
              aria-label="FEVYORA, accueil"
              aria-hidden={scrolled}
              tabIndex={scrolled ? -1 : undefined}
              className="inline-flex"
            >
              <Logo size="lg" />
            </Link>
          </div>

          <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 lg:hidden">
            <Link href="/" aria-label="FEVYORA, accueil" className="pointer-events-auto inline-flex">
              <Logo size="sm" />
            </Link>
          </div>

          <nav
            className={`absolute left-1/2 z-30 hidden lg:block ${motion} ${
              scrolled ? "top-1/2 -translate-x-1/2 -translate-y-1/2" : "top-full -translate-x-1/2 translate-y-2.5"
            }`}
            aria-label="Navigation principale"
          >
            <ul className={`flex items-center gap-8 whitespace-nowrap text-[14px] text-ink ${motion} ${scrolled ? "gap-7 text-[13px]" : ""}`}>
              {mainNav.map((item) => (
                <li
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => item.children && setOpenMenu(item.label)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  {item.children ? (
                    <DesktopMenu
                      item={item}
                      pathname={pathname}
                      open={openMenu === item.label}
                      onToggle={() =>
                        setOpenMenu((current) => (current === item.label ? null : item.label))
                      }
                      onClose={() => setOpenMenu(null)}
                    />
                  ) : (
                    <Link
                      href={item.href}
                      aria-current={isActive(pathname, item.href) ? "page" : undefined}
                      className={`nav-link ${isActive(pathname, item.href) ? "nav-link-active" : ""}`}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className={`flex items-center justify-end gap-0.5 sm:gap-1 ${scrolled ? "col-start-3" : ""}`}>
            <Link href="/recherche" aria-label="Rechercher" className="icon-link mobile-only">
              <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </Link>
            <Link href="/compte" aria-label="Compte" className="icon-link desktop-only">
              <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </Link>
            <Link href="/favoris" aria-label="Favoris" className="icon-link">
              <Heart className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </Link>
            <Link href="/panier" aria-label={`Panier, ${count} article${count > 1 ? "s" : ""}`} className="icon-link desktop-only">
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
              <span className="absolute -top-0.5 -right-0.5 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-burgundy px-1 text-[9px] leading-none text-ivory">
                {cartCountLabel(count)}
              </span>
            </Link>
          </div>
        </div>
      </Container>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label="Fermer le menu"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-[min(100%,22.5rem)] flex-col overflow-hidden bg-burgundy text-ivory shadow-2xl">
            <FlowerArt className="pointer-events-none absolute -right-6 bottom-16 h-56 w-40 text-[#e7c98a]/35" />
            <div className="flex items-start justify-between px-6 pt-8">
              <Logo tone="light" size="md" />
              <button
                ref={closeRef}
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full text-ivory"
                aria-label="Fermer le menu"
                onClick={() => setMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ul className="relative mt-8 flex-1 space-y-1 overflow-y-auto px-4 pb-6">
              {[
                { href: "/", label: "Accueil" },
                { href: "/collections", label: "Collections" },
                { href: "/favoris", label: "Favoris", badge: wishlist.length },
                { href: "/panier", label: "Panier", badge: count },
                { href: "/compte", label: "Compte" },
                { href: "/a-propos", label: "À propos" },
                { href: "/contact", label: "Contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 text-lg ${
                      isActive(pathname, item.href) ? "bg-ivory/15" : ""
                    }`}
                  >
                    {item.label}
                    {item.badge ? (
                      <span className="grid h-5 min-w-5 place-items-center rounded-full bg-ivory px-1 text-xs text-burgundy">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="relative flex gap-4 px-8 pt-2 pb-8">
              {socialLinks.map((item) => (
                <li key={item.name}>
                  <a href={item.href} target="_blank" rel="noreferrer" aria-label={item.name} className="text-ivory">
                    <SocialIcon name={item.icon} className="h-5 w-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function DesktopMenu({
  item,
  pathname,
  open,
  onToggle,
  onClose,
}: {
  item: NavLink;
  pathname: string;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const menuId = useId();
  const active = isActive(pathname, item.href);

  return (
    <>
      <button
        type="button"
        className={`nav-link gap-1 ${active ? "nav-link-active" : ""}`}
        aria-expanded={open}
        aria-controls={menuId}
        aria-current={active ? "page" : undefined}
        onClick={onToggle}
      >
        {item.label}
        <ChevronDown className={`h-3 w-3 transition ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      <div
        id={menuId}
        className={`absolute top-full left-1/2 z-20 w-56 -translate-x-1/2 pt-3 ${open ? "block" : "hidden"}`}
      >
        <ul className="rounded-2xl border border-beige/80 bg-ivory p-2 shadow-[0_18px_40px_rgba(43,23,21,0.08)]">
          {item.children?.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                className="block rounded-xl px-3 py-2.5 text-sm text-ink hover:bg-cream"
                onClick={onClose}
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
