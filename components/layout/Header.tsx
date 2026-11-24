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
import { mainNav } from "@/lib/data";
import type { NavLink } from "@/lib/types";
import { useCart } from "@/lib/shop";

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
          : "bg-transparent shadow-none"
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

          <div className="justify-self-center lg:hidden">
            <Link href="/" aria-label="FEVYORA, accueil" className="inline-flex">
              {scrolled ? (
                <Image
                  src="/images/logo/logo.webp"
                  alt=""
                  width={337}
                  height={347}
                  className="h-10 w-10 object-contain"
                />
              ) : (
                <Logo size="lg" />
              )}
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
            <Link href="/compte" aria-label="Compte" className="icon-link">
              <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </Link>
            <Link href="/favoris" aria-label="Favoris" className="icon-link">
              <Heart className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </Link>
            <Link href="/panier" aria-label={`Panier, ${count} article${count > 1 ? "s" : ""}`} className="icon-link">
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
          <div className="absolute inset-y-0 left-0 flex w-[min(100%,22rem)] flex-col bg-cream shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4">
              <Logo size="sm" />
              <button
                ref={closeRef}
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-ivory"
                aria-label="Fermer le menu"
                onClick={() => setMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form action="/recherche" role="search" className="px-5 pb-4">
              <label htmlFor="mobile-search" className="sr-only">
                Rechercher un article
              </label>
              <div className="relative">
                <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                <input
                  id="mobile-search"
                  name="q"
                  type="search"
                  placeholder="Rechercher un article..."
                  className="h-11 w-full rounded-full border border-beige bg-ivory pr-4 pl-10 text-base outline-none"
                />
              </div>
            </form>
            <ul className="flex-1 space-y-1 overflow-y-auto px-3 pb-8">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    className="block rounded-xl px-3 py-3 font-serif text-2xl text-ink hover:bg-ivory"
                  >
                    {item.label}
                  </Link>
                  {item.children ? (
                    <ul className="mb-2 ml-3 border-l border-beige pl-3">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block rounded-lg px-3 py-2 text-sm text-muted hover:bg-ivory hover:text-ink"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
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
