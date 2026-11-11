import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchProduct, fetchRelated } from '../api/products.api';
import { isApiError } from '../api/ApiError';
import { PriceBlock } from '../components/product/PriceBlock';
import { ProductGrid } from '../components/product/ProductGrid';
import { StockBadge } from '../components/product/StockBadge';
import { Button } from '../components/ui/Button';
import { QuantityStepper } from '../components/ui/QuantityStepper';
import { StatusMessage } from '../components/ui/StatusMessage';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import type { AsyncState } from '../types/api';
import type { Product } from '../types/product';
import { isAbortError, toErrorMessage } from '../utils/errors';
import { formatDate } from '../utils/format';
import { parseProductId } from '../utils/url';
import NotFoundPage from './NotFoundPage';

type ProductState = AsyncState<Product> | { status: 'notfound' };
type Tab = 'description' | 'reviews';

// Wrapper: validates the id from the URL. `key={id}` makes React create a FRESH ProductDetails
// (fresh state) when we move from one product to another (e.g. from "Related products").
export default function ProductPage() {
  const { id } = useParams();
  const productId = parseProductId(id);
  if (productId === null) return <NotFoundPage />; // "/products/abc" -> no request at all
  return <ProductDetails key={productId} id={productId} />;
}

function ProductDetails({ id }: { id: number }) {
  const navigate = useNavigate();
  const { items, addItem } = useCart();
  const { showToast } = useToast();

  const [state, setState] = useState<ProductState>({ status: 'loading' });
  const [reloadKey, setReloadKey] = useState(0);
  const [related, setRelated] = useState<Product[]>([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<Tab>('description');
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  // Load the product. `id` and `reloadKey` are dependencies: when they change, a new request is made.
  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });
    fetchProduct(id, controller.signal)
      .then((data) => setState({ status: 'success', data }))
      .catch((e: unknown) => {
        if (isAbortError(e)) return;
        if (isApiError(e) && e.status === 404) setState({ status: 'notfound' });
        else setState({ status: 'error', message: toErrorMessage(e) });
      });
    return () => controller.abort();
  }, [id, reloadKey]);

  // Related products (FULL): same category, without the current product, max 4
  const category = state.status === 'success' ? state.data.category : null;
  useEffect(() => {
    if (category === null) return;
    const controller = new AbortController();
    fetchRelated(category, controller.signal)
      .then((list) => setRelated(list.filter((p) => p.id !== id).slice(0, 4)))
      .catch(() => setRelated([]));
    return () => controller.abort();
  }, [category, id]);

  if (state.status === 'notfound') return <NotFoundPage />;
  if (state.status === 'loading' || state.status === 'idle') {
    return <StatusMessage tone="info">Loading product...</StatusMessage>;
  }
  if (state.status === 'error') {
    return (
      <StatusMessage tone="error" action={<Button onClick={() => setReloadKey((k) => k + 1)}>Retry</Button>}>
        {state.message}
      </StatusMessage>
    );
  }

  const product = state.data;
  const inCart = items.find((i) => i.productId === product.id)?.quantity ?? 0;
  const remaining = Math.max(0, product.stock - inCart);
  const outOfStock = product.stock === 0;
  const images = product.images.length > 0 ? product.images : [product.thumbnail];
  const reviews = product.reviews ?? [];

  function handleAdd() {
    if (addItem(product, qty)) {
      setMessage({ ok: true, text: `Added ${qty} to cart ✓` });
    } else {
      setMessage({ ok: false, text: `Only ${remaining} more can be added (you already have ${inCart} in your cart).` });
    }
  }

  function handleRelatedAdd(p: Product) {
    const added = addItem(p, 1);
    showToast(added ? 'Added to cart ✓' : 'No more items available in stock', added ? 'success' : 'error');
  }

  return (
    <article>
      <button type="button" onClick={() => navigate(-1)} className="mb-4 min-h-11 text-sm text-brand hover:underline focus-visible:outline-2 focus-visible:outline-brand">
        ← Back to catalog
      </button>

      <div className="grid gap-8 md:grid-cols-2">
        {/* gallery */}
        <div>
          <img
            src={images[imageIndex] ?? product.thumbnail}
            alt={product.title}
            width={600}
            height={600}
            className="aspect-square w-full rounded-2xl border-2 border-line bg-surface shadow-pop object-contain"
          />
          {images.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {images.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setImageIndex(index)}
                  aria-label={`Show photo ${index + 1}`}
                  aria-current={index === imageIndex ? 'true' : undefined}
                  className={`h-16 w-16 overflow-hidden rounded-xl border-2 bg-surface focus-visible:outline-2 focus-visible:outline-brand ${index === imageIndex ? 'border-brand' : 'border-line'}`}
                >
                  <img src={src} alt="" width={64} height={64} loading="lazy" className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* info */}
        <div className="flex flex-col gap-3">
          <h1 className="font-display text-3xl font-extrabold">{product.title}</h1>
          <p className="text-ink-muted capitalize">
            {product.brand ? `${product.brand} · ` : ''}
            <Link to={`/?category=${encodeURIComponent(product.category)}`} className="text-brand hover:underline">
              {product.category}
            </Link>
          </p>
          <PriceBlock price={product.price} discountPercentage={product.discountPercentage} large />
          <p className="text-sm">★ {product.rating.toFixed(1)} · {reviews.length} reviews</p>
          <StockBadge stock={product.stock} />

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <QuantityStepper value={qty} min={1} max={Math.max(product.stock, 1)} onChange={setQty} disabled={outOfStock} />
            <Button onClick={handleAdd} disabled={outOfStock}>
              {outOfStock ? 'Out of stock' : 'Add to cart'}
            </Button>
          </div>
          {message && (
            <p role="status" className={`text-sm font-medium ${message.ok ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
              {message.text}
            </p>
          )}
        </div>
      </div>

      {/* tabs */}
      <div className="mt-10">
        <div role="tablist" className="flex gap-2 border-b border-line">
          {(['description', 'reviews'] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`min-h-11 border-b-2 px-4 text-sm font-semibold capitalize focus-visible:outline-2 focus-visible:outline-brand ${tab === t ? 'border-brand text-brand' : 'border-transparent text-ink-muted hover:text-ink'}`}
            >
              {t === 'reviews' ? `Reviews (${reviews.length})` : 'Description'}
            </button>
          ))}
        </div>
        <div role="tabpanel" className="py-4">
          {tab === 'description' ? (
            <p className="max-w-3xl">{product.description}</p>
          ) : reviews.length === 0 ? (
            <p className="text-ink-muted">No reviews yet.</p>
          ) : (
            <ul className="flex max-w-3xl flex-col gap-3">
              {reviews.map((r, index) => (
                <li key={`${r.reviewerName}-${r.date}-${index}`} className="rounded-xl border-2 border-line bg-surface shadow-pop p-3">
                  <p className="text-sm font-semibold">{r.reviewerName} · {'★'.repeat(r.rating)} <span className="font-normal text-ink-muted">{formatDate(r.date)}</span></p>
                  <p className="mt-1 text-sm">{r.comment}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 font-display text-2xl font-extrabold">Related products</h2>
          <ProductGrid products={related} onAdd={handleRelatedAdd} />
        </section>
      )}
    </article>
  );
}
