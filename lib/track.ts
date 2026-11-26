"use client";

import { apiBase } from "@/lib/api";

type TrackType = "page" | "product" | "add_cart" | "remove_cart";

type TrackEvent = {
  type: TrackType;
  path: string;
  slug: string;
};

const VISITOR_KEY = "fevyora-visitor";
const SESSION_KEY = "fevyora-visit";
const SOURCE_KEY = "fevyora-source";

const queue: TrackEvent[] = [];
let timer = 0;
let lastPage = "";
let lastPageAt = 0;

function idOf(storage: Storage, key: string) {
  const current = storage.getItem(key);
  if (current && /^[0-9a-f-]{36}$/i.test(current)) return current;
  const next = crypto.randomUUID();
  storage.setItem(key, next);
  return next;
}

function detectSource() {
  const params = new URLSearchParams(window.location.search);
  const utm = (params.get("utm_source") ?? "").toLowerCase();
  const ref = document.referrer.toLowerCase();
  const blob = `${utm} ${ref}`;
  if (/instagram/.test(blob)) return "Instagram";
  if (/chatgpt|openai/.test(blob)) return "ChatGPT";
  if (/google/.test(blob)) return "Google";
  if (/facebook|fb\.com/.test(blob)) return "Facebook";
  if (/tiktok/.test(blob)) return "TikTok";
  if (/whatsapp|wa\.me/.test(blob)) return "WhatsApp";
  if (/youtube/.test(blob)) return "YouTube";
  if (/pinterest/.test(blob)) return "Pinterest";
  if (/bing/.test(blob)) return "Bing";
  if (utm) return utm.slice(0, 40);
  if (!ref) return "Direct";
  try {
    return new URL(document.referrer).hostname.replace(/^www\./, "").slice(0, 40);
  } catch {
    return "Autre";
  }
}

function deviceInfo() {
  const ua = navigator.userAgent;
  let browser = "Autre";
  if (/Edg\//.test(ua)) browser = "Edge";
  else if (/OPR\/|Opera/.test(ua)) browser = "Opera";
  else if (/Chrome\//.test(ua)) browser = "Chrome";
  else if (/Firefox\//.test(ua)) browser = "Firefox";
  else if (/Safari\//.test(ua)) browser = "Safari";

  let os = "Autre";
  if (/Android/.test(ua)) os = "Android";
  else if (/iPhone|iPad/.test(ua)) os = "iPhone";
  else if (/Windows/.test(ua)) os = "Windows";
  else if (/Mac OS/.test(ua)) os = "Mac";
  else if (/Linux/.test(ua)) os = "Linux";

  const tablet = /iPad|Tablet/.test(ua);
  const phone = /Mobi|Android|iPhone/.test(ua);
  const device = tablet ? "Tablette" : phone ? "Téléphone" : "Ordinateur";
  return { browser, os, device };
}

function accountId() {
  try {
    const raw = localStorage.getItem("fevyora-session");
    if (!raw) return "";
    const parsed = JSON.parse(raw) as { profile?: { id?: unknown } };
    return typeof parsed.profile?.id === "string" ? parsed.profile.id : "";
  } catch {
    return "";
  }
}

function flush() {
  timer = 0;
  const events = queue.splice(0, 8);
  if (events.length === 0) return;
  const { browser, os, device } = deviceInfo();
  const saved = localStorage.getItem(SOURCE_KEY);
  const source = saved || detectSource();
  if (!saved) localStorage.setItem(SOURCE_KEY, source);
  const body = JSON.stringify({
    visitorId: idOf(localStorage, VISITOR_KEY),
    sessionId: idOf(sessionStorage, SESSION_KEY),
    userId: accountId(),
    source,
    device,
    os,
    browser,
    events,
  });
  fetch(`${apiBase()}/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
  if (queue.length > 0) timer = window.setTimeout(flush, 50);
}

function enqueue(event: TrackEvent) {
  if (typeof window === "undefined") return;
  queue.push(event);
  if (!timer) timer = window.setTimeout(flush, 400);
}

export function trackPage(path: string) {
  const now = Date.now();
  if (lastPage === path && now - lastPageAt < 800) return;
  lastPage = path;
  lastPageAt = now;
  enqueue({ type: "page", path, slug: "" });
}

export function trackProduct(slug: string, path: string) {
  if (!slug) return;
  enqueue({ type: "product", path, slug });
}

export function trackCart(type: "add_cart" | "remove_cart", slug: string) {
  if (!slug || typeof window === "undefined") return;
  enqueue({ type, path: window.location.pathname, slug });
}
