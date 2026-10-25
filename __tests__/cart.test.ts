import { cartReducer, cartTotals } from '../src/state/cart';
import { formatPrice } from '../src/lib/format';
import catalog from '../data/products.json';
import type { Product } from '../src/data/types';

const products = (catalog as { products: Product[] }).products;
const drill = products.find((p) => p.id === 'p-01')!;

describe('cart', () => {
  it('adds and increments the same variant', () => {
    let state = cartReducer({ lines: [] }, { type: 'add', product: drill, variant: drill.variants[0] });
    state = cartReducer(state, { type: 'add', product: drill, variant: drill.variants[0] });
    expect(state.lines).toHaveLength(1);
    expect(state.lines[0].quantity).toBe(2);
  });

  it('removes a line when quantity drops to 0', () => {
    let state = cartReducer({ lines: [] }, { type: 'add', product: drill, variant: drill.variants[0] });
    state = cartReducer(state, { type: 'setQuantity', productId: drill.id, variantId: drill.variants[0].id, quantity: 0 });
    expect(state.lines).toHaveLength(0);
  });

  it('charges shipping under $100 and free above', () => {
    const cheap = products.find((p) => p.id === 'p-06')!;
    const one = cartReducer({ lines: [] }, { type: 'add', product: cheap, variant: cheap.variants[0] });
    expect(cartTotals(one.lines).shipping).toBe(9.95);
    const big = cartReducer({ lines: [] }, { type: 'add', product: drill, variant: drill.variants[0] });
    expect(cartTotals(big.lines).shipping).toBe(0);
  });
});

describe('catalog', () => {
  it('every product has a numeric price and at least one variant', () => {
    for (const p of products) {
      expect(typeof p.price).toBe('number');
      expect(p.variants.length).toBeGreaterThan(0);
    }
  });

  it('formats prices', () => {
    expect(formatPrice(24.5)).toBe('$24.50');
  });
});
