import type { CatalogParams } from '../types/catalog';
import type { Category, Product, ProductsResponse } from '../types/product';
import { isCategoryList, isProduct, isProductsResponse } from '../utils/guards';
import { buildProductsUrl } from '../utils/url';
import { ApiError } from './ApiError';

const BASE_URL = 'https://dummyjson.com';

// Returns `unknown`: every caller must prove the shape with a type guard.
async function getJson(path: string, signal?: AbortSignal): Promise<unknown> {
  const response = await fetch(BASE_URL + path, { signal });
  if (!response.ok) throw new ApiError(response.status, `Request failed with status ${response.status}`);
  const data: unknown = await response.json();
  return data;
}

export async function fetchProducts(params: CatalogParams, signal?: AbortSignal): Promise<ProductsResponse> {
  const data = await getJson(buildProductsUrl(params), signal);
  if (!isProductsResponse(data)) throw new ApiError(502, 'Unexpected response from the server');
  return data;
}

export async function fetchProduct(id: number, signal?: AbortSignal): Promise<Product> {
  const data = await getJson(`/products/${id}`, signal);
  if (!isProduct(data)) throw new ApiError(502, 'Unexpected response from the server');
  return data;
}

export async function fetchCategories(signal?: AbortSignal): Promise<Category[]> {
  const data = await getJson('/products/categories', signal);
  if (!isCategoryList(data)) throw new ApiError(502, 'Unexpected response from the server');
  return data;
}

export async function fetchRelated(category: string, signal?: AbortSignal): Promise<Product[]> {
  const data = await getJson(`/products/category/${encodeURIComponent(category)}?limit=5`, signal);
  if (!isProductsResponse(data)) throw new ApiError(502, 'Unexpected response from the server');
  return data.products;
}
