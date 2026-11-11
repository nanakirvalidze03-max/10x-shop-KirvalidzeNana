export function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <span className="rounded-full border-2 border-line bg-surface px-2 py-0.5 text-xs font-bold text-red-700 dark:text-red-400">Sold out</span>;
  if (stock <= 5) return <span className="rounded-full border-2 border-line bg-pop px-2 py-0.5 text-xs font-bold text-on-pop">🔥 Only {stock} left!</span>;
  return <span className="rounded-full border-2 border-line bg-mint px-2 py-0.5 text-xs font-bold text-on-pop">In stock</span>;
}
