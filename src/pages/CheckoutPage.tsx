import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Confetti } from '../components/ui/Confetti';
import { FormField } from '../components/ui/FormField';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import type { Order, ShippingInfo } from '../types/order';
import { discountedPrice, formatPrice } from '../utils/format';
import { createOrder, loadOrders, saveOrder } from '../utils/orders';
import { validateCheckout } from '../utils/validation';
import type { FormErrors } from '../utils/validation';

interface FieldConfig {
  name: keyof ShippingInfo;
  label: string;
  type: string;
  autoComplete: string;
}

const FIELDS: FieldConfig[] = [
  { name: 'fullName', label: 'Full name', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'address', label: 'Address', type: 'text', autoComplete: 'street-address' },
  { name: 'city', label: 'City', type: 'text', autoComplete: 'address-level2' },
];

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, totals, clearCart } = useCart();

  // Controlled form: every input value lives in React state. fullName starts from the username.
  const [values, setValues] = useState<ShippingInfo>({ fullName: user.username, email: '', address: '', city: '' });
  const [errors, setErrors] = useState<FormErrors<ShippingInfo>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const handleChange = (field: keyof ShippingInfo) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validateCheckout(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true); // disables the button: no double orders
    setSubmitError('');
    try {
      await new Promise<void>((resolve) => setTimeout(resolve, 600)); // simulated server delay
      const order = createOrder(items, totals, { ...values }, loadOrders().length);
      saveOrder(order);
      setPlacedOrder(order);
      clearCart(); // the header badge and the Cart page update immediately
    } catch {
      setSubmitError('Something went wrong while placing your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  // Confirmation (also shown after the cart became empty)
  if (placedOrder) {
    return (
      <section className="mx-auto max-w-lg rounded-2xl border-2 border-line bg-surface shadow-pop p-6 text-center">
        <Confetti />
        <p aria-hidden="true" className="animate-pop text-6xl">🎉</p>
        <p className="mt-2 inline-block -rotate-2 rounded-full border-2 border-line bg-pop px-4 py-1 text-sm font-extrabold text-on-pop">Congratulations! You are officially 10X</p>
        <h1 className="font-display text-3xl font-extrabold text-brand">Thank you! Your order has been placed.</h1>
        <p className="mt-3">Order <strong>#{placedOrder.number}</strong></p>
        <p className="text-2xl font-bold">{formatPrice(placedOrder.total)}</p>
        <ul className="mt-4 text-left text-sm">
          {placedOrder.items.map((i) => (
            <li key={i.productId} className="flex justify-between border-t border-line py-1">
              <span>{i.title} × {i.quantity}</span>
              <span>{formatPrice(discountedPrice(i.price, i.discountPercentage) * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/orders" className="inline-flex min-h-11 items-center rounded-xl border-2 border-line px-4 font-semibold hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-brand">
            View my orders
          </Link>
          <Link to="/" className="inline-flex min-h-11 items-center rounded-xl bg-brand px-4 font-semibold text-on-brand hover:bg-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
            Continue shopping
          </Link>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return <Navigate to="/cart" replace state={{ notice: 'Your cart is empty. Add something before checking out.' }} />;
  }

  return (
    <section>
      <h1 className="font-display text-3xl font-extrabold">Checkout</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[3fr_2fr]">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 rounded-2xl border-2 border-line bg-surface shadow-pop p-4">
          {FIELDS.map((f) => (
            <FormField
              key={f.name}
              id={f.name}
              label={f.label}
              type={f.type}
              autoComplete={f.autoComplete}
              value={values[f.name]}
              onChange={handleChange(f.name)}
              error={errors[f.name]}
              disabled={submitting}
            />
          ))}
          {submitError && <p role="alert" className="text-sm text-red-700 dark:text-red-400">{submitError}</p>}
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Placing order...' : 'Place order'}
          </Button>
        </form>

        <aside className="h-fit rounded-2xl border-2 border-line bg-surface shadow-pop p-4">
          <h2 className="font-display text-xl font-bold">Order summary</h2>
          <ul className="mt-3 text-sm">
            {items.map((i) => (
              <li key={i.productId} className="flex justify-between gap-2 border-t border-line py-1">
                <span>{i.title} × {i.quantity}</span>
                <span>{formatPrice(discountedPrice(i.price, i.discountPercentage) * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-3 flex flex-col gap-1 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(totals.subtotal)}</dd></div>
            {totals.discount > 0 && <div className="flex justify-between"><dt>Discount</dt><dd>−{formatPrice(totals.discount)}</dd></div>}
            <div className="flex justify-between"><dt>Shipping</dt><dd>{totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}</dd></div>
            <div className="flex justify-between border-t border-line pt-2 text-lg font-bold"><dt>Total</dt><dd>{formatPrice(totals.total)}</dd></div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
