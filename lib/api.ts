export function apiBase() {
  const value = (process.env.NEXT_PUBLIC_ORDERS_URL || "https://fevyora-orders.yaalouch77.workers.dev")
    .trim()
    .replace(/\/$/, "");
  return value.endsWith("/orders") ? value.slice(0, -"/orders".length) : value;
}
