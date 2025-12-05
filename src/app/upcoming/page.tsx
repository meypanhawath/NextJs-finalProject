'use client';

import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import { fetchUpcomingMovies } from '@/services/tmdb';
import { Movie } from '@/types/tmdb';

export default function UpcomingPage() {
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchUpcomingMovies();
        const normalize = (arr: any[] = []) =>
          arr
            .filter((r) => r && typeof r === 'object' && 'title' in r)
            .map((r) => ({
              id: r.id,
              title: r.title,
              original_title: r.original_title ?? r.title,
              overview: r.overview ?? '',
              poster_path: r.poster_path ?? null,
              backdrop_path: r.backdrop_path ?? null,
              release_date: r.release_date ?? r.first_air_date ?? '',
              vote_average: typeof r.vote_average === 'number' ? r.vote_average : 0,
              vote_count: typeof r.vote_count === 'number' ? r.vote_count : 0,
              popularity: typeof r.popularity === 'number' ? r.popularity : 0,
              genre_ids: Array.isArray(r.genre_ids) ? r.genre_ids : [],
              adult: typeof r.adult === 'boolean' ? r.adult : false,
            } as Movie));

        setUpcomingMovies(normalize(data.results || []));
      } catch (error) {
        console.error('Error loading upcoming movies:', error);
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
  const totalPages = Math.max(1, Math.ceil(upcomingMovies.length / PAGE_SIZE));
  const pageItems = upcomingMovies.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function goToPage(p: number) {
    setPage(Math.max(1, Math.min(totalPages, p)));
  }

  return (
    <div className="min-h-screen pt-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white">Upcoming Movies</h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {pageItems.map((m) => (
            <MovieCard key={m.id} item={m} type="movie" fullWidth />
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
      </div>
    </div>
  );
}