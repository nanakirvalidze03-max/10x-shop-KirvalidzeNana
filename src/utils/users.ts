import type { StoredUser } from '../types/user';
import { isUserList } from './guards';
import { readStorage, STORAGE_KEYS, writeStorage } from './storage';

export function loadUsers(): StoredUser[] {
  return readStorage(STORAGE_KEYS.users, isUserList) ?? [];
}

export function saveUser(user: StoredUser): void {
  writeStorage(STORAGE_KEYS.users, [...loadUsers(), user]);
}

// Emails are compared in lowercase.
export function findUserByEmail(email: string): StoredUser | undefined {
  const normalized = email.trim().toLowerCase();
  return loadUsers().find((u) => u.email === normalized);
}
