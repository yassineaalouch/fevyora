interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

type ItemRequest = {
  slug?: unknown;
  quantity?: unknown;
};

type OrderRequest = {
  customerName?: unknown;
  phone?: unknown;
  city?: unknown;
  address?: unknown;
  note?: unknown;
  items?: unknown;
};

const catalog: Record<string, { name: string; price: number }> = {
  "ensemble-elegant": { name: "Ensemble Élégant", price: 499 },
  "robe-a-volants": { name: "Robe à Volants", price: 599 },
  "ensemble-chic": { name: "Ensemble Chic", price: 549 },
  "jupe-longue-premium": { name: "Jupe Longue Premium", price: 399 },
  "veste-courte": { name: "Veste Courte", price: 449 },
  "robe-longue-elegante": { name: "Robe Longue Élégante", price: 479 },
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders },
  });
}

function text(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);
    if (request.method !== "POST" || url.pathname !== "/orders") {
      return json({ error: "Introuvable." }, 404);
    }

    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
      return json({ error: "Le service de commande n'est pas configuré." }, 503);
    }

    let payload: OrderRequest;
    try {
      payload = (await request.json()) as OrderRequest;
    } catch {
      return json({ error: "Commande illisible." }, 400);
    }

    const customerName = text(payload.customerName, 80);
    const phone = text(payload.phone, 20);
    const city = text(payload.city, 80);
    const address = text(payload.address, 180);
    const note = text(payload.note, 400);
    const digits = phone.replace(/\D/g, "");

    if (customerName.length < 2 || city.length < 2 || address.length < 5 || digits.length < 8) {
      return json({ error: "Nom, téléphone, ville et adresse sont obligatoires." }, 400);
    }

    if (!Array.isArray(payload.items) || payload.items.length === 0 || payload.items.length > 12) {
      return json({ error: "La commande ne contient aucun article." }, 400);
    }

    const items = [];
    for (const raw of payload.items as ItemRequest[]) {
      const slug = text(raw.slug, 80);
      const product = catalog[slug];
      const quantity = typeof raw.quantity === "number" ? Math.floor(raw.quantity) : 0;
      if (!product || quantity < 1 || quantity > 5) {
        return json({ error: "Un article de la commande est invalide." }, 400);
      }
      items.push({ slug, name: product.name, quantity, unitPrice: product.price });
    }

    const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const response = await fetch(`${env.SUPABASE_URL}/rest/v1/fevyora_orders`, {
      method: "POST",
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        customer_name: customerName,
        phone,
        city,
        address,
        note: note || null,
        items,
        total,
      }),
    });

    if (!response.ok) {
      return json({ error: "La commande n'a pas pu être enregistrée." }, 502);
    }

    const created = (await response.json()) as { id: string }[];
    return json({ id: created[0]?.id ?? null }, 201);
  },
};
