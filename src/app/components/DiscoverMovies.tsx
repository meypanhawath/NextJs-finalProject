'use client';

import { useEffect, useState } from 'react';
import MovieCard from './MovieCard';

type Props = {
  genres?: number[];
};

type DiscoverResponse = {
  page: number;
  results: any[];
  total_pages: number;
  total_results: number;
};

export default function DiscoverMovies({ genres = [] }: Props) {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const base = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
        const key = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        if (!base || !key) throw new Error('Missing TMDB public env vars');
        const genresParam = genres.length ? `&with_genres=${genres.join(',')}` : '';
        const url = `${base}/discover/movie?api_key=${key}&page=${page}${genresParam}&sort_by=popularity.desc`;
        const res = await fetch(url);
        const json: DiscoverResponse = await res.json();
        if (!cancelled) {
          // Limit to 12 items per UI page
          setItems((json.results || []).slice(0, 12));
          setTotalPages(Math.min(json.total_pages || 1, 20)); // cap to 20 for UX
        }
      } catch (err) {
        console.error('Discover fetch error', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [page, genres]);

  function goToPage(p: number) {
    setPage(Math.max(1, Math.min(totalPages, p)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div>
      {loading && <div className="text-gray-300">Loading...</div>}

      {!loading && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {items.map((m) => (
              <MovieCard key={m.id} item={m} type="movie" fullWidth />
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center space-x-3">
            <button onClick={() => goToPage(page - 1)} disabled={page === 1} className="px-3 py-1 rounded-md bg-gray-800/60 text-white disabled:opacity-50">Previous</button>

            <div className="flex items-center space-x-2">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + Math.max(1, page - 2)).map((p) => {
                const valid = p <= totalPages && p >= 1;
                if (!valid) return null;
                return (
                  <button key={p} onClick={() => goToPage(p)} className={`px-3 py-1 rounded-md ${p === page ? 'bg-[#00C6B1] text-black' : 'bg-gray-800/60 text-white'}`}>{p}</button>
                );
              })}
            </div>

            <button onClick={() => goToPage(page + 1)} disabled={page === totalPages} className="px-3 py-1 rounded-md bg-gray-800/60 text-white disabled:opacity-50">Next</button>
          </div>
        </>
      )}
    </div>
  );
}
