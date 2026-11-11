import type { CartItem, CartState, CartTotals } from '../types/cart';
import { discountedPrice, round2 } from './format';

export const PROMO_CODE = '10X10';
export const PROMO_PERCENT = 10;
export const FREE_SHIPPING_FROM = 100;
export const SHIPPING_COST = 10;

export function countItems(items: CartItem[]): number {
  return items.reduce((n, item) => n + item.quantity, 0);
}

// Pure function: the same cart always gives the same totals.
export function calcTotals(state: CartState): CartTotals {
  const subtotal = round2(
    state.items.reduce((sum, i) => sum + discountedPrice(i.price, i.discountPercentage) * i.quantity, 0),
  );
  const discount = state.promoCode ? round2((subtotal * PROMO_PERCENT) / 100) : 0;
  const afterDiscount = subtotal - discount;
  const shipping = state.items.length === 0 || afterDiscount >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST;
  return { subtotal, discount, shipping, total: round2(afterDiscount + shipping) };
}
