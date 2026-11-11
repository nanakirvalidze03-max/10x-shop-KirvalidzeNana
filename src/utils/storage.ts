// The only place that touches localStorage for JSON data.
export const STORAGE_KEYS = {
  cart: 'shop_cart',
  orders: 'shop_orders',
  theme: 'shop_theme',
  users: 'shop_users',
} as const;

// Reads a value and returns it ONLY if the guard confirms its shape. Broken JSON -> null.
export function readStorage<T>(key: string, guard: (value: unknown) => value is T): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    return guard(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be full or blocked (private mode). The app keeps working without persistence.
  }
}
