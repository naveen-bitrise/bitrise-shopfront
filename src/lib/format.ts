export const CURRENCY = 'USD';

export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function lineTotal(price: number, quantity: number): number {
  return Math.round(price * quantity * 100) / 100;
}
