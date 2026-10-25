import React, { createContext, useContext, useMemo, useReducer } from 'react';
import type { CartLine, Product, Variant } from '../data/types';
import { lineTotal } from '../lib/format';

type State = { lines: CartLine[] };

type Action =
  | { type: 'add'; product: Product; variant: Variant }
  | { type: 'setQuantity'; productId: string; variantId: string; quantity: number }
  | { type: 'remove'; productId: string; variantId: string }
  | { type: 'clear' };

const sameLine = (l: CartLine, productId: string, variantId: string) =>
  l.productId === productId && l.variantId === variantId;

export function cartReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add': {
      const { product, variant } = action;
      const existing = state.lines.find((l) => sameLine(l, product.id, variant.id));
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            sameLine(l, product.id, variant.id) ? { ...l, quantity: l.quantity + 1 } : l,
          ),
        };
      }
      return {
        lines: [
          ...state.lines,
          {
            productId: product.id,
            variantId: variant.id,
            name: product.name,
            variantLabel: variant.label,
            price: product.price,
            image: product.image,
            quantity: 1,
          },
        ],
      };
    }
    case 'setQuantity':
      if (action.quantity <= 0) {
        return { lines: state.lines.filter((l) => !sameLine(l, action.productId, action.variantId)) };
      }
      return {
        lines: state.lines.map((l) =>
          sameLine(l, action.productId, action.variantId) ? { ...l, quantity: action.quantity } : l,
        ),
      };
    case 'remove':
      return { lines: state.lines.filter((l) => !sameLine(l, action.productId, action.variantId)) };
    case 'clear':
      return { lines: [] };
  }
}

export function cartTotals(lines: CartLine[]) {
  const subtotal = lines.reduce((sum, l) => sum + lineTotal(l.price, l.quantity), 0);
  const shipping = subtotal === 0 || subtotal >= 100 ? 0 : 9.95;
  const itemCount = lines.reduce((n, l) => n + l.quantity, 0);
  return { subtotal: Math.round(subtotal * 100) / 100, shipping, total: Math.round((subtotal + shipping) * 100) / 100, itemCount };
}

type CartContextValue = State & { dispatch: React.Dispatch<Action>; totals: ReturnType<typeof cartTotals> };
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { lines: [] });
  const value = useMemo(() => ({ ...state, dispatch, totals: cartTotals(state.lines) }), [state]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
