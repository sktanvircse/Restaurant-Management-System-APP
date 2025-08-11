export function formatCurrency(value: number) {
  const v = Number.isFinite(value) ? value : 0;
  return `$${v.toFixed(2)}`;
}