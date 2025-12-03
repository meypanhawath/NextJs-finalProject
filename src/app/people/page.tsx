'use client';

import { useEffect, useState } from 'react';
import { fetchPopularPeople } from '@/services/tmdb';
import PersonCard from '@/app/components/PersonCard';

export default function PeoplePage() {
  const [people, setPeople] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchPopularPeople();
        setPeople(data.results || []);
      } catch (err) {
        console.error('Error loading people', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#00C6B1]"></div>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(people.length / PAGE_SIZE));
  const pageItems = people.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function goToPage(p: number) {
    setPage(Math.max(1, Math.min(totalPages, p)));
  }

  return (
    <div className="min-h-screen pt-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white">People</h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {pageItems.map((p) => (
            <PersonCard key={p.id} person={p} />
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center space-x-3">
          <button onClick={() => goToPage(page - 1)} disabled={page === 1} className="px-3 py-1 rounded-md bg-gray-800/60 text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">Previous</button>

          <div className="flex items-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => goToPage(p)} className={`px-3 py-1 rounded-md ${p === page ? 'bg-[#00C6B1] text-black' : 'bg-gray-800/60 text-white'} cursor-pointer`}>{p}</button>
            ))}
          </div>

          <button onClick={() => goToPage(page + 1)} disabled={page === totalPages} className="px-3 py-1 rounded-md bg-gray-800/60 text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">Next</button>
        </div>
      </div>
    </div>
  );
}
