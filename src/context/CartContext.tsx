import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, CartState, CartTotals } from '../types/cart';
import type { Product } from '../types/product';
import { calcTotals, countItems, PROMO_CODE } from '../utils/cart';
import { isCartState } from '../utils/guards';
import { readStorage, STORAGE_KEYS, writeStorage } from '../utils/storage';
import { cartReducer, EMPTY_CART } from './cart.reducer';

interface CartContextValue {
  items: CartItem[];
  promoCode: string | null;
  itemCount: number;
  totals: CartTotals;
  addItem: (product: Product, qty?: number) => boolean; // false = not added (stock limit)
  setQuantity: (productId: number, qty: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  applyPromo: (code: string) => boolean; // false = invalid code
  removePromo: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

// Lazy initial state: restore the cart saved in localStorage (if its shape is valid).
function loadInitialCart(fallback: CartState): CartState {
  return readStorage(STORAGE_KEYS.cart, isCartState) ?? fallback;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, EMPTY_CART, loadInitialCart);

  // Persist on every change (the reducer itself stays pure).
  useEffect(() => {
    writeStorage(STORAGE_KEYS.cart, state);
  }, [state]);

  const addItem = useCallback(
    (product: Product, qty = 1): boolean => {
      const inCart = state.items.find((i) => i.productId === product.id)?.quantity ?? 0;
      if (product.stock <= 0 || inCart + qty > product.stock) return false;
      dispatch({ type: 'ADD_ITEM', product, qty });
      return true;
    },
    [state.items],
  );

  const setQuantity = useCallback((productId: number, qty: number) => dispatch({ type: 'SET_QTY', productId, qty }), []);
  const removeItem = useCallback((productId: number) => dispatch({ type: 'REMOVE_ITEM', productId }), []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), []);
  const removePromo = useCallback(() => dispatch({ type: 'REMOVE_PROMO' }), []);
  const applyPromo = useCallback((code: string): boolean => {
    const normalized = code.trim().toUpperCase();
    if (normalized !== PROMO_CODE) return false;
    dispatch({ type: 'APPLY_PROMO', code: normalized });
    return true;
  }, []);

  const totals = useMemo(() => calcTotals(state), [state]);
  const itemCount = useMemo(() => countItems(state.items), [state.items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      promoCode: state.promoCode,
      itemCount,
      totals,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
      applyPromo,
      removePromo,
    }),
    [state, itemCount, totals, addItem, setQuantity, removeItem, clearCart, applyPromo, removePromo],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
