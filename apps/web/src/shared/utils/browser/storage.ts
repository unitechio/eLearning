type StorageType = 'local' | 'session';

type StorageItem<T> = {
  readonly value: T;
  readonly expiresAt?: number;
};

function getStorage(type: StorageType): Storage {
  return type === 'local' ? localStorage : sessionStorage;
}

/**
 * Stores a typed value in localStorage or sessionStorage.
 * Supports optional TTL in milliseconds.
 *
 * @example
 * storageSet('user', { id: 1 })
 * storageSet('token', 'abc', { ttl: 3_600_000 }) // expires in 1 hour
 * storageSet('pref', 'dark', { type: 'session' })
 */
export function storageSet<T>(
  key: string,
  value: T,
  options: { readonly ttl?: number; readonly type?: StorageType } = {}
): void {
  const { ttl, type = 'local' } = options;
  const item: StorageItem<T> = {
    value,
    ...(ttl !== undefined && { expiresAt: Date.now() + ttl }),
  };
  getStorage(type).setItem(key, JSON.stringify(item));
}

/**
 * Retrieves a typed value from storage. Returns null if the key is absent or expired.
 *
 * @example
 * storageGet<{ id: number }>('user') // { id: 1 } or null
 */
export function storageGet<T>(
  key: string,
  options: { readonly type?: StorageType } = {}
): T | null {
  const { type = 'local' } = options;
  const raw = getStorage(type).getItem(key);
  if (raw === null) return null;
  try {
    const item = JSON.parse(raw) as StorageItem<T>;
    if (item.expiresAt !== undefined && Date.now() > item.expiresAt) {
      getStorage(type).removeItem(key);
      return null;
    }
    return item.value;
  } catch {
    return null;
  }
}

/**
 * Removes a key from storage.
 *
 * @example
 * storageRemove('user')
 */
export function storageRemove(
  key: string,
  options: { readonly type?: StorageType } = {}
): void {
  const { type = 'local' } = options;
  getStorage(type).removeItem(key);
}

/**
 * Clears all entries from the given storage.
 *
 * @example
 * storageClear('session')
 */
export function storageClear(type: StorageType = 'local'): void {
  getStorage(type).clear();
}
