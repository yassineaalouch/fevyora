"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { searchProducts } from "@/lib/data";

export function SearchExperience() {
  const params = useSearchParams();
  const router = useRouter();
  const query = params.get("q") ?? "";
  const [value, setValue] = useState(query);
  const results = searchProducts(query);

  useEffect(() => {
    setValue(query);
  }, [query]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = value.trim();
    router.push(next ? `/recherche?q=${encodeURIComponent(next)}` : "/recherche");
  };

  return (
    <div>
      <form onSubmit={onSubmit} role="search" className="mb-10 flex flex-col gap-3 sm:flex-row">
        <label htmlFor="search-page" className="sr-only">
          Rechercher un article
        </label>
        <input
          id="search-page"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Rechercher un article..."
          className="h-12 flex-1 rounded-full border border-beige bg-ivory px-5 text-base outline-none"
        />
        <button
          type="submit"
          className="h-12 rounded-full bg-burgundy px-6 text-sm text-ivory transition hover:bg-wine"
        >
          Rechercher
        </button>
      </form>
      <p className="mb-6 text-sm text-muted">
        {query
          ? `${results.length} résultat${results.length > 1 ? "s" : ""} pour « ${query} »`
          : "Toutes les pièces de la saison"}
      </p>
      <ProductGrid products={results} />
    </div>
  );
}
