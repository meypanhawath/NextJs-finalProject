'use client';

import { useState } from 'react';

type Props = {
  trailerKey?: string | null;
};

export default function TrailerModal({ trailerKey }: Props) {
  const [open, setOpen] = useState(false);

  if (!trailerKey) return null;

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-[#00C6B1] text-black rounded-md font-semibold cursor-pointer"
      >
        Watch Trailer
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="relative w-[90%] max-w-4xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute -top-6 -right-6 bg-gray-800 text-white rounded-full p-2 cursor-pointer"
              aria-label="Close trailer"
            >
              ✕
            </button>
            <div className="aspect-video bg-black rounded-md overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                title="Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
