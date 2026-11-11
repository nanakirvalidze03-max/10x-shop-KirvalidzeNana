import { discountedPrice, formatPrice } from '../../utils/format';

interface PriceBlockProps {
  price: number;
  discountPercentage: number;
  large?: boolean;
  showBadge?: boolean; // the product card shows the discount as a sticker on the photo instead
}

export function PriceBlock({ price, discountPercentage, large = false, showBadge = true }: PriceBlockProps) {
  const hasDiscount = discountPercentage >= 1;
  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className={`font-display font-extrabold ${large ? 'text-4xl' : 'text-xl'}`}>{formatPrice(discountedPrice(price, discountPercentage))}</span>
      {hasDiscount && <span className="text-sm text-ink-muted line-through">{formatPrice(price)}</span>}
      {hasDiscount && showBadge && (
        <span className="-rotate-3 rounded-full border-2 border-line bg-hot px-2 py-0.5 text-xs font-extrabold text-on-pop">
          −{Math.round(discountPercentage)}%
        </span>
      )}
    </div>
  );
}
