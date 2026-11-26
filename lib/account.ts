"use client";

import { useEffect, useState } from "react";

export type Profile = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  referralCode: string;
};

export type Address = {
  id: string;
  label: string;
  city: string;
  address: string;
  phone: string;
  isDefault: boolean;
};

export type AccountOrder = {
  id: string;
  created_at: string;
  status: string;
  customer_name: string;
  phone: string;
  city: string;
  address: string;
  note: string | null;
  items: { slug: string; name: string; quantity: number; unitPrice: number }[];
  total: number;
};

type Session = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  profile: Profile;
};

const SESSION_KEY = "fevyora-session";
const REFERRAL_KEY = "fevyora-parrain";

const ordersUrl =
  process.env.NEXT_PUBLIC_ORDERS_URL || "https://fevyora-orders.yaalouch77.workers.dev";

function apiBase() {
  const value = ordersUrl.trim().replace(/\/$/, "");
  return value.endsWith("/orders") ? value.slice(0, -"/orders".length) : value;
}

let session: Session | null = null;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function readStored(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Session;
    if (!parsed.accessToken || !parsed.refreshToken || !parsed.profile?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  session = readStored();
  const code = new URLSearchParams(window.location.search).get("parrain");
  if (code && /^[A-Za-z0-9]{8}$/.test(code)) {
    localStorage.setItem(REFERRAL_KEY, code.toUpperCase());
  }
}

function persist(next: Session | null) {
  session = next;
  if (next) localStorage.setItem(SESSION_KEY, JSON.stringify(next));
  else localStorage.removeItem(SESSION_KEY);
  emit();
}

export function getSession() {
  hydrate();
  return session;
}

export function subscribeAccount(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function referredBy() {
  if (typeof window === "undefined") return "";
  hydrate();
  return localStorage.getItem(REFERRAL_KEY) ?? "";
}

async function request(path: string, init: RequestInit = {}, retry = true): Promise<Response> {
  hydrate();
  let token = session?.accessToken ?? "";
  if (session && session.expiresAt < Date.now() + 30_000) {
    const refreshed = await refreshSession();
    token = refreshed?.accessToken ?? "";
  }
  const headers = new Headers(init.headers);
  if (init.body) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${apiBase()}${path}`, { ...init, headers });
  if (response.status === 401 && retry && session) {
    const refreshed = await refreshSession();
    if (refreshed) return request(path, init, false);
  }
  return response;
}

async function payload<T>(response: Response): Promise<T> {
  const body = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) throw new Error(body.error || "La demande n'a pas abouti.");
  return body;
}

function storeSession(body: {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  profile: Profile;
}) {
  persist({
    accessToken: body.accessToken,
    refreshToken: body.refreshToken,
    expiresAt: Date.now() + body.expiresIn * 1000,
    profile: body.profile,
  });
  return body.profile;
}

export async function refreshSession() {
  hydrate();
  if (!session) return null;
  const response = await fetch(`${apiBase()}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: session.refreshToken }),
  });
  if (!response.ok) {
    persist(null);
    return null;
  }
  const body = await payload<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    profile: Profile;
  }>(response);
  storeSession(body);
  return getSession();
}

export async function signup(input: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}) {
  const response = await fetch(`${apiBase()}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, referredBy: referredBy() }),
  });
  const body = await payload<{ confirmEmail?: boolean; accessToken?: string; refreshToken?: string; expiresIn?: number; profile?: Profile }>(response);
  if (body.confirmEmail || !body.accessToken || !body.refreshToken || !body.profile) return { confirmEmail: true as const };
  storeSession({
    accessToken: body.accessToken,
    refreshToken: body.refreshToken,
    expiresIn: body.expiresIn ?? 3600,
    profile: body.profile,
  });
  return { confirmEmail: false as const, profile: body.profile };
}

export async function login(email: string, password: string) {
  const response = await fetch(`${apiBase()}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const body = await payload<{ accessToken: string; refreshToken: string; expiresIn: number; profile: Profile }>(response);
  return storeSession(body);
}

export async function recover(email: string) {
  const response = await fetch(`${apiBase()}/auth/recover`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  await payload(response);
}

export function logout() {
  persist(null);
}

export async function updateProfile(fullName: string, phone: string) {
  const response = await request("/account", { method: "PATCH", body: JSON.stringify({ fullName, phone }) });
  const body = await payload<{ profile: Profile }>(response);
  if (session) persist({ ...session, profile: body.profile });
  return body.profile;
}

export async function changePassword(password: string) {
  const response = await request("/auth/password", { method: "POST", body: JSON.stringify({ password }) });
  await payload(response);
}

export async function listAddresses() {
  const response = await request("/addresses");
  return (await payload<{ addresses: Address[] }>(response)).addresses;
}

export async function addAddress(input: { label: string; city: string; address: string; phone: string; isDefault: boolean }) {
  const response = await request("/addresses", { method: "POST", body: JSON.stringify(input) });
  return (await payload<{ addresses: Address[] }>(response)).addresses;
}

export async function deleteAddress(id: string) {
  const response = await request(`/addresses?id=${encodeURIComponent(id)}`, { method: "DELETE" });
  return (await payload<{ addresses: Address[] }>(response)).addresses;
}

export async function listFavorites() {
  const response = await request("/favorites");
  return (await payload<{ slugs: string[] }>(response)).slugs;
}

export async function syncFavorite(slug: string, saved: boolean) {
  if (!getSession()) return;
  const response = await request("/favorites", { method: "POST", body: JSON.stringify({ slug, saved }) });
  if (!response.ok) return;
}

export async function listMyOrders() {
  const response = await request("/orders/mine");
  return (await payload<{ orders: AccountOrder[] }>(response)).orders;
}

export async function referralInfo() {
  const response = await request("/referral");
  return payload<{ code: string; count: number }>(response);
}

export async function accessToken() {
  hydrate();
  if (!session) return "";
  if (session.expiresAt < Date.now() + 30_000) {
    const next = await refreshSession();
    return next?.accessToken ?? "";
  }
  return session.accessToken;
}

export function useAccount() {
  const [current, setCurrent] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    hydrate();
    setCurrent(session);
    setReady(true);
    const unsubscribe = subscribeAccount(() => setCurrent(getSession()));
    return () => {
      unsubscribe();
    };
  }, []);

  return { ready, profile: current?.profile ?? null };
}
