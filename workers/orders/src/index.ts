interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

type ItemRequest = {
  slug?: unknown;
  quantity?: unknown;
};

type Address = {
  id: string;
  label: string;
  city: string;
  address: string;
  phone: string;
  isDefault: boolean;
};

type Meta = {
  full_name?: string;
  phone?: string;
  referral_code?: string;
  referred_by?: string;
  addresses?: Address[];
  favorites?: string[];
  order_phones?: string[];
};

type AuthUser = {
  id: string;
  email: string;
  user_metadata: Meta;
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
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
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

function digits(value: string) {
  return value.replace(/\D/g, "");
}

async function readBody(request: Request) {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function serviceHeaders(env: Env, token?: string) {
  return {
    apikey: env.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${token ?? env.SUPABASE_SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
  };
}

async function authError(response: Response) {
  const payload = (await response.json().catch(() => ({}))) as {
    msg?: string;
    error_description?: string;
    error_code?: string;
    message?: string;
  };
  const code = payload.error_code ?? "";
  const messages: Record<string, string> = {
    invalid_credentials: "Email ou mot de passe incorrect.",
    user_already_exists: "Un compte existe déjà avec cet email.",
    email_exists: "Un compte existe déjà avec cet email.",
    weak_password: "Le mot de passe doit contenir au moins 8 caractères.",
    email_not_confirmed: "Confirmez votre email avant de vous connecter.",
    email_address_invalid: "Cet email n'est pas accepté.",
    over_request_rate_limit: "Trop de tentatives. Réessayez dans un moment.",
    over_email_send_rate_limit: "Trop de tentatives. Réessayez dans un moment.",
    validation_failed: "Email ou mot de passe invalide.",
  };
  if (response.status === 429) return json({ error: messages[code] || "Trop de tentatives. Réessayez dans un moment." }, 429);
  return json({ error: messages[code] || "La demande n'a pas abouti." }, response.status);
}

function bearer(request: Request) {
  const header = request.headers.get("Authorization") ?? "";
  return header.startsWith("Bearer ") ? header.slice(7).trim() : "";
}

async function currentUser(request: Request, env: Env): Promise<AuthUser | null> {
  const token = bearer(request);
  if (!token) return null;
  const response = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: serviceHeaders(env, token),
  });
  if (!response.ok) return null;
  const user = (await response.json()) as AuthUser;
  if (!user?.id || !user.email) return null;
  user.user_metadata = user.user_metadata ?? {};
  return user;
}

async function saveMeta(env: Env, token: string, data: Meta) {
  const response = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    method: "PUT",
    headers: serviceHeaders(env, token),
    body: JSON.stringify({ data }),
  });
  if (!response.ok) return authError(response);
  return null;
}

function profileOf(user: AuthUser) {
  const meta = user.user_metadata ?? {};
  return {
    id: user.id,
    email: user.email,
    fullName: text(meta.full_name, 80),
    phone: text(meta.phone, 20),
    referralCode: text(meta.referral_code, 12),
  };
}

function addressesOf(user: AuthUser): Address[] {
  const list = user.user_metadata?.addresses;
  if (!Array.isArray(list)) return [];
  return list.filter((item) => item && typeof item.id === "string" && typeof item.address === "string");
}

function favoritesOf(user: AuthUser) {
  const list = user.user_metadata?.favorites;
  if (!Array.isArray(list)) return [];
  return list.filter((slug): slug is string => typeof slug === "string" && /^[a-z0-9-]{2,80}$/.test(slug));
}

function phonesOf(user: AuthUser) {
  const meta = user.user_metadata ?? {};
  const values = [
    text(meta.phone, 20),
    ...(Array.isArray(meta.order_phones) ? meta.order_phones : []),
    ...addressesOf(user).map((item) => item.phone),
  ];
  return [...new Set(values.map((item) => text(item, 20)).filter((item) => digits(item).length >= 8))];
}

function referralCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return [...bytes].map((byte) => alphabet[byte % alphabet.length]).join("");
}

function sessionPayload(payload: {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  user?: AuthUser;
}) {
  if (!payload.access_token || !payload.refresh_token || !payload.user) return null;
  return {
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token,
    expiresIn: payload.expires_in ?? 3600,
    profile: profileOf(payload.user),
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
      return json({ error: "Le service n'est pas configuré." }, 503);
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, "") || "/";

    if (request.method === "POST" && path === "/orders") return placeOrder(request, env);
    if (request.method === "GET" && path === "/products") return listPublicProducts(env);
    if (request.method === "POST" && path === "/coupons/quote") return quoteCouponRoute(request, env);
    if (request.method === "POST" && path === "/track") return trackVisit(request, env);
    if (request.method === "POST" && path === "/auth/signup") return signup(request, env);
    if (request.method === "POST" && path === "/auth/login") return login(request, env);
    if (request.method === "POST" && path === "/auth/refresh") return refresh(request, env);
    if (request.method === "POST" && path === "/auth/recover") return recover(request, env);
    if (request.method === "POST" && path === "/auth/password") return changePassword(request, env);
    if (request.method === "GET" && path === "/account") return getAccount(request, env);
    if (request.method === "PATCH" && path === "/account") return patchAccount(request, env);
    if (request.method === "GET" && path === "/addresses") return listAddresses(request, env);
    if (request.method === "POST" && path === "/addresses") return addAddress(request, env);
    if (request.method === "DELETE" && path === "/addresses") return deleteAddress(request, env);
    if (request.method === "GET" && path === "/favorites") return listFavorites(request, env);
    if (request.method === "POST" && path === "/favorites") return saveFavorite(request, env);
    if (request.method === "GET" && path === "/orders/mine") return myOrders(request, env);
    if (request.method === "GET" && path === "/referral") return referral(request, env);

    return json({ error: "Introuvable." }, 404);
  },
};

async function signup(request: Request, env: Env) {
  const body = await readBody(request);
  if (!body) return json({ error: "Demande illisible." }, 400);
  const email = text(body.email, 120).toLowerCase();
  const password = text(body.password, 80);
  const fullName = text(body.fullName, 80);
  const phone = text(body.phone, 20);
  const referredBy = text(body.referredBy, 12).toUpperCase();
  if (!email.includes("@") || password.length < 8 || fullName.length < 2 || digits(phone).length < 8) {
    return json({ error: "Nom, email, téléphone et mot de passe (8 caractères) sont obligatoires." }, 400);
  }
  const created = await fetch(`${env.SUPABASE_URL}/auth/v1/admin/users`, {
    method: "POST",
    headers: serviceHeaders(env),
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        phone,
        referral_code: referralCode(),
        referred_by: /^[A-Z0-9]{8}$/.test(referredBy) ? referredBy : "",
        addresses: [],
        favorites: [],
        order_phones: [phone],
      },
    }),
  });
  if (!created.ok) return authError(created);

  const signedIn = await fetch(`${env.SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: serviceHeaders(env),
    body: JSON.stringify({ email, password }),
  });
  if (!signedIn.ok) {
    return json({ confirmEmail: true });
  }
  const session = sessionPayload((await signedIn.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    user?: AuthUser;
  });
  if (!session) return json({ confirmEmail: true });
  return json(session, 201);
}

async function login(request: Request, env: Env) {
  const body = await readBody(request);
  if (!body) return json({ error: "Demande illisible." }, 400);
  const response = await fetch(`${env.SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: serviceHeaders(env),
    body: JSON.stringify({
      email: text(body.email, 120).toLowerCase(),
      password: text(body.password, 80),
    }),
  });
  if (!response.ok) return authError(response);
  const session = sessionPayload((await response.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    user?: AuthUser;
  });
  if (!session) return json({ error: "Connexion impossible." }, 502);
  return json(session);
}

async function refresh(request: Request, env: Env) {
  const body = await readBody(request);
  const token = text(body?.refreshToken, 2000);
  if (!token) return json({ error: "Session expirée." }, 401);
  const response = await fetch(`${env.SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: serviceHeaders(env),
    body: JSON.stringify({ refresh_token: token }),
  });
  if (!response.ok) return authError(response);
  const session = sessionPayload((await response.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    user?: AuthUser;
  });
  if (!session) return json({ error: "Session expirée." }, 401);
  return json(session);
}

async function recover(request: Request, env: Env) {
  const body = await readBody(request);
  const email = text(body?.email, 120).toLowerCase();
  if (!email.includes("@")) return json({ error: "Entrez un email valide." }, 400);
  const response = await fetch(`${env.SUPABASE_URL}/auth/v1/recover`, {
    method: "POST",
    headers: serviceHeaders(env),
    body: JSON.stringify({ email }),
  });
  if (!response.ok) return authError(response);
  return json({ ok: true });
}

async function changePassword(request: Request, env: Env) {
  const user = await currentUser(request, env);
  if (!user) return json({ error: "Connectez-vous pour continuer." }, 401);
  const body = await readBody(request);
  const password = text(body?.password, 80);
  if (password.length < 8) return json({ error: "Le mot de passe doit contenir au moins 8 caractères." }, 400);
  const response = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    method: "PUT",
    headers: serviceHeaders(env, bearer(request)),
    body: JSON.stringify({ password }),
  });
  if (!response.ok) return authError(response);
  return json({ ok: true });
}

async function getAccount(request: Request, env: Env) {
  const user = await currentUser(request, env);
  if (!user) return json({ error: "Connectez-vous pour continuer." }, 401);
  return json({ profile: profileOf(user) });
}

async function patchAccount(request: Request, env: Env) {
  const user = await currentUser(request, env);
  if (!user) return json({ error: "Connectez-vous pour continuer." }, 401);
  const body = await readBody(request);
  const fullName = text(body?.fullName, 80);
  const phone = text(body?.phone, 20);
  if (fullName.length < 2 || digits(phone).length < 8) {
    return json({ error: "Le nom et le téléphone sont obligatoires." }, 400);
  }
  const failed = await saveMeta(env, bearer(request), { full_name: fullName, phone });
  if (failed) return failed;
  return json({ profile: { ...profileOf(user), fullName, phone } });
}

async function listAddresses(request: Request, env: Env) {
  const user = await currentUser(request, env);
  if (!user) return json({ error: "Connectez-vous pour continuer." }, 401);
  return json({ addresses: addressesOf(user) });
}

async function addAddress(request: Request, env: Env) {
  const user = await currentUser(request, env);
  if (!user) return json({ error: "Connectez-vous pour continuer." }, 401);
  const body = await readBody(request);
  const address = text(body?.address, 180);
  const city = text(body?.city, 80);
  const phone = text(body?.phone, 20);
  const label = text(body?.label, 40) || "Maison";
  if (city.length < 2 || address.length < 5 || digits(phone).length < 8) {
    return json({ error: "Ville, adresse et téléphone sont obligatoires." }, 400);
  }
  const current = addressesOf(user);
  if (current.length >= 8) return json({ error: "Vous avez atteint 8 adresses." }, 400);
  const makeDefault = body?.isDefault === true || current.length === 0;
  const next = current.map((item) => ({ ...item, isDefault: makeDefault ? false : item.isDefault }));
  next.push({ id: crypto.randomUUID(), label, city, address, phone, isDefault: makeDefault });
  const failed = await saveMeta(env, bearer(request), { addresses: next });
  if (failed) return failed;
  return json({ addresses: next }, 201);
}

async function deleteAddress(request: Request, env: Env) {
  const user = await currentUser(request, env);
  if (!user) return json({ error: "Connectez-vous pour continuer." }, 401);
  const id = new URL(request.url).searchParams.get("id") ?? "";
  let next = addressesOf(user).filter((item) => item.id !== id);
  if (next.length > 0 && !next.some((item) => item.isDefault)) next = next.map((item, index) => ({ ...item, isDefault: index === 0 }));
  const failed = await saveMeta(env, bearer(request), { addresses: next });
  if (failed) return failed;
  return json({ addresses: next });
}

async function listFavorites(request: Request, env: Env) {
  const user = await currentUser(request, env);
  if (!user) return json({ error: "Connectez-vous pour continuer." }, 401);
  return json({ slugs: favoritesOf(user) });
}

async function saveFavorite(request: Request, env: Env) {
  const user = await currentUser(request, env);
  if (!user) return json({ error: "Connectez-vous pour continuer." }, 401);
  const body = await readBody(request);
  const slug = text(body?.slug, 80);
  if (!/^[a-z0-9-]{2,80}$/.test(slug)) return json({ error: "Article inconnu." }, 400);
  const saved = body?.saved === true;
  const current = favoritesOf(user);
  const next = saved ? [...new Set([...current, slug])] : current.filter((item) => item !== slug);
  const failed = await saveMeta(env, bearer(request), { favorites: next });
  if (failed) return failed;
  return json({ slugs: next });
}

async function myOrders(request: Request, env: Env) {
  const user = await currentUser(request, env);
  if (!user) return json({ error: "Connectez-vous pour continuer." }, 401);
  const phones = phonesOf(user);
  if (phones.length === 0) return json({ orders: [] });
  const filter = phones.map((phone) => encodeURIComponent(`"${phone.replace(/["\\]/g, "")}"`)).join(",");
  const response = await fetch(
    `${env.SUPABASE_URL}/rest/v1/fevyora_orders?phone=in.(${filter})&select=id,created_at,status,customer_name,phone,city,address,note,items,total&order=created_at.desc&limit=50`,
    { headers: serviceHeaders(env) },
  );
  if (!response.ok) return json({ error: "Les commandes n'ont pas pu être lues." }, 502);
  return json({ orders: await response.json() });
}

async function referral(request: Request, env: Env) {
  const user = await currentUser(request, env);
  if (!user) return json({ error: "Connectez-vous pour continuer." }, 401);
  const code = profileOf(user).referralCode;
  let count = 0;
  if (code) {
    const response = await fetch(`${env.SUPABASE_URL}/auth/v1/admin/users?page=1&per_page=200`, {
      headers: serviceHeaders(env),
    });
    if (response.ok) {
      const payload = (await response.json()) as { users?: { user_metadata?: Meta }[] };
      count = (payload.users ?? []).filter((item) => item.user_metadata?.referred_by === code).length;
    }
  }
  return json({ code, count });
}

async function placeOrder(request: Request, env: Env) {
  const body = await readBody(request);
  if (!body) return json({ error: "Commande illisible." }, 400);

  const customerName = text(body.customerName, 80);
  const phone = text(body.phone, 20);
  const city = text(body.city, 80);
  const address = text(body.address, 180);
  const note = text(body.note, 400);

  if (customerName.length < 2 || city.length < 2 || address.length < 5 || digits(phone).length < 8) {
    return json({ error: "Nom, téléphone, ville et adresse sont obligatoires." }, 400);
  }
  if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 12) {
    return json({ error: "La commande ne contient aucun article." }, 400);
  }

  const priced = await loadCatalog(env);
  const items = [];
  for (const raw of body.items as ItemRequest[]) {
    const slug = text(raw.slug, 80);
    const product = priced[slug];
    const quantity = typeof raw.quantity === "number" ? Math.floor(raw.quantity) : 0;
    if (!product || quantity < 1 || quantity > 5) {
      return json({ error: "Un article de la commande est invalide." }, 400);
    }
    items.push({ slug, name: product.name, quantity, unitPrice: product.price });
  }
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const quoted = await quoteCoupon(env, text(body.coupon, 20), subtotal);
  if (quoted.error) return json({ error: quoted.error }, 400);
  const total = Math.max(0, subtotal - quoted.discount);

  const order: Record<string, unknown> = {
    customer_name: customerName,
    phone,
    city,
    address,
    note: note || null,
    items,
    total,
  };
  if (quoted.code) {
    order.coupon_code = quoted.code;
    order.discount = quoted.discount;
  }

  const response = await fetch(`${env.SUPABASE_URL}/rest/v1/fevyora_orders`, {
    method: "POST",
    headers: { ...serviceHeaders(env), Prefer: "return=representation" },
    body: JSON.stringify(order),
  });
  if (!response.ok) return json({ error: "La commande n'a pas pu être enregistrée." }, 502);
  if (quoted.id) {
    await fetch(`${env.SUPABASE_URL}/rest/v1/fevyora_coupons?id=eq.${quoted.id}`, {
      method: "PATCH",
      headers: { ...serviceHeaders(env), Prefer: "return=minimal" },
      body: JSON.stringify({ used_count: quoted.used + 1 }),
    });
  }

  const user = await currentUser(request, env);
  if (user) {
    const phones = new Set(phonesOf(user));
    phones.add(phone);
    await saveMeta(env, bearer(request), { order_phones: [...phones] });
  }

  const created = (await response.json()) as { id: string }[];
  return json({ id: created[0]?.id ?? null, total, discount: quoted.discount }, 201);
}

type Priced = { name: string; price: number };
type CouponRow = {
  id: string;
  code: string;
  kind: string;
  amount: number;
  min_total: number;
  active: boolean;
  expires_at: string | null;
  usage_limit: number | null;
  used_count: number;
};

async function loadCatalog(env: Env): Promise<Record<string, Priced>> {
  const next: Record<string, Priced> = { ...catalog };
  const response = await fetch(
    `${env.SUPABASE_URL}/rest/v1/fevyora_products?select=slug,name,price,active`,
    { headers: serviceHeaders(env) },
  );
  if (!response.ok) return next;
  const rows = (await response.json()) as { slug?: string; name?: string; price?: number; active?: boolean }[];
  for (const row of rows) {
    if (!row.slug) continue;
    if (row.active === false) {
      delete next[row.slug];
      continue;
    }
    if (row.name && Number.isInteger(row.price)) next[row.slug] = { name: row.name, price: row.price as number };
  }
  return next;
}

async function listPublicProducts(env: Env) {
  const response = await fetch(
    `${env.SUPABASE_URL}/rest/v1/fevyora_products?active=eq.true&select=slug,name,price,compare_at,collection,image,detail,sizes,active&order=created_at.desc`,
    { headers: serviceHeaders(env) },
  );
  if (!response.ok) return json([], 200);
  return json(await response.json());
}

async function quoteCoupon(env: Env, code: string, subtotal: number) {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return { code: "", discount: 0, used: 0 };
  if (!/^[A-Z0-9-]{3,20}$/.test(normalized)) return { code: "", discount: 0, used: 0, error: "Code invalide." };
  const response = await fetch(
    `${env.SUPABASE_URL}/rest/v1/fevyora_coupons?code=eq.${encodeURIComponent(normalized)}&select=*&limit=1`,
    { headers: serviceHeaders(env) },
  );
  if (!response.ok) return { code: "", discount: 0, used: 0, error: "Les codes promo ne sont pas disponibles." };
  const rows = (await response.json()) as CouponRow[];
  const coupon = rows[0];
  if (!coupon || !coupon.active) return { code: "", discount: 0, used: 0, error: "Ce code n'est pas valide." };
  if (coupon.expires_at && new Date(coupon.expires_at).getTime() < Date.now()) {
    return { code: "", discount: 0, used: 0, error: "Ce code a expiré." };
  }
  if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) {
    return { code: "", discount: 0, used: 0, error: "Ce code a atteint sa limite." };
  }
  if (subtotal < (coupon.min_total ?? 0)) {
    return { code: "", discount: 0, used: 0, error: `Ce code demande un minimum de ${coupon.min_total} MAD.` };
  }
  const discount = coupon.kind === "percent"
    ? Math.min(subtotal, Math.round((subtotal * coupon.amount) / 100))
    : Math.min(subtotal, coupon.amount);
  return { code: coupon.code, discount, used: coupon.used_count, id: coupon.id };
}

async function quoteCouponRoute(request: Request, env: Env) {
  const body = await readBody(request);
  const subtotal = typeof body?.subtotal === "number" ? Math.max(0, Math.floor(body.subtotal)) : 0;
  const quoted = await quoteCoupon(env, text(body?.code, 20), subtotal);
  if (quoted.error) return json({ error: quoted.error }, 400);
  return json({ code: quoted.code, discount: quoted.discount, total: Math.max(0, subtotal - quoted.discount) });
}

async function trackVisit(request: Request, env: Env) {
  const body = await readBody(request);
  if (!body) return json({ ok: true });
  const visitorKey = text(body.visitorId, 40);
  const sessionKey = text(body.sessionId, 40);
  if (!/^[0-9a-f-]{36}$/i.test(visitorKey) || !/^[0-9a-f-]{36}$/i.test(sessionKey)) return json({ ok: true });
  const allowed = new Set(["page", "product", "add_cart", "remove_cart"]);
  const events = (Array.isArray(body.events) ? body.events : []).slice(0, 8).flatMap((raw) => {
    if (!raw || typeof raw !== "object") return [];
    const item = raw as { type?: unknown; path?: unknown; slug?: unknown };
    const type = text(item.type, 20);
    if (!allowed.has(type)) return [];
    return [{
      visitor_key: visitorKey,
      session_key: sessionKey,
      type,
      path: text(item.path, 180),
      slug: text(item.slug, 80),
    }];
  });
  if (events.length === 0) return json({ ok: true });

  const headers = serviceHeaders(env);
  const seen = await fetch(
    `${env.SUPABASE_URL}/rest/v1/fevyora_events?visitor_key=eq.${visitorKey}&session_key=eq.${sessionKey}&select=id&limit=1`,
    { headers },
  );
  const seenRows = seen.ok ? ((await seen.json()) as unknown[]) : [];
  const newSession = seenRows.length === 0;
  const source = text(body.source, 40) || "Direct";
  const device = text(body.device, 20);
  const os = text(body.os, 20);
  const browser = text(body.browser, 20);
  const userId = text(body.userId, 40);

  const current = await fetch(
    `${env.SUPABASE_URL}/rest/v1/fevyora_visitors?visitor_key=eq.${visitorKey}&select=id,sessions,user_id&limit=1`,
    { headers },
  );
  const visitors = current.ok ? ((await current.json()) as { id: string; sessions: number; user_id: string }[]) : [];
  const visitor = visitors[0];
  if (!visitor) {
    await fetch(`${env.SUPABASE_URL}/rest/v1/fevyora_visitors`, {
      method: "POST",
      headers: { ...headers, Prefer: "return=minimal" },
      body: JSON.stringify({
        visitor_key: visitorKey,
        user_id: userId,
        source,
        device,
        os,
        browser,
        sessions: 1,
        last_seen: new Date().toISOString(),
      }),
    });
  } else {
    await fetch(`${env.SUPABASE_URL}/rest/v1/fevyora_visitors?id=eq.${visitor.id}`, {
      method: "PATCH",
      headers: { ...headers, Prefer: "return=minimal" },
      body: JSON.stringify({
        last_seen: new Date().toISOString(),
        sessions: newSession ? (visitor.sessions || 1) + 1 : visitor.sessions || 1,
        ...(userId && !visitor.user_id ? { user_id: userId } : {}),
      }),
    });
  }

  await fetch(`${env.SUPABASE_URL}/rest/v1/fevyora_events`, {
    method: "POST",
    headers: { ...headers, Prefer: "return=minimal" },
    body: JSON.stringify(events),
  });
  return json({ ok: true });
}
