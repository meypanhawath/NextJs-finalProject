'use client';

import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import { fetchPopularTVShows, fetchTrendingTVShows } from '@/services/tmdb';
import { TVShow } from '@/types/tmdb';

export default function TVShowsPage() {
  const [trendingTVShows, setTrendingTVShows] = useState<TVShow[]>([]);
  const [popularTVShows, setPopularTVShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'trending' | 'popular'>('trending');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  useEffect(() => {
    async function loadData() {
      try {
        const [trendingData, popularData] = await Promise.all([
          fetchTrendingTVShows(),
          fetchPopularTVShows()
        ]);

        const normalizeTV = (arr: any[] = []) =>
          arr
            .filter((r) => r && typeof r === 'object' && 'name' in r)
            .map((r) => ({
              id: r.id,
              name: r.name,
              original_name: r.original_name ?? r.name,
              overview: r.overview ?? '',
              poster_path: r.poster_path ?? null,
              backdrop_path: r.backdrop_path ?? null,
              first_air_date: r.first_air_date ?? r.release_date ?? '',
              vote_average: typeof r.vote_average === 'number' ? r.vote_average : 0,
              vote_count: typeof r.vote_count === 'number' ? r.vote_count : 0,
              popularity: typeof r.popularity === 'number' ? r.popularity : 0,
              genre_ids: Array.isArray(r.genre_ids) ? r.genre_ids : [],
              origin_country: Array.isArray(r.origin_country) ? r.origin_country : [],
            } as TVShow));

        setTrendingTVShows(normalizeTV(trendingData.results || []));
        setPopularTVShows(normalizeTV(popularData.results || []));
      } catch (error) {
        console.error('Error loading TV shows:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#00C6B1]"></div>
      </div>
    );
  }
  const currentItems = view === 'trending' ? trendingTVShows : popularTVShows;
  const totalPages = Math.max(1, Math.ceil(currentItems.length / PAGE_SIZE));
  const pageItems = currentItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function switchView(next: 'trending' | 'popular') {
    setView(next);
    setPage(1);
  }

  function goToPage(p: number) {
    setPage(Math.max(1, Math.min(totalPages, p)));
  }

  return (
    <div className="min-h-screen pt-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white">TV Shows</h1>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => switchView('trending')}
              className={`px-4 py-2 rounded-md font-semibold ${view === 'trending' ? 'bg-[#00C6B1] text-black' : 'bg-gray-800/50 text-white hover:bg-gray-700'} cursor-pointer`}>
              Trending
            </button>
            <button
              onClick={() => switchView('popular')}
              className={`px-4 py-2 rounded-md font-semibold ${view === 'popular' ? 'bg-[#00C6B1] text-black' : 'bg-gray-800/50 text-white hover:bg-gray-700'} cursor-pointer`}>
              Popular
            </button>
          </div>

          <div className="text-sm text-gray-300">Showing {currentItems.length} results</div>
        </div>

        <section>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {pageItems.map((t) => (
              <MovieCard key={t.id} item={t} type="tv" fullWidth />
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center space-x-3">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="px-3 py-1 rounded-md bg-gray-800/60 text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>

            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`px-3 py-1 rounded-md ${p === page ? 'bg-[#00C6B1] text-black' : 'bg-gray-800/60 text-white'} cursor-pointer`}>
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-md bg-gray-800/60 text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}