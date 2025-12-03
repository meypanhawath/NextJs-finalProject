import { searchMulti, searchMovies } from '@/services/tmdb';
import MovieCard from '@/app/components/MovieCard';
import PersonCard from '@/app/components/PersonCard';
import Link from 'next/link';

export default async function SearchPage({ searchParams }: { searchParams?: { q?: string } | Promise<{ q?: string }> }) {
  const resolved = (await searchParams) as { q?: string } | undefined;
  const q = (resolved?.q || '').trim();

  if (!q) {
    return (
      <div className="min-h-screen pt-24">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl text-white font-bold mb-4">Search</h1>
          <p className="text-gray-400">Type a query in the search bar (top-right) to find movies, TV shows, and people.</p>
        </div>
      </div>
    );
  }

  try {
    // Prioritize direct movie title matches, then include other media types
    const [movieData, multiData] = await Promise.allSettled([searchMovies(q), searchMulti(q)]);

    const movieResults: any[] = movieData.status === 'fulfilled' ? (movieData.value.results || []) : [];
    const multiResults: any[] = multiData.status === 'fulfilled' ? (multiData.value.results || []) : [];

    // Filter multiResults to exclude movies already in movieResults (by id)
    const movieIds = new Set(movieResults.map((m) => m.id));
    const otherResults = multiResults.filter((r: any) => r.media_type !== 'movie' || !movieIds.has(r.id));

    const results = [...movieResults, ...otherResults];

    return (
      <div className="min-h-screen pt-24">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl text-white font-bold mb-4">Search results for "{q}"</h1>

          {results.length === 0 && <p className="text-gray-400">No results found.</p>}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {results.map((r: any) => {
              // TMDB multi-search returns media_type; search/movie results won't have media_type
              if (r.media_type === 'person') {
                return <PersonCard key={`p-${r.id}`} person={r} />;
              }

              if (r.media_type === 'tv') {
                return <MovieCard key={`tv-${r.id}`} item={r} type="tv" fullWidth />;
              }

              // movie results from search/movie may not include media_type, treat as movie
              return <MovieCard key={`m-${r.id}`} item={r} type="movie" fullWidth />;
            })}
          </div>
        </div>
      </div>
    );
  } catch (err) {
    console.error('Search error', err);
    return (
      <div className="min-h-screen pt-24">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl text-white font-bold mb-4">Search</h1>
          <p className="text-gray-400">There was a problem searching. Please try again.</p>
        </div>
      </div>
    );
  }
}
