'use client';

import { useEffect, useState } from 'react';

type Props = {
  movieId: number;
  title?: string;
};

export default function WatchlistButton({ movieId, title }: Props) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('watchlist');
      const list: number[] = raw ? JSON.parse(raw) : [];
      setSaved(list.includes(movieId));
    } catch (e) {
      setSaved(false);
    }
  }, [movieId]);

  function toggle() {
    try {
      const raw = localStorage.getItem('watchlist');
      const list: number[] = raw ? JSON.parse(raw) : [];
      let next: number[];
      if (list.includes(movieId)) {
        next = list.filter((id) => id !== movieId);
      } else {
        next = [movieId, ...list];
      }
      localStorage.setItem('watchlist', JSON.stringify(next));
      setSaved(next.includes(movieId));
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
