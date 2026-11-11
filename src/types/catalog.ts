// Literal union: only these values are valid sort options.
export type SortOption = '' | 'price-asc' | 'price-desc' | 'rating-desc' | 'title-asc';

export interface CatalogParams {
  q: string;
  category: string;
  sort: SortOption;
  page: number;
}
