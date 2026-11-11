import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PriceBlock } from '../components/product/PriceBlock';
import { Button } from '../components/ui/Button';
import { FormField } from '../components/ui/FormField';
import { QuantityStepper } from '../components/ui/QuantityStepper';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { discountedPrice, formatPrice } from '../utils/format';
import { getStateString } from '../utils/nav';
import { PROMO_PERCENT } from '../utils/cart';

export default function CartPage() {
  const { items, totals, promoCode, setQuantity, removeItem, clearCart, applyPromo, removePromo } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const notice = getStateString(location.state, 'notice'); // e.g. "Your cart is empty" from Checkout

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  function handleRemove(productId: number) {
    removeItem(productId);
    showToast('Removed from cart', 'success');
  }

  function handleClear() {
    if (window.confirm('Clear the cart? This cannot be undone.')) clearCart();
  }

  function handleApplyPromo(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (applyPromo(promoInput)) {
      setPromoInput('');
      setPromoError('');
    } else {
      setPromoError('Invalid promo code');
    }
  }

  if (items.length === 0) {
    return (
      <section>
        <h1 className="font-display text-3xl font-extrabold">Cart</h1>
        {notice && <p role="status" className="mt-4 rounded-xl border-2 border-line bg-surface shadow-pop p-3 text-sm">{notice}</p>}
        <div className="mt-6 rounded-2xl border border-dashed border-line bg-surface p-8 text-center">
          <p className="text-ink-muted">Your cart is empty.</p>
          <Link to="/" className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-brand px-4 font-semibold text-on-brand hover:bg-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
            Browse products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h1 className="font-display text-3xl font-extrabold">Cart</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* lines */}
        <div>
          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <li key={item.productId} className="flex flex-wrap items-center gap-4 rounded-2xl border-2 border-line bg-surface shadow-pop p-3">
                <img src={item.thumbnail} alt={item.title} width={80} height={80} loading="lazy" className="h-20 w-20 rounded-xl bg-surface-muted object-contain" />
                <div className="min-w-40 flex-1">
                  <Link to={`/products/${item.productId}`} className="font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-brand">
                    {item.title}
                  </Link>
                  <PriceBlock price={item.price} discountPercentage={item.discountPercentage} />
                </div>
                <QuantityStepper value={item.quantity} min={1} max={item.stock} onChange={(qty) => setQuantity(item.productId, qty)} />
                <p className="w-24 text-right font-bold">{formatPrice(discountedPrice(item.price, item.discountPercentage) * item.quantity)}</p>
                <Button variant="danger" onClick={() => handleRemove(item.productId)} aria-label={`Remove ${item.title}`}>
                  Remove
                </Button>
              </li>
            ))}
          </ul>
          <Button variant="secondary" className="mt-4" onClick={handleClear}>
            Clear cart
          </Button>
        </div>

        {/* summary */}
        <aside className="h-fit rounded-2xl border-2 border-line bg-surface shadow-pop p-4">
          <h2 className="font-display text-xl font-bold">Order summary</h2>

          <form onSubmit={handleApplyPromo} noValidate className="mt-4 flex items-start gap-2">
            <div className="flex-1">
              <FormField id="promo" label="Promo code" value={promoInput} onChange={(e) => { setPromoInput(e.target.value); setPromoError(''); }} error={promoError} />
            </div>
            <Button type="submit" variant="secondary" className="mt-7">Apply</Button>
          </form>

          <dl className="mt-4 flex flex-col gap-2 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(totals.subtotal)}</dd></div>
            {promoCode && (
              <div className="flex justify-between text-green-700 dark:text-green-400">
                <dt>
                  Discount ({promoCode} −{PROMO_PERCENT}%){' '}
                  <button type="button" onClick={removePromo} className="underline focus-visible:outline-2 focus-visible:outline-brand">Remove</button>
                </dt>
                <dd>−{formatPrice(totals.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between"><dt>Shipping</dt><dd>{totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}</dd></div>
            <div className="flex justify-between border-t border-line pt-2 text-lg font-bold"><dt>Total</dt><dd>{formatPrice(totals.total)}</dd></div>
          </dl>

          <Button className="mt-4 w-full" onClick={() => navigate('/checkout')}>
            Proceed to checkout
          </Button>
        </aside>
      </div>
    </section>
  );
}
