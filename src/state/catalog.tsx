import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { fetchProducts } from '../data/api';
import type { Product } from '../data/types';

type CatalogValue = { products: Product[]; loading: boolean; refresh: () => Promise<void> };
const CatalogContext = createContext<CatalogValue | null>(null);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    setProducts(await fetchProducts());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return <CatalogContext.Provider value={{ products, loading, refresh }}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used inside CatalogProvider');
  return ctx;
}
