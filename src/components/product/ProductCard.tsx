import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';
import { Button } from '../ui/Button';
import { PriceBlock } from './PriceBlock';
import { StockBadge } from './StockBadge';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const outOfStock = product.stock === 0;
  return (
    // `relative` + the title link's `after:absolute after:inset-0` make the WHOLE card clickable,
    // while the button (`relative z-10`) stays separately clickable.
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-line bg-surface shadow-pop transition-all duration-200 motion-safe:hover:-translate-y-1 motion-safe:hover:-rotate-1 hover:shadow-pop-lg focus-within:shadow-pop-lg">
      <div className="relative border-b-2 border-line bg-surface-muted">
        {product.discountPercentage >= 1 && (
          <span className="absolute top-3 left-3 z-10 -rotate-12 rounded-full border-2 border-line bg-hot px-2.5 py-1 text-xs font-extrabold text-on-pop shadow-pop">
            −{Math.round(product.discountPercentage)}%
          </span>
        )}
        <img
          src={product.thumbnail}
          alt={product.title}
          width={300}
          height={300}
          loading="lazy"
          className="aspect-square w-full object-contain transition-transform duration-300 motion-safe:group-hover:scale-110"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="w-fit rounded-full border-2 border-line bg-pop px-2 py-0.5 text-xs font-bold text-on-pop capitalize">{product.category}</p>
        <h3 className="font-display text-lg leading-tight font-extrabold">
          <Link to={`/products/${product.id}`} className="after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-brand">
            {product.title}
          </Link>
        </h3>
        <PriceBlock price={product.price} discountPercentage={product.discountPercentage} showBadge={false} />
        <div className="flex items-center justify-between gap-2 text-sm">
          <span className="font-bold" aria-label={`Rating ${product.rating}`}>★ {product.rating.toFixed(1)}</span>
          <StockBadge stock={product.stock} />
        </div>
        <Button className="relative z-10 mt-auto" disabled={outOfStock} onClick={() => onAdd(product)}>
          {outOfStock ? 'Sold out' : 'Add to cart 🛒'}
        </Button>
      </div>
    </article>
  );
}
