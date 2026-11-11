import { isRecord } from './guards';

// Reads a string value from router `location.state` (which is typed as unknown).
export function getStateString(state: unknown, key: string): string | null {
  if (!isRecord(state)) return null;
  const value = state[key];
  return typeof value === 'string' ? value : null;
}
