import type { Product } from './types';
import bundledProducts from '../../data/products.json';

// The catalog is served from the repo so its shape can change without an app release.
export const PRODUCTS_URL =
  'https://raw.githubusercontent.com/naveen-bitrise/bitrise-shopfront/main/data/products.json';

export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(PRODUCTS_URL, { headers: { 'Cache-Control': 'no-cache' } });
    if (!res.ok) throw new Error(`Catalog request failed: ${res.status}`);
    const body = await res.json();
    return body.products as Product[];
  } catch (err) {
    console.warn('[catalog] falling back to bundled products', err);
    return (bundledProducts as { products: Product[] }).products;
  }
}

export const CATEGORIES = ['All', 'Tools', 'Garden', 'Kitchen', 'Lighting'] as const;
export type Category = (typeof CATEGORIES)[number];
