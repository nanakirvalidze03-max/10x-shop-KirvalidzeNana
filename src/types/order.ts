import type { CartItem } from './cart';

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered';

// Checkout form fields = shipping info
export interface ShippingInfo {
  fullName: string;
  email: string;
  address: string;
  city: string;
}

export interface Order {
  id: number; // Date.now() when placed
  number: string; // "10X-00001"
  items: CartItem[];
  shipping: ShippingInfo;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  placedAt: string; // ISO date
}
