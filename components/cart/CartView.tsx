"use client";

import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { OrderForm } from "@/components/cart/OrderForm";
import { FillImage } from "@/components/catalog/FillImage";
import { apiBase } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { productHref, useLiveProducts } from "@/lib/live";
import { clearCart, removeFromCart, setQuantity, useCart } from "@/lib/shop";

export function CartView() {
  const cart = useCart();
  const catalog = useLiveProducts();
  const [placed, setPlaced] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const lines = cart
    .map((line) => {
      const product = catalog.find((item) => item.slug === line.slug);
      return product ? { ...line, product } : null;
    })
    .filter((line): line is NonNullable<typeof line> => line !== null);

  const total = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

  if (lines.length === 0) {
    return (
      <div className="rounded-[24px] border border-beige bg-ivory px-6 py-16 text-center">
        <p className="font-serif text-3xl text-ink">Votre panier est vide</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
          {placed
            ? "Commande envoyée. Nous vous appellerons pour confirmer la livraison."
            : "Les pièces que vous choisissez apparaîtront ici, prêtes pour la livraison partout au Maroc."}
        </p>
        <Link
          href="/boutique"
          className="mt-8 inline-flex rounded-full bg-burgundy px-6 py-3 text-sm text-ivory transition hover:bg-wine"
        >
          Découvrir la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
      <ul className="divide-y divide-ink/10 border-y border-ink/10">
        {lines.map((line) => (
          <li key={line.slug} className="flex gap-4 py-5">
            <Link
              href={productHref(line.slug)}
              className="relative h-28 w-20 shrink-0 overflow-hidden rounded-xl bg-beige"
            >
              <FillImage src={line.product.image} alt="" sizes="80px" />
            </Link>
            <div className="flex flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-serif text-2xl leading-tight">
                    <Link href={productHref(line.slug)}>{line.product.name}</Link>
                  </h2>
                  <p className="mt-1 text-sm text-muted">{formatPrice(line.product.price)}</p>
                </div>
                <button
                  type="button"
                  aria-label={`Retirer ${line.product.name}`}
                  onClick={() => removeFromCart(line.slug)}
                  className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-ivory hover:text-burgundy"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-auto flex items-center justify-between pt-3">
                <div className="inline-flex items-center rounded-full border border-beige">
                  <button
                    type="button"
                    aria-label="Diminuer la quantité"
                    className="grid h-9 w-9 place-items-center"
                    onClick={() => setQuantity(line.slug, line.quantity - 1)}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm tabular-nums">{line.quantity}</span>
                  <button
                    type="button"
                    aria-label="Augmenter la quantité"
                    className="grid h-9 w-9 place-items-center"
                    onClick={() => setQuantity(line.slug, line.quantity + 1)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="text-sm">{formatPrice(line.product.price * line.quantity)}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <aside className="h-fit rounded-[24px] bg-ivory p-6">
        <h2 className="font-serif text-2xl">Total</h2>
        <p className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted">Sous-total</span>
          <span>{formatPrice(total)}</span>
        </p>
        <p className="mt-2 flex items-center justify-between text-sm">
          <span className="text-muted">Livraison</span>
          <span className="font-medium text-[#1f8a4c]">Gratuite</span>
        </p>
        {discount > 0 ? (
          <p className="mt-2 flex items-center justify-between text-sm">
            <span className="text-muted">Code promo</span>
            <span>-{formatPrice(discount)}</span>
          </p>
        ) : null}
        <p className="mt-3 flex items-center justify-between text-sm font-medium">
          <span>À payer</span>
          <span>{formatPrice(Math.max(0, total - discount))}</span>
        </p>
        <form
          className="mt-4 flex gap-2"
          onSubmit={async (event) => {
            event.preventDefault();
            const code = coupon.trim();
            if (!code) {
              setDiscount(0);
              setCouponMessage("");
              return;
            }
            try {
              const response = await fetch(`${apiBase()}/coupons/quote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, subtotal: total }),
              });
              const payload = (await response.json()) as { error?: string; discount?: number };
              if (!response.ok) {
                setDiscount(0);
                setCouponMessage(payload.error || "Ce code n'est pas valide.");
                return;
              }
              setDiscount(payload.discount ?? 0);
              setCouponMessage(payload.discount ? "Code appliqué." : "");
            } catch {
              setCouponMessage("Le code n'a pas pu être vérifié.");
            }
          }}
        >
          <label className="sr-only" htmlFor="coupon">Code promo</label>
          <input
            id="coupon"
            value={coupon}
            onChange={(event) => setCoupon(event.target.value.toUpperCase())}
            placeholder="Code promo"
            className="h-11 min-w-0 flex-1 rounded-full border border-beige bg-white px-4 text-sm uppercase"
          />
          <button type="submit" className="h-11 rounded-full border border-burgundy px-4 text-sm text-burgundy">
            Appliquer
          </button>
        </form>
        {couponMessage ? <p className="mt-2 text-xs text-muted">{couponMessage}</p> : null}
        <p className="mt-2 text-xs leading-relaxed text-muted">
          Paiement à la livraison, partout au Maroc. Les frais sont confirmés avant l&apos;envoi.
        </p>
        <OrderForm
          lines={lines.map((line) => ({ slug: line.slug, quantity: line.quantity }))}
          coupon={coupon}
          onSuccess={() => {
            clearCart({ track: false });
            setPlaced(true);
          }}
        />
      </aside>
    </div>
  );
}
