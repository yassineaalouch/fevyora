import { login, logout, saveStatus } from "@/app/actions";
import { isAuthed, listOrders, missingSetup, statuses, type Order } from "@/lib/orders";

export const dynamic = "force-dynamic";

function money(value: number) {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 0,
  }).format(value);
}

function when(value: string) {
  return new Intl.DateTimeFormat("fr-MA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function Setup({ missing }: { missing: string[] }) {
  return (
    <main>
      <p className="eyebrow">FEVYORA</p>
      <h1>Commandes</h1>
      <section className="card">
        <p>Remplis ces clés dans <code>dashboard/.env</code>, puis relance le dashboard.</p>
        <ul>
          {missing.map((key) => (
            <li key={key}>{key}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function Login({ failed }: { failed: boolean }) {
  return (
    <main>
      <p className="eyebrow">FEVYORA</p>
      <h1>Commandes</h1>
      <form className="card" action={login}>
        <label>
          Mot de passe
          <input name="password" type="password" autoComplete="current-password" required />
        </label>
        {failed ? <p className="meta">Mot de passe incorrect.</p> : null}
        <p><button type="submit">Entrer</button></p>
      </form>
    </main>
  );
}

function OrderCard({ order }: { order: Order }) {
  const items = Array.isArray(order.items) ? order.items : [];
  return (
    <article className="order">
      <div className="order-head">
        <div>
          <h2>{order.customer_name}</h2>
          <p className="meta">
            {when(order.created_at)} · {order.city} · {order.phone}
          </p>
        </div>
        <strong className="total">{money(order.total)}</strong>
      </div>
      <p className="meta">{order.address}</p>
      <ul className="items">
        {items.map((item) => (
          <li key={`${order.id}-${item.slug}`}>
            {item.quantity} × {item.name} · {money(item.unitPrice)}
          </li>
        ))}
      </ul>
      {order.note ? <p className="note">{order.note}</p> : null}
      <form className="status-form" action={saveStatus}>
        <input type="hidden" name="id" value={order.id} />
        <select name="status" defaultValue={order.status} aria-label={`Statut de ${order.customer_name}`}>
          {statuses.map((status) => (
            <option key={status.id} value={status.id}>{status.label}</option>
          ))}
        </select>
        <button type="submit">Enregistrer</button>
      </form>
    </article>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>;
}) {
  const missing = missingSetup();
  if (missing.length > 0) return <Setup missing={missing} />;

  if (!(await isAuthed())) {
    const params = await searchParams;
    return <Login failed={params.erreur === "1"} />;
  }

  let orders: Order[] = [];
  let error = "";
  try {
    orders = await listOrders();
  } catch {
    error = "Supabase n'a pas renvoyé les commandes. Vérifie l'URL, la clé service_role, et que la table fevyora_orders existe.";
  }

  return (
    <main>
      <header>
        <div>
          <p className="eyebrow">FEVYORA</p>
          <h1>Commandes</h1>
        </div>
        <form action={logout}>
          <button className="ghost" type="submit">Sortir</button>
        </form>
      </header>
      {error ? <p className="empty">{error}</p> : null}
      {orders.length === 0 && !error ? <p className="empty">Aucune commande pour le moment.</p> : null}
      <section className="orders">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </section>
    </main>
  );
}
