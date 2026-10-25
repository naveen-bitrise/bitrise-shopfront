export type Variant = {
  id: string;
  label: string; // e.g. "M", "Black"
  available: boolean;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number; // in the store currency, e.g. 49.99
  rating: number; // 0-5
  image: string | null;
  description: string;
  variants: Variant[];
};

export type CartLine = {
  productId: string;
  variantId: string;
  name: string;
  variantLabel: string;
  price: number;
  image: string | null;
  quantity: number;
};
