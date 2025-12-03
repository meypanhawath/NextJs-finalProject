'use client';

import { useEffect, useState } from 'react';
import {
  addToLocalWatchlist,
  isInLocalWatchlist,
  removeFromLocalWatchlist,
  MovieItem,
} from '../../lib/localStore';

type Props = {
  movieId: number;
  title?: string;
  poster_path?: string | null;
};

export default function WatchlistButton({ movieId, title, poster_path }: Props) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      setSaved(isInLocalWatchlist(movieId));
    } catch (e) {
      setSaved(false);
    }
  }, [movieId]);

  function toggle() {
    try {
      if (isInLocalWatchlist(movieId)) {
        removeFromLocalWatchlist(movieId);
        setSaved(false);
      } else {
        const item: MovieItem = { id: movieId, title, poster_path };
        addToLocalWatchlist(item);
        setSaved(true);
      }
    } catch (e) {
      console.error('Watchlist toggle failed', e);
    }
  }

  return (
    <button
      onClick={toggle}
      className={`px-4 py-2 rounded-md font-medium transition-colors ${
        saved ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-white'
      }`}
      aria-pressed={saved}
      title={saved ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      {saved ? '★ In Watchlist' : '☆ Add to Watchlist'}
    </button>
  );
}
