"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { ChevronDown, Heart, RotateCcw, ShoppingBag, SlidersHorizontal, Star } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { FillImage } from "@/components/catalog/FillImage";
import { catalogColors, catalogSizes, collections, images } from "@/lib/data";
import { productHref, useLiveProducts } from "@/lib/live";
import { addToCart, toggleWishlist, useWishlist } from "@/lib/shop";
import type { Product } from "@/lib/types";

const pageSize = 6;
const priceCeiling = 1000;

type SortKey = "popular" | "price-asc" | "price-desc" | "new";

const sortLabels: Record<SortKey, string> = {
  popular: "Plus populaires",
  "price-asc": "Prix croissant",
  "price-desc": "Prix décroissant",
  new: "Nouveautés",
};

export function BoutiqueCatalog() {
  const wishlist = useWishlist();
  const [category, setCategory] = useState<string | null>(null);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(priceCeiling);
  const [sort, setSort] = useState<SortKey>("popular");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState({
    categories: true,
    sizes: true,
    colors: true,
    price: true,
  });

  const catalog = useLiveProducts();
  const filtered = useMemo(() => {
    const list = catalog.filter((product) => {
      if (category && product.collection !== category) return false;
      if (sizes.length > 0 && !sizes.some((size) => product.sizes?.includes(size))) return false;
      if (colors.length > 0 && !colors.some((color) => product.colors?.includes(color))) return false;
      if (product.price < minPrice || product.price > maxPrice) return false;
      return true;
    });

    return [...list].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "new") return (b.badge === "Nouveau" ? 1 : 0) - (a.badge === "Nouveau" ? 1 : 0);
      return (b.popularity ?? 0) - (a.popularity ?? 0);
    });
  }, [catalog, category, sizes, colors, minPrice, maxPrice, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const reset = () => {
    setCategory(null);
    setSizes([]);
    setColors([]);
    setMinPrice(0);
    setMaxPrice(priceCeiling);
    setSort("popular");
    setPage(1);
  };

  const toggleList = (list: string[], value: string, setter: (next: string[]) => void) => {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
    setPage(1);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
      <div className="lg:hidden">
        <button
          type="button"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-beige bg-ivory px-4 text-sm"
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen((open) => !open)}
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Filtres
        </button>
      </div>

      <aside className={`${filtersOpen ? "block" : "hidden"} lg:block`}>
        <FilterGroup
          title="Catégories"
          open={openGroups.categories}
          onToggle={() => setOpenGroups((groups) => ({ ...groups, categories: !groups.categories }))}
        >
          <ul className="space-y-1">
            {collections.map((item) => {
              const active = category === item.slug;
              return (
                <li key={item.slug}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setCategory(active ? null : item.slug);
                      setPage(1);
                    }}
                    className={`flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm ${active ? "bg-ivory font-medium text-ink" : "text-muted hover:text-ink"}`}
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full border ${active ? "border-burgundy bg-burgundy" : "border-beige bg-ivory"}`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </FilterGroup>

        <FilterGroup
          title="Taille"
          open={openGroups.sizes}
          onToggle={() => setOpenGroups((groups) => ({ ...groups, sizes: !groups.sizes }))}
        >
          <div className="flex flex-wrap gap-2">
            {catalogSizes.map((size) => {
              const active = sizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleList(sizes, size, setSizes)}
                  className={`h-9 min-w-10 rounded-full border px-3 text-sm ${active ? "border-burgundy bg-burgundy text-ivory" : "border-beige bg-ivory text-ink"}`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </FilterGroup>

        <FilterGroup
          title="Couleur"
          open={openGroups.colors}
          onToggle={() => setOpenGroups((groups) => ({ ...groups, colors: !groups.colors }))}
        >
          <div className="flex flex-wrap gap-2.5">
            {catalogColors.map((color) => {
              const active = colors.includes(color.id);
              return (
                <button
                  key={color.id}
                  type="button"
                  aria-label={color.label}
                  aria-pressed={active}
                  onClick={() => toggleList(colors, color.id, setColors)}
                  className={`h-7 w-7 rounded-full border-2 ${active ? "border-burgundy" : "border-transparent"}`}
                  style={{ backgroundColor: color.hex, boxShadow: "inset 0 0 0 2px #fff9f5" }}
                />
              );
            })}
          </div>
        </FilterGroup>

        <FilterGroup
          title="Prix"
          open={openGroups.price}
          onToggle={() => setOpenGroups((groups) => ({ ...groups, price: !groups.price }))}
        >
          <div className="space-y-3">
            <label className="block text-xs text-muted" htmlFor="price-min">
              Minimum {formatPrice(minPrice)}
            </label>
            <input
              id="price-min"
              type="range"
              min={0}
              max={priceCeiling}
              value={minPrice}
              onChange={(event) => {
                const next = Number(event.target.value);
                setMinPrice(Math.min(next, maxPrice));
                setPage(1);
              }}
              className="w-full accent-burgundy"
            />
            <label className="block text-xs text-muted" htmlFor="price-max">
              Maximum {maxPrice >= priceCeiling ? "1000+ MAD" : formatPrice(maxPrice)}
            </label>
            <input
              id="price-max"
              type="range"
              min={0}
              max={priceCeiling}
              value={maxPrice}
              onChange={(event) => {
                const next = Number(event.target.value);
                setMaxPrice(Math.max(next, minPrice));
                setPage(1);
              }}
              className="w-full accent-burgundy"
            />
          </div>
        </FilterGroup>

        <button
          type="button"
          onClick={reset}
          className="mt-2 inline-flex items-center gap-2 text-sm text-ink underline-offset-4 hover:underline"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Réinitialiser les filtres
        </button>

        <div className="relative mt-8 overflow-hidden rounded-[22px]">
          <Image
            src={images.fabric}
            alt=""
            width={500}
            height={360}
            className="h-44 w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-burgundy/85 via-burgundy/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4 text-ivory">
            <p className="font-script text-3xl">Etoffes</p>
            <p className="font-serif text-xl">Qualité Premium</p>
            <p className="text-xs text-ivory/80">Des tissus d&apos;exception</p>
          </div>
        </div>
      </aside>

      <div>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            {filtered.length} article{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
          </p>
          <label className="flex items-center gap-2 text-sm text-muted">
            Trier par
            <select
              value={sort}
              onChange={(event) => {
                setSort(event.target.value as SortKey);
                setPage(1);
              }}
              className="h-10 rounded-full border border-beige bg-ivory px-3 text-ink"
            >
              {(Object.keys(sortLabels) as SortKey[]).map((key) => (
                <option key={key} value={key}>
                  {sortLabels[key]}
                </option>
              ))}
            </select>
          </label>
        </div>

        {visible.length === 0 ? (
          <p className="rounded-[22px] bg-ivory px-6 py-16 text-center text-muted">
            Aucune pièce ne correspond à ces filtres.
          </p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((product) => (
              <li key={product.slug}>
                <BoutiqueCard product={product} wished={wishlist.includes(product.slug)} />
              </li>
            ))}
          </ul>
        )}

        {pageCount > 1 ? (
          <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
            {Array.from({ length: pageCount }, (_, index) => {
              const number = index + 1;
              const active = number === currentPage;
              return (
                <button
                  key={number}
                  type="button"
                  aria-current={active ? "page" : undefined}
                  onClick={() => setPage(number)}
                  className={`grid h-9 w-9 place-items-center rounded-full text-sm ${active ? "bg-burgundy text-ivory" : "bg-ivory text-ink"}`}
                >
                  {number}
                </button>
              );
            })}
          </nav>
        ) : null}
      </div>
    </div>
  );
}

function FilterGroup({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-ink/10 py-4">
      <button type="button" className="flex w-full items-center justify-between text-left" aria-expanded={open} onClick={onToggle}>
        <span className="text-sm font-semibold text-ink">{title}</span>
        <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {open ? <div className="pt-3">{children}</div> : null}
    </div>
  );
}

function BoutiqueCard({ product, wished }: { product: Product; wished: boolean }) {
  const [notice, setNotice] = useState("");

  return (
    <article className="overflow-hidden rounded-[22px] border border-beige/80 bg-ivory shadow-[0_10px_30px_rgba(43,23,21,0.04)]">
      <div className="relative aspect-[3/4] bg-cream">
        <Link href={productHref(product.slug)} className="absolute inset-0">
          <FillImage src={product.image} alt={product.imageAlt} sizes="(min-width: 1280px) 22vw, (min-width: 640px) 40vw, 100vw" />
          <span className="sr-only">{product.name}</span>
        </Link>
        {product.badge ? (
          <span
            className={`absolute top-3 left-3 rounded-full px-3 py-1 text-[11px] tracking-wide text-ivory ${product.badge === "Nouveau" ? "bg-ink" : "bg-burgundy"}`}
          >
            {product.badge}
          </span>
        ) : null}
        <button
          type="button"
          aria-pressed={wished}
          aria-label={wished ? `Retirer ${product.name} des favoris` : `Ajouter ${product.name} aux favoris`}
          onClick={() => toggleWishlist(product.slug)}
          className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-ivory/90 text-ink"
        >
          <Heart className="h-4 w-4" fill={wished ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="p-4">
        <h2 className="font-medium text-ink">{product.name}</h2>
        <p className="mt-1 flex items-baseline gap-2">
          <span className="text-sm font-semibold">{formatPrice(product.price)}</span>
          {product.compareAt ? (
            <span className="text-xs text-muted line-through">{formatPrice(product.compareAt)}</span>
          ) : null}
        </p>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted">
          <span className="flex text-[#c4a15a]" aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => (
              <Star key={index} className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
            ))}
          </span>
          <span className="sr-only">Note {product.rating ?? 5} sur 5</span>
          <span>({product.reviews ?? 0})</span>
        </p>
        <button
          type="button"
          onClick={() => {
            addToCart(product.slug);
            setNotice("Ajouté au panier");
            window.setTimeout(() => setNotice(""), 1600);
          }}
          className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-burgundy text-sm text-ivory transition hover:bg-wine"
        >
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          Ajouter au panier
        </button>
        <p role="status" className="mt-1 min-h-4 text-center text-xs text-muted">
          {notice}
        </p>
      </div>
    </article>
  );
}
