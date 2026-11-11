import { isApiError } from '../api/ApiError';

// fetch() rejects with an AbortError when we cancel it. That is not a real error.
export function isAbortError(e: unknown): boolean {
  return e instanceof DOMException && e.name === 'AbortError';
}

export function toErrorMessage(e: unknown): string {
  if (isApiError(e)) return `The server answered with status ${e.status}. Please try again.`;
  return 'Could not load data. Check your connection and try again.';
}
