'use client';

import Link from 'next/link';

interface PersonCardProps {
  person: {
    id: number;
    name: string;
    profile_path: string | null;
  };
}

export default function PersonCard({ person }: PersonCardProps) {
  const imageUrl = person.profile_path
    ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
    : '/person-placeholder.jpg';

  return (
    <Link href={`/people/${person.id}`}>
      <div className="cursor-pointer group">
        <div className="rounded-lg overflow-hidden shadow-lg">
          <div className="relative aspect-[2/3] bg-gray-800">
            <img src={imageUrl} alt={person.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-3">
            <h3 className="text-white font-semibold line-clamp-1">{person.name}</h3>
          </div>
        </div>
      </div>
    </Link>
  );
}
