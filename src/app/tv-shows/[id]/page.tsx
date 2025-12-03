import { notFound } from 'next/navigation';
import { fetchTVShowDetails } from '@/services/tmdb';
import { TVShowDetails } from '@/types/tmdb';
import TrailerModal from '@/app/components/TrailerModal';

export default async function TVShowDetailPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const resolvedParams = (await params) as { id: string };
  const id = Number(resolvedParams.id);
  if (Number.isNaN(id)) return notFound();

  try {
    const data: TVShowDetails = await fetchTVShowDetails(id);

    if (!data || !data.id) {
      return (
        <div className="min-h-screen pt-24 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">TV show not found</h2>
            <p className="text-gray-400">We couldn't find the TV show you're looking for.</p>
          </div>
        </div>
      );
    }

    const trailer = data.videos?.results?.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer');

    return (
      <div className="min-h-screen pt-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <img
                src={data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : '/placeholder-poster.jpg'}
                alt={data.name}
                className="w-full rounded-lg shadow-xl"
              />
            </div>

            <div className="md:col-span-2 text-white">
              <h1 className="text-4xl font-bold mb-2">{data.name}</h1>
              <p className="text-gray-300 mb-4">{data.tagline}</p>
              <div className="flex items-center space-x-4 mb-4">
                <span className="font-semibold">Rating:</span>
                <span>{data.vote_average.toFixed(1)} / 10</span>
                <span className="text-gray-400">·</span>
                <span>{data.first_air_date}</span>
                <span className="text-gray-400">·</span>
                <span>{data.number_of_seasons} seasons</span>
              </div>

              <p className="text-gray-200 mb-6">{data.overview}</p>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {data.genres?.map((g) => (
                    <span key={g.id} className="px-3 py-1 bg-gray-800/60 rounded-full text-sm">{g.name}</span>
                  ))}
                </div>
              </div>

              {trailer && trailer.key && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Trailer</h3>
                  <TrailerModal trailerKey={trailer.key} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (err) {
    console.error('Error fetching tv show details', err);
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Unable to load TV show</h2>
          <p className="text-gray-400">There was a problem loading TV show details. Please try again later.</p>
          <pre className="text-xs text-gray-500 mt-4">{String(err)}</pre>
        </div>
      </div>
    );
  }
}
