'use client';

import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import { fetchPopularMovies, fetchTrendingMovies } from '@/services/tmdb';
import { Movie } from '@/types/tmdb';

export default function MoviesPage() {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'trending' | 'popular'>('trending');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  useEffect(() => {
    async function loadData() {
      try {
        const [trendingData, popularData] = await Promise.all([
          fetchTrendingMovies(),
          fetchPopularMovies()
        ]);
        
        setTrendingMovies(trendingData.results || []);
        setPopularMovies(popularData.results || []);
      } catch (error) {
        console.error('Error loading movies:', error);
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

  const currentItems = view === 'trending' ? trendingMovies : popularMovies;
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
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white">Movies</h1>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => switchView('trending')}
              className={`px-4 py-2 rounded-md font-semibold ${view === 'trending' ? 'bg-[#00C6B1] text-black' : 'bg-gray-800/50 text-white hover:bg-gray-700'}`}>
              Trending
            </button>
            <button
              onClick={() => switchView('popular')}
              className={`px-4 py-2 rounded-md font-semibold ${view === 'popular' ? 'bg-[#00C6B1] text-black' : 'bg-gray-800/50 text-white hover:bg-gray-700'}`}>
              Popular
            </button>
          </div>

          <div className="text-sm text-gray-300">Showing {currentItems.length} results</div>
        </div>

        <section>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {pageItems.map((m) => (
              <MovieCard key={m.id} item={m} type="movie" fullWidth />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center space-x-3">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="px-3 py-1 rounded-md bg-gray-800/60 text-white disabled:opacity-50"
            >
              Previous
            </button>

            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`px-3 py-1 rounded-md ${p === page ? 'bg-[#00C6B1] text-black' : 'bg-gray-800/60 text-white'}`}>
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-md bg-gray-800/60 text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}