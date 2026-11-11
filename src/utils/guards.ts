// Type guards: JSON from the network or localStorage has NO type, so we check its shape
// before we let TypeScript treat it as Product / CartState / Order (instead of using `as`).
import type { CartItem, CartState } from '../types/cart';
import type { Order } from '../types/order';
import type { StoredUser } from '../types/user';
import type { Category, Product, ProductsResponse } from '../types/product';

export function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null;
}

export function isProduct(x: unknown): x is Product {
  return (
    isRecord(x) &&
    typeof x.id === 'number' &&
    typeof x.title === 'string' &&
    typeof x.description === 'string' &&
    typeof x.category === 'string' &&
    typeof x.price === 'number' &&
    typeof x.discountPercentage === 'number' &&
    typeof x.rating === 'number' &&
    typeof x.stock === 'number' &&
    typeof x.thumbnail === 'string' &&
    Array.isArray(x.images)
  );
}

export function isProductsResponse(x: unknown): x is ProductsResponse {
  return (
    isRecord(x) &&
    Array.isArray(x.products) &&
    x.products.every(isProduct) &&
    typeof x.total === 'number' &&
    typeof x.skip === 'number' &&
    typeof x.limit === 'number'
  );
}

export function isCategoryList(x: unknown): x is Category[] {
  return (
    Array.isArray(x) &&
    x.every((c: unknown) => isRecord(c) && typeof c.slug === 'string' && typeof c.name === 'string')
  );
}

export function isCartItem(x: unknown): x is CartItem {
  return (
    isRecord(x) &&
    typeof x.productId === 'number' &&
    typeof x.title === 'string' &&
    typeof x.thumbnail === 'string' &&
    typeof x.price === 'number' &&
    typeof x.discountPercentage === 'number' &&
    typeof x.stock === 'number' &&
    typeof x.quantity === 'number'
  );
}

export function isCartState(x: unknown): x is CartState {
  return (
    isRecord(x) &&
    Array.isArray(x.items) &&
    x.items.every(isCartItem) &&
    (x.promoCode === null || typeof x.promoCode === 'string')
  );
}

function isOrder(x: unknown): x is Order {
  return (
    isRecord(x) &&
    typeof x.id === 'number' &&
    typeof x.number === 'string' &&
    Array.isArray(x.items) &&
    x.items.every(isCartItem) &&
    isRecord(x.shipping) &&
    typeof x.subtotal === 'number' &&
    typeof x.discount === 'number' &&
    typeof x.shippingCost === 'number' &&
    typeof x.total === 'number' &&
    typeof x.placedAt === 'string'
  );
}

export function isOrderList(x: unknown): x is Order[] {
  return Array.isArray(x) && x.every(isOrder);
}

function isStoredUser(x: unknown): x is StoredUser {
  return (
    isRecord(x) &&
    typeof x.id === 'number' &&
    typeof x.fullName === 'string' &&
    typeof x.email === 'string' &&
    typeof x.password === 'string' &&
    typeof x.company === 'string' &&
    typeof x.createdAt === 'string'
  );
}

export function isUserList(x: unknown): x is StoredUser[] {
  return Array.isArray(x) && x.every(isStoredUser);
}
