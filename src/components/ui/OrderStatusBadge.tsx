import type { OrderStatus } from '../../types/order';

const COLORS: Record<OrderStatus, string> = {
  Processing: 'bg-gray-200 text-gray-800',
  Shipped: 'bg-blue-100 text-blue-800',
  Delivered: 'bg-green-100 text-green-800',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${COLORS[status]}`}>{status}</span>;
}
