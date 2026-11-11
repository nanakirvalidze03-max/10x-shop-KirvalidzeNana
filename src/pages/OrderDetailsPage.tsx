import { useParams } from 'react-router-dom';
import { OrderStatusBadge } from '../components/ui/OrderStatusBadge';
import type { OrderStatus } from '../types/order';
import { discountedPrice, formatDate, formatPrice } from '../utils/format';
import { getOrderStatus, loadOrders } from '../utils/orders';
import NotFoundPage from './NotFoundPage';

const STEPS: OrderStatus[] = ['Processing', 'Shipped', 'Delivered'];

export default function OrderDetailsPage() {
  const { id } = useParams();
  const order = loadOrders().find((o) => String(o.id) === id);
  if (!order) return <NotFoundPage />; // unknown order id -> 404 page

  const status = getOrderStatus(order);
  const reached = STEPS.indexOf(status);

  return (
    <section>
      <h1 className="font-display text-3xl font-extrabold">Order #{order.number}</h1>
      <p className="mt-1 text-sm text-ink-muted">Placed on {formatDate(order.placedAt)}</p>

      <ol className="mt-4 flex flex-wrap items-center gap-3">
        {STEPS.map((step, index) => (
          <li key={step} className={`text-sm font-medium ${index <= reached ? 'text-brand' : 'text-ink-muted'}`}>
            {index <= reached ? '✓' : '○'} {step}
          </li>
        ))}
        <li className="ml-auto"><OrderStatusBadge status={status} /></li>
      </ol>

      <div className="mt-6 grid gap-6 md:grid-cols-[2fr_1fr]">
        <ul className="flex flex-col gap-2">
          {order.items.map((i) => (
            <li key={i.productId} className="flex items-center gap-3 rounded-2xl border-2 border-line bg-surface shadow-pop p-3">
              <img src={i.thumbnail} alt={i.title} width={56} height={56} loading="lazy" className="h-14 w-14 rounded bg-surface-muted object-contain" />
              <span className="flex-1">{i.title} × {i.quantity}</span>
              <span className="font-semibold">{formatPrice(discountedPrice(i.price, i.discountPercentage) * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <aside className="h-fit rounded-2xl border-2 border-line bg-surface shadow-pop p-4 text-sm">
          <h2 className="font-semibold">Shipping to</h2>
          <p>{order.shipping.fullName}<br />{order.shipping.address}, {order.shipping.city}<br />{order.shipping.email}</p>
          <dl className="mt-3 flex flex-col gap-1 border-t border-line pt-3">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
            {order.discount > 0 && <div className="flex justify-between"><dt>Discount</dt><dd>−{formatPrice(order.discount)}</dd></div>}
            <div className="flex justify-between"><dt>Shipping</dt><dd>{order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost)}</dd></div>
            <div className="flex justify-between text-base font-bold"><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
