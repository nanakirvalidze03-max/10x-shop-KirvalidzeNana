import type { CatalogParams, SortOption } from '../types/catalog';

export const PAGE_SIZE = 12;

export const SORT_OPTIONS: ReadonlyArray<{ value: SortOption; label: string }> = [
  { value: '', label: 'Default' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating-desc', label: 'Rating: high to low' },
  { value: 'title-asc', label: 'Name A→Z' },
];

const SORT_MAP: Record<Exclude<SortOption, ''>, readonly [string, 'asc' | 'desc']> = {
  'price-asc': ['price', 'asc'],
  'price-desc': ['price', 'desc'],
  'rating-desc': ['rating', 'desc'],
  'title-asc': ['title', 'asc'],
};

export function isSortOption(value: string): value is SortOption {
  return SORT_OPTIONS.some((o) => o.value === value);
}

export function parsePage(value: string | null): number {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 ? n : 1;
}

// Search and category exclude each other (DummyJSON limitation): search wins.
export function buildProductsUrl(params: CatalogParams): string {
  const query = new URLSearchParams({
    limit: String(PAGE_SIZE),
    skip: String((params.page - 1) * PAGE_SIZE),
  });
  let path = '/products';
  if (params.q) {
    path = '/products/search';
    query.set('q', params.q);
  } else if (params.category) {
    path = `/products/category/${encodeURIComponent(params.category)}`;
  }
  if (params.sort) {
    const [sortBy, order] = SORT_MAP[params.sort];
    query.set('sortBy', sortBy);
    query.set('order', order);
  }
  return `${path}?${query.toString()}`;
}

// Product ids in the URL must be positive integers: "/products/abc" -> null -> NotFound.
export function parseProductId(id: string | undefined): number | null {
  if (!id || !/^\d+$/.test(id)) return null;
  const n = Number(id);
  return n > 0 ? n : null;
}
