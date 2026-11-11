import type { CartItem, CartState } from '../types/cart';
import type { Product } from '../types/product';

// Discriminated union of every action the cart understands.
export type CartAction =
  | { type: 'ADD_ITEM'; product: Product; qty: number }
  | { type: 'SET_QTY'; productId: number; qty: number }
  | { type: 'REMOVE_ITEM'; productId: number }
  | { type: 'CLEAR' }
  | { type: 'APPLY_PROMO'; code: string }
  | { type: 'REMOVE_PROMO' };

export const EMPTY_CART: CartState = { items: [], promoCode: null };

function toCartItem(product: Product, quantity: number): CartItem {
  return {
    productId: product.id,
    title: product.title,
    thumbnail: product.thumbnail,
    price: product.price,
    discountPercentage: product.discountPercentage,
    stock: product.stock,
    quantity,
  };
}

// Pure function: no localStorage, no side effects. It never mutates `state` - it returns a NEW object.
export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.productId === action.product.id);
      const newQty = (existing?.quantity ?? 0) + action.qty;
      if (newQty > action.product.stock) return state; // never more than the stock
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) => (i.productId === existing.productId ? { ...i, quantity: newQty } : i)),
        };
      }
      return { ...state, items: [...state.items, toCartItem(action.product, newQty)] };
    }
    case 'SET_QTY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.productId === action.productId ? { ...i, quantity: Math.min(Math.max(action.qty, 1), i.stock) } : i,
        ),
      };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.productId !== action.productId) };
    case 'CLEAR':
      return EMPTY_CART;
    case 'APPLY_PROMO':
      return { ...state, promoCode: action.code };
    case 'REMOVE_PROMO':
      return { ...state, promoCode: null };
    default: {
      // Compile-time check: if a new action type is added and not handled, TypeScript reports an error here.
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}
