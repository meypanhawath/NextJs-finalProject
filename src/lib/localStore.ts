export type MovieItem = {
  id: number;
  title?: string;
  poster_path?: string | null;
  addedAt?: string; // ISO timestamp
};

const WATCHLIST_KEY = 'watchlist_v1';
const FAVORITES_KEY = 'favorites_v1';
const RECENT_KEY = 'recent_v1';

function safeGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch (e) {
    console.error('localStore.safeGet parse error', e);
    return null;
  }
}

function safeSet<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('localStore.safeSet error', e);
  }
}

// Watchlist
export function getLocalWatchlist(): MovieItem[] {
  return safeGet<MovieItem[]>(WATCHLIST_KEY) ?? [];
}

export function saveLocalWatchlist(items: MovieItem[]) {
  safeSet(WATCHLIST_KEY, items);
}

export function addToLocalWatchlist(item: MovieItem) {
  const list = getLocalWatchlist();
  if (!list.find((x) => x.id === item.id)) {
    list.unshift({ ...item, addedAt: new Date().toISOString() });
    saveLocalWatchlist(list);
  }
}

export function removeFromLocalWatchlist(id: number) {
  const list = getLocalWatchlist().filter((x) => x.id !== id);
  saveLocalWatchlist(list);
}

export function isInLocalWatchlist(id: number) {
  return getLocalWatchlist().some((x) => x.id === id);
}

// Favorites
export function getLocalFavorites(): MovieItem[] {
  return safeGet<MovieItem[]>(FAVORITES_KEY) ?? [];
}

export function saveLocalFavorites(items: MovieItem[]) {
  safeSet(FAVORITES_KEY, items);
}

export function addToLocalFavorites(item: MovieItem) {
  const list = getLocalFavorites();
  if (!list.find((x) => x.id === item.id)) {
    list.unshift({ ...item, addedAt: new Date().toISOString() });
    saveLocalFavorites(list);
  }
}

export function removeFromLocalFavorites(id: number) {
  const list = getLocalFavorites().filter((x) => x.id !== id);
  saveLocalFavorites(list);
}

export function isInLocalFavorites(id: number) {
  return getLocalFavorites().some((x) => x.id === id);
}

// Recent
export function getLocalRecent(limit = 200): MovieItem[] {
  return (safeGet<MovieItem[]>(RECENT_KEY) ?? []).slice(0, limit);
}

export function addToLocalRecent(item: MovieItem, limit = 200) {
  const list = safeGet<MovieItem[]>(RECENT_KEY) ?? [];
  // remove existing
  const next = [item, ...list.filter((x) => x.id !== item.id)].map((x) => ({
    ...x,
    addedAt: x.addedAt ?? new Date().toISOString(),
  }));
  safeSet(RECENT_KEY, next.slice(0, limit));
}

export function clearLocalRecent() {
  safeSet(RECENT_KEY, []);
}
