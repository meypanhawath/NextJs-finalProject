import { notFound } from 'next/navigation';
import { fetchMovieDetails, fetchSimilarMovies, getImageUrl } from '@/services/tmdb';
import TrailerModal from '@/app/components/TrailerModal';
import WatchlistButton from '@/app/components/WatchlistButton';
import TrackRecent from '@/app/components/TrackRecent';
import MovieCard from '@/app/components/MovieCard';
import Link from 'next/link';
import DiscoverMovies from '@/app/components/DiscoverMovies';

export default async function MovieDetailPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const resolvedParams = (await params) as { id: string };
  const id = Number(resolvedParams.id);
  if (Number.isNaN(id)) return notFound();

  try {
    const data = await fetchMovieDetails(id);

    if (!data || !data.id) {
      return (
        <div className="min-h-screen pt-24 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Movie not found</h2>
            <p className="text-gray-400">We couldn't find the movie you're looking for.</p>
          </div>
        </div>
      );
    }

    const trailer = data.videos?.results?.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer');
    const similar = await fetchSimilarMovies(data.id).catch(() => null);
    const backdropUrl = data.backdrop_path ? getImageUrl(data.backdrop_path, 'original') : null;

    return (
      <div className="min-h-screen pt-24 relative bg-black">
        {/* Track recent views locally (client component) */}
        <TrackRecent id={data.id} title={data.title} poster_path={data.poster_path} />
        {/* Backdrop background (z-0) */}
        {backdropUrl && (
          <div
            className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(rgba(8,10,12,0.8), rgba(8,10,12,0.98)), url('${backdropUrl}')`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }}
          />
        )}

        <div className="container mx-auto px-2 sm:px-4 relative z-10">
          {/* Grid: single column on mobile, 3 cols from md */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Poster */}
            <div className="md:col-span-1 flex justify-center md:justify-start">
              <img
                src={data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : '/placeholder-poster.jpg'}
                alt={data.title}
                className="rounded-lg shadow-xl mb-4 md:mb-0
                           /* Mobile: larger cover */
                           w-64 sm:w-72 md:w-full
                           max-w-[300px] sm:max-w-[320px] md:max-w-none
                           object-cover"
                aria-hidden={false}
              />
            </div>

            {/* Details */}
            <div className="md:col-span-2 text-white">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 leading-tight">{data.title}</h1>
              <p className="text-gray-300 mb-3 text-sm sm:text-base">{data.tagline}</p>

              {/* Buttons: stacked on mobile, inline from sm */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
                <div className="w-full sm:w-auto">
                  <WatchlistButton movieId={data.id} title={data.title} />
                </div>

                <Link
                  href={`https://www.google.com/search?q=${encodeURIComponent(data.title + ' trailer')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-4 py-2 rounded-md bg-gray-700/70 text-white text-center"
                  aria-label={`Search trailer for ${data.title}`}
                >
                  Search Trailer
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base mb-4">
                <span className="font-semibold">Rating:</span>
                <span>{data.vote_average.toFixed(1)} / 10</span>
                <span className="text-gray-400">·</span>
                <span>{data.release_date}</span>
                <span className="text-gray-400 hidden sm:inline">·</span>
                <span className="hidden sm:inline">{data.runtime} mins</span>
                {/* On very small screens show runtime on next line to avoid wrapping chaos */}
                <span className="sm:hidden text-gray-400 block">{data.runtime} mins</span>
              </div>

              <p className="text-gray-200 mb-5 text-sm sm:text-base">{data.overview}</p>

              <div className="mb-5">
                <h3 className="font-semibold mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {data.genres?.map((g) => (
                    <span key={g.id} className="px-3 py-1 bg-gray-800/60 rounded-full text-xs sm:text-sm">{g.name}</span>
                  ))}
                </div>
              </div>

              {trailer && trailer.key && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Trailer</h3>
                  <TrailerModal trailerKey={trailer.key} />
                </div>
              )}

              {/* Cast */}
              {data.credits?.cast?.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Top Cast</h3>

                  {/* Mobile: cleaner layout — larger avatars, better spacing, snap-start for predictability */}
                  <div
                    className="flex gap-4 sm:gap-3 overflow-x-auto py-2 px-2 sm:px-0 snap-x snap-mandatory"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                    role="list"
                    aria-label="Top cast members"
                  >
                    {data.credits.cast.slice(0, 20).map((c: any) => (
                      <div
                        key={c.id}
                        className="flex-shrink-0 w-28 sm:w-28 text-center text-white snap-start"
                        role="listitem"
                      >
                        <Link href={`/people/${c.id}`} className="block">
                          <img
                            src={getImageUrl(c.profile_path, 'w185')}
                            alt={c.name}
                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full mx-auto mb-2 border-2 border-transparent hover:border-[#00C6B1] transition"
                          />
                          <div className="text-xs sm:text-sm font-medium truncate">{c.name}</div>
                          <div className="text-[11px] sm:text-xs text-gray-400 truncate">{c.character}</div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Similar Movies */}
          {(Array.isArray(similar?.results) && similar.results.length > 0) && (
            <div className="mt-8 sm:mt-10">
              <h3 className="text-white text-xl sm:text-2xl font-semibold mb-3">Similar Movies</h3>

              {/* Mobile: increased gap (gap-6) to give breathing room; smaller gap on sm+ to keep previous feel */}
              <div className="flex gap-6 sm:gap-4 overflow-x-auto py-2 px-2 sm:px-0 snap-x snap-mandatory">
                {similar.results.slice(0, 12).map((m: any) => (
                  <div key={m.id} className="flex-shrink-0 w-36 sm:w-40 md:w-56 snap-center">
                    <MovieCard item={m} type="movie" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Discover by genre (client-side with pagination) */}
          <div className="mt-8 sm:mt-10">
            <h3 className="text-white text-xl sm:text-2xl font-semibold mb-4">Discover</h3>
            <div>
              <DiscoverMovies genres={(data.genres || []).map((g) => g.id)} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (err) {
    console.error('Error fetching movie details', err);
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Unable to load movie</h2>
          <p className="text-gray-400">There was a problem loading movie details. Please try again later.</p>
          <pre className="text-xs text-gray-500 mt-4">{String(err)}</pre>
        </div>
      </div>
    );
  }
}
