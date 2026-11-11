import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchCategories, fetchProducts } from '../api/products.api';
import { ProductGrid } from '../components/product/ProductGrid';
import { Button } from '../components/ui/Button';
import { Pagination } from '../components/ui/Pagination';
import { StatusMessage } from '../components/ui/StatusMessage';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useDebounce } from '../hooks/useDebounce';
import type { AsyncState } from '../types/api';
import type { CatalogParams, SortOption } from '../types/catalog';
import type { Category, Product, ProductsResponse } from '../types/product';
import { isAbortError, toErrorMessage } from '../utils/errors';
import { isSortOption, PAGE_SIZE, parsePage, SORT_OPTIONS } from '../utils/url';

const FIELD =
  'min-h-11 rounded-xl border-2 border-line bg-surface shadow-pop px-3 text-ink focus:border-brand focus:outline-2 focus:outline-brand';

export default function CatalogPage() {
  // FULL: the URL is the single source of truth for q / category / sort / page.
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? '';
  const sortParam = searchParams.get('sort') ?? '';
  const sort: SortOption = isSortOption(sortParam) ? sortParam : '';
  const page = parsePage(searchParams.get('page'));
  const isFiltered = q !== '' || category !== '' || sort !== '' || page > 1; // hero is shown on the clean home view only

  const [state, setState] = useState<AsyncState<ProductsResponse>>({ status: 'loading' });
  const [categories, setCategories] = useState<Category[]>([]);
  const [reloadKey, setReloadKey] = useState(0); // bump to repeat the request (Retry button)
  const [searchInput, setSearchInput] = useState(q); // what the user types (updates instantly)

  const { addItem } = useCart();
  const { showToast } = useToast();

  // Changes some URL params; an empty string removes the param.
  const updateParams = useCallback(
    (changes: Record<string, string>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(changes).forEach(([key, value]) => {
          if (value === '') next.delete(key);
          else next.set(key, value);
        });
        return next;
      });
    },
    [setSearchParams],
  );

  // ----- search: typing -> debounce 400 ms -> URL -----
  const debouncedInput = useDebounce(searchInput, 400);
  const lastUrlQ = useRef(q); // the q value we know is in the URL

  // URL -> input (Back/Forward, "Clear filters"); our own URL updates do not trigger this
  useEffect(() => {
    if (q !== lastUrlQ.current) {
      lastUrlQ.current = q;
      setSearchInput(q);
    }
  }, [q]);

  // input -> URL (search clears category and goes back to page 1)
  useEffect(() => {
    const value = debouncedInput.trim();
    if (value === lastUrlQ.current) return;
    lastUrlQ.current = value;
    updateParams({ q: value, category: '', page: '' });
  }, [debouncedInput, updateParams]);

  // ----- categories (once) -----
  useEffect(() => {
    const controller = new AbortController();
    fetchCategories(controller.signal)
      .then(setCategories)
      .catch(() => setCategories([])); // the filter just stays empty if this fails
    return () => controller.abort();
  }, []);

  // ----- products: reload whenever the URL params change -----
  useEffect(() => {
    const controller = new AbortController();
    const params: CatalogParams = { q, category, sort, page };
    setState({ status: 'loading' });
    fetchProducts(params, controller.signal)
      .then((data) => setState({ status: 'success', data }))
      .catch((e: unknown) => {
        if (isAbortError(e)) return; // cancelled on purpose: an old response must not overwrite a new one
        setState({ status: 'error', message: toErrorMessage(e) });
      });
    return () => controller.abort();
  }, [q, category, sort, page, reloadKey]);

  function handleAdd(product: Product) {
    const added = addItem(product, 1);
    showToast(added ? 'Added to cart ✓' : 'No more items available in stock', added ? 'success' : 'error');
  }

  function handleCategoryChange(e: ChangeEvent<HTMLSelectElement>) {
    lastUrlQ.current = '';
    setSearchInput('');
    updateParams({ category: e.target.value, q: '', page: '' });
  }

  function handleClearFilters() {
    lastUrlQ.current = '';
    setSearchInput('');
    setSearchParams({});
  }

  function handlePageChange(next: number) {
    updateParams({ page: next === 1 ? '' : String(next) });
    window.scrollTo(0, 0);
  }

  function renderContent() {
    if (state.status === 'loading' || state.status === 'idle') {
      return <StatusMessage tone="info">Loading products...</StatusMessage>;
    }
    if (state.status === 'error') {
      return (
        <StatusMessage tone="error" action={<Button onClick={() => setReloadKey((k) => k + 1)}>Retry</Button>}>
          {state.message}
        </StatusMessage>
      );
    }
    const { products, total } = state.data;
    if (products.length === 0) {
      return (
        <StatusMessage tone="empty" action={<Button variant="secondary" onClick={handleClearFilters}>Clear filters</Button>}>
          No products found.
        </StatusMessage>
      );
    }
    const first = (page - 1) * PAGE_SIZE + 1;
    return (
      <>
        <ProductGrid products={products} onAdd={handleAdd} />
        <p className="mt-6 text-center text-sm text-ink-muted">
          Showing {first}–{first + products.length - 1} of {total}
        </p>
        <Pagination page={page} totalPages={Math.ceil(total / PAGE_SIZE)} onChange={handlePageChange} />
      </>
    );
  }

  return (
    <section>
      {isFiltered ? (
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="font-display text-3xl font-extrabold">Catalog</h1>
          {state.status === 'success' && <p className="text-sm font-medium text-ink-muted">{state.data.total} results</p>}
        </div>
      ) : (
        <div className="relative mb-2 overflow-hidden rounded-3xl border-2 border-line bg-brand p-6 text-on-brand shadow-pop-lg sm:p-10">
          <p className="inline-block -rotate-2 rounded-full border-2 border-line bg-pop px-3 py-1 text-sm font-extrabold text-on-pop">New drops with every click ✦</p>
          <h1 className="mt-4 font-display text-4xl leading-none font-extrabold sm:text-6xl">
            Shop like
            <br />
            it&apos;s <span className="inline-block -rotate-2 rounded-2xl border-2 border-line bg-hot px-3 py-1 text-on-pop">10X</span>
          </h1>
          <p className="mt-4 max-w-md font-medium">Hundreds of products, one tiny cart. Try the code <strong>10X10</strong> for 10% off.</p>
          <span aria-hidden="true" className="animate-float absolute top-4 right-6 text-6xl sm:top-8 sm:right-12 sm:text-8xl">🛍️</span>
        </div>
      )}

      <div className="mt-4 mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
        <div>
          <label htmlFor="search" className="sr-only">Search products</label>
          <input id="search" type="search" placeholder="Search products..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className={`${FIELD} w-full`} />
        </div>
        <div>
          <label htmlFor="category" className="sr-only">Category</label>
          <select id="category" value={category} onChange={handleCategoryChange} className={`${FIELD} w-full`}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sort" className="sr-only">Sort by</label>
          <select id="sort" value={sort} onChange={(e) => updateParams({ sort: e.target.value, page: '' })} className={`${FIELD} w-full`}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.value === '' ? 'Sort: Default' : o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {renderContent()}
    </section>
  );
}
