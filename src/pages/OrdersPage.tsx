import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { OrderStatusBadge } from '../components/ui/OrderStatusBadge';
import { countItems } from '../utils/cart';
import { formatDate, formatPrice } from '../utils/format';
import { getOrderStatus, loadOrders } from '../utils/orders';

export default function OrdersPage() {
  const [orders] = useState(loadOrders);
  const [now, setNow] = useState(() => new Date());

  // Every 30 s re-calculate the statuses. The cleanup stops the timer when we leave the page.
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  const newestFirst = [...orders].sort((a, b) => b.id - a.id);

  if (newestFirst.length === 0) {
    return (
      <section>
        <h1 className="font-display text-3xl font-extrabold">Orders</h1>
        <div className="mt-6 rounded-2xl border border-dashed border-line bg-surface p-8 text-center">
          <p className="text-ink-muted">You have no orders yet.</p>
          <Link to="/" className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-brand px-4 font-semibold text-on-brand hover:bg-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
            Browse products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h1 className="font-display text-3xl font-extrabold">Orders</h1>
      <ul className="mt-6 flex flex-col gap-3">
        {newestFirst.map((order) => (
          <li key={order.id}>
            <Link to={`/orders/${order.id}`} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-line bg-surface shadow-pop p-4 hover:border-brand focus-visible:outline-2 focus-visible:outline-brand">
              <div>
                <p className="font-semibold">#{order.number}</p>
                <p className="text-sm text-ink-muted">{formatDate(order.placedAt)} · {countItems(order.items)} items</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold">{formatPrice(order.total)}</span>
                <OrderStatusBadge status={getOrderStatus(order, now)} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
