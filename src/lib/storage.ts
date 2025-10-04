// Local storage helpers for progress tracking, favorites, and watchlist
// Since no account creation is required, we use localStorage

export interface WatchProgress {
  id: string;
  mediaType: "movie" | "tv";
  title: string;
  posterPath: string | null;
  timestamp: number;
  duration: number;
  lastWatched: Date;
  seasonNumber?: number;
  episodeNumber?: number;
}

export interface WatchlistItem {
  id: number;
  mediaType: "movie" | "tv";
  title: string;
  posterPath: string | null;
  addedAt: Date;
}

export interface FavoriteItem extends WatchlistItem {}

// Watch Progress
export const saveWatchProgress = (progress: WatchProgress) => {
  const existing = getWatchProgress();
  const updated = existing.filter(
    (p) => !(p.id === progress.id && p.seasonNumber === progress.seasonNumber && p.episodeNumber === progress.episodeNumber)
  );
  updated.unshift(progress);
  localStorage.setItem("watchProgress", JSON.stringify(updated.slice(0, 50))); // Keep last 50
};

export const getWatchProgress = (): WatchProgress[] => {
  const data = localStorage.getItem("watchProgress");
  return data ? JSON.parse(data) : [];
};

export const getItemProgress = (
  id: string,
  seasonNumber?: number,
  episodeNumber?: number
): WatchProgress | null => {
  const progress = getWatchProgress();
  return (
    progress.find(
      (p) =>
        p.id === id &&
        p.seasonNumber === seasonNumber &&
        p.episodeNumber === episodeNumber
    ) || null
  );
};

export const removeWatchProgress = (id: string) => {
  const existing = getWatchProgress();
  const updated = existing.filter((p) => p.id !== id);
  localStorage.setItem("watchProgress", JSON.stringify(updated));
};

// Watchlist
export const addToWatchlist = (item: WatchlistItem) => {
  const existing = getWatchlist();
  if (!existing.find((i) => i.id === item.id && i.mediaType === item.mediaType)) {
    existing.unshift(item);
    localStorage.setItem("watchlist", JSON.stringify(existing));
  }
};

export const removeFromWatchlist = (id: number, mediaType: "movie" | "tv") => {
  const existing = getWatchlist();
  const updated = existing.filter((i) => !(i.id === id && i.mediaType === mediaType));
  localStorage.setItem("watchlist", JSON.stringify(updated));
};

export const getWatchlist = (): WatchlistItem[] => {
  const data = localStorage.getItem("watchlist");
  return data ? JSON.parse(data) : [];
};

export const isInWatchlist = (id: number, mediaType: "movie" | "tv"): boolean => {
  const watchlist = getWatchlist();
  return watchlist.some((i) => i.id === id && i.mediaType === mediaType);
};

// Favorites
export const addToFavorites = (item: FavoriteItem) => {
  const existing = getFavorites();
  if (!existing.find((i) => i.id === item.id && i.mediaType === item.mediaType)) {
    existing.unshift(item);
    localStorage.setItem("favorites", JSON.stringify(existing));
  }
};

export const removeFromFavorites = (id: number, mediaType: "movie" | "tv") => {
  const existing = getFavorites();
  const updated = existing.filter((i) => !(i.id === id && i.mediaType === mediaType));
  localStorage.setItem("favorites", JSON.stringify(updated));
};

export const getFavorites = (): FavoriteItem[] => {
  const data = localStorage.getItem("favorites");
  return data ? JSON.parse(data) : [];
};

export const isInFavorites = (id: number, mediaType: "movie" | "tv"): boolean => {
  const favorites = getFavorites();
  return favorites.some((i) => i.id === id && i.mediaType === mediaType);
};
