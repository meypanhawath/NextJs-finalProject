'use client';

import { motion } from 'framer-motion';
import MovieCard from './MovieCard';
import { Movie, TVShow } from '@/types/tmdb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface MovieRowProps {
  title: string;
  movies: Movie[] | TVShow[];
  type: 'movie' | 'tv';
}

export default function MovieRow({ title, movies, type }: MovieRowProps) {
  const scrollLeft = () => {
    const container = document.getElementById(`row-${title}`);
    if (container) {
      container.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById(`row-${title}`);
    if (container) {
      container.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="px-4 md:px-8 lg:px-16">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
        <div className="flex space-x-2">
          <button
            onClick={scrollLeft}
            className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700 transition-colors"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
          </button>
          <button
            onClick={scrollRight}
            className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700 transition-colors"
          >
            <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          id={`row-${title}`}
          className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth py-4"
        >
          {movies.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <MovieCard item={item} type={type} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}