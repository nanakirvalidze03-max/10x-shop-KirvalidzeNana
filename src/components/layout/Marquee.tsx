const TEXT = 'FREE SHIPPING OVER $100 ✦ CODE 10X10 = 10% OFF ✦ NO REAL PAYMENTS, JUST VIBES ✦ ';

// Scrolling promo strip. The second copy is hidden from screen readers; the animation loops at -50%.
export function Marquee() {
  return (
    <div className="overflow-hidden border-b-2 border-line bg-pop py-1.5 text-sm font-extrabold tracking-wide whitespace-nowrap text-on-pop">
      <div className="flex w-max animate-marquee">
        <span>{TEXT.repeat(4)}</span>
        <span aria-hidden="true">{TEXT.repeat(4)}</span>
      </div>
    </div>
  );
}
