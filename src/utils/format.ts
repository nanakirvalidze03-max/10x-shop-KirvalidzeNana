export function formatPrice(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

// price x (1 - pct/100), rounded to 2 decimals
export function discountedPrice(price: number, pct: number): number {
  return round2(price * (1 - pct / 100));
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString();
}
