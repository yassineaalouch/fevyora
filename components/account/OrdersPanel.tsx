"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listMyOrders, useAccount, type AccountOrder } from "@/lib/account";
import { formatPrice } from "@/lib/format";

const statusLabel: Record<string, string> = {
  nouvelle: "Nouvelle",
  confirmee: "Confirmée",
  expediee: "Expédiée",
  livree: "Livrée",
  annulee: "Annulée",
};

export function OrdersPanel() {
  const { ready, profile } = useAccount();
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!profile) return;
    listMyOrders().then(setOrders).catch((cause: unknown) => {
      setError(cause instanceof Error ? cause.message : "Les commandes n'ont pas pu être lues.");
    });
  }, [profile]);

  if (!ready) return <p className="text-sm text-muted">Chargement...</p>;
  if (!profile) {
    return <p className="text-sm text-muted">Connectez-vous pour voir vos commandes. <Link href="/compte/connexion/" className="underline">Connexion</Link></p>;
  }
  if (error) return <p role="alert" className="text-sm text-burgundy">{error}</p>;
  if (orders.length === 0) {
    return <p className="text-sm text-muted">Aucune commande pour ce numéro. Passez une commande en étant connecté.</p>;
  }

  return (
    <div className="grid gap-4">
      {orders.map((order) => (
        <article key={order.id} className="rounded-[24px] bg-ivory p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-muted">{new Date(order.created_at).toLocaleDateString("fr-MA")}</p>
              <p className="mt-1 font-medium">{statusLabel[order.status] ?? order.status}</p>
            </div>
            <p>{formatPrice(order.total)}</p>
          </div>
          <ul className="mt-3 text-sm text-muted">
            {order.items.map((item) => (
              <li key={`${order.id}-${item.slug}`}>{item.quantity} × {item.name}</li>
            ))}
          </ul>
          <p className="mt-2 text-sm">{order.address}, {order.city}</p>
        </article>
      ))}
    </div>
  );
}
