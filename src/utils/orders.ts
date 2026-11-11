import type { CartItem, CartTotals } from '../types/cart';
import type { Order, OrderStatus, ShippingInfo } from '../types/order';
import { isOrderList } from './guards';
import { readStorage, STORAGE_KEYS, writeStorage } from './storage';

export function loadOrders(): Order[] {
  return readStorage(STORAGE_KEYS.orders, isOrderList) ?? [];
}

export function createOrder(items: CartItem[], totals: CartTotals, shipping: ShippingInfo, existingCount: number): Order {
  return {
    id: Date.now(),
    number: `10X-${String(existingCount + 1).padStart(5, '0')}`,
    items,
    shipping,
    subtotal: totals.subtotal,
    discount: totals.discount,
    shippingCost: totals.shipping,
    total: totals.total,
    placedAt: new Date().toISOString(),
  };
}

export function saveOrder(order: Order): void {
  writeStorage(STORAGE_KEYS.orders, [...loadOrders(), order]);
}

// Status is NOT stored: it is calculated from the time passed since the order was placed.
export function getOrderStatus(order: Order, now: Date = new Date()): OrderStatus {
  const elapsedMs = now.getTime() - new Date(order.placedAt).getTime();
  if (elapsedMs < 60_000) return 'Processing';
  if (elapsedMs <= 180_000) return 'Shipped';
  return 'Delivered';
}
