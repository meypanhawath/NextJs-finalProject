'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  getLocalWatchlist,
  getLocalFavorites,
  getLocalRecent,
  removeFromLocalWatchlist,
  removeFromLocalFavorites,
  clearLocalRecent,
  MovieItem,
} from '@/lib/localStore';

function ItemCard({ item, onRemove }: { item: MovieItem; onRemove?: (id: number) => void }) {
  const imageUrl = item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : '/placeholder-poster.jpg';

  return (
    <div className="bg-gray-900/60 rounded-lg p-3 flex items-center gap-3">
      <Link href={`/movies/${item.id}`} className="flex items-center gap-3">
        <img src={imageUrl} alt={item.title} className="w-16 h-24 object-cover rounded-md" />
        <div className="text-white">
          <div className="font-semibold">{item.title ?? `#${item.id}`}</div>
          <div className="text-xs text-gray-400">ID: {item.id}</div>
        </div>
      </Link>
      <div className="ml-auto">
        {onRemove && (
          <button
            onClick={() => onRemove(item.id)}
            className="text-xs px-3 py-1 bg-red-600 rounded text-white"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

export default function ActivityPage() {
  const [watchlist, setWatchlist] = useState<MovieItem[]>([]);
  const [favorites, setFavorites] = useState<MovieItem[]>([]);
  const [recent, setRecent] = useState<MovieItem[]>([]);

  useEffect(() => {
    setWatchlist(getLocalWatchlist());
    setFavorites(getLocalFavorites());
    setRecent(getLocalRecent());
  }, []);

  function removeWL(id: number) {
    removeFromLocalWatchlist(id);
    setWatchlist(getLocalWatchlist());
  }

  function removeFav(id: number) {
    removeFromLocalFavorites(id);
    setFavorites(getLocalFavorites());
  }

  function clearRecent() {
    clearLocalRecent();
    setRecent([]);
  }

  return (
    <div className="min-h-screen pt-24 bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">My Activity</h1>

        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent</h2>
            <div className="flex items-center gap-2">
              <button onClick={clearRecent} className="text-xs px-3 py-1 bg-gray-800 rounded">Clear</button>
            </div>
          </div>

          {recent.length === 0 ? (
            <div className="text-gray-400">No recent items yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {recent.map((it) => (
                <ItemCard key={it.id} item={it} />
              ))}
            </div>
          )}
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Favorites</h2>
          {favorites.length === 0 ? (
            <div className="text-gray-400">No favorites yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {favorites.map((it) => (
                <ItemCard key={it.id} item={it} onRemove={removeFav} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Watchlist</h2>
          {watchlist.length === 0 ? (
            <div className="text-gray-400">Your watchlist is empty.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {watchlist.map((it) => (
                <ItemCard key={it.id} item={it} onRemove={removeWL} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
