import { notFound } from 'next/navigation';
import { fetchPersonDetails } from '@/services/tmdb';

export default async function PersonDetailPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const resolvedParams = (await params) as { id: string };
  const id = Number(resolvedParams.id);
  if (Number.isNaN(id)) return notFound();

  try {
    const data = await fetchPersonDetails(id);
    if (!data || !data.id) return notFound();

    return (
      <div className="min-h-screen pt-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <img src={data.profile_path ? `https://image.tmdb.org/t/p/w500${data.profile_path}` : '/person-placeholder.jpg'} alt={data.name} className="w-full rounded-lg shadow-xl" />
            </div>

            <div className="md:col-span-2 text-white">
              <h1 className="text-4xl font-bold mb-2">{data.name}</h1>
              <div className="text-gray-300 mb-4">
                {data.birthday && <span>{data.birthday}</span>}
                {data.place_of_birth && <span className="ml-3">· {data.place_of_birth}</span>}
              </div>

              <p className="text-gray-200 mb-6">{data.biography || 'No biography available.'}</p>

              <div>
                <h3 className="font-semibold mb-2">Known For</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
                  {(data.movie_credits?.cast || []).slice(0,6).map((c:any)=> (
                    <div key={c.id} className="text-white">
                      <img src={c.poster_path ? `https://image.tmdb.org/t/p/w300${c.poster_path}` : '/placeholder-poster.jpg'} alt={c.title || c.name} className="w-full rounded-md mb-2" />
                      <div className="text-sm">{c.title || c.name}</div>
                    </div>
                  ))}

                  {(data.tv_credits?.cast || []).slice(0,6).map((c:any)=> (
                    <div key={c.id} className="text-white">
                      <img src={c.poster_path ? `https://image.tmdb.org/t/p/w300${c.poster_path}` : '/placeholder-poster.jpg'} alt={c.title || c.name} className="w-full rounded-md mb-2" />
                      <div className="text-sm">{c.title || c.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (err) {
    console.error('Error fetching person details', err);
    return notFound();
  }
}
