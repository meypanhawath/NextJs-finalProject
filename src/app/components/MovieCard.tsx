'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Movie, TVShow } from '@/types/tmdb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStar } from '@fortawesome/free-solid-svg-icons';

interface MovieCardProps {
  item: Movie | TVShow;
  type: 'movie' | 'tv';
  fullWidth?: boolean;
}

export default function MovieCard({ item, type, fullWidth = false }: MovieCardProps) {
  const isMovie = type === 'movie';
  const title = isMovie ? (item as Movie).title : (item as TVShow).name;
  const imageUrl = item.poster_path 
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : '/placeholder-poster.jpg';

  const releaseDate = isMovie 
    ? (item as Movie).release_date 
    : (item as TVShow).first_air_date;

  const href = isMovie ? `/movies/${item.id}` : `/tv-shows/${item.id}`;

  const sizeClass = fullWidth ? 'w-full' : 'w-48 md:w-56 flex-shrink-0';

  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.05, y: -10 }}
        className={`relative group ${sizeClass} cursor-pointer`}
      >
      <div className="relative rounded-lg overflow-hidden shadow-2xl">
        {/* Poster Image */}
        <div className="relative aspect-[2/3]">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-4 bg-[#00C6B1] rounded-full"
            >
              <FontAwesomeIcon icon={faPlay} className="w-6 h-6 text-white" />
            </motion.button>
          </div>
        </div>

        {/* Card Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1">
              <FontAwesomeIcon icon={faStar} className="w-4 h-4 text-yellow-400" />
              <span className="text-white font-semibold">
                {item.vote_average.toFixed(1)}
              </span>
            </div>
            <span className="text-xs text-gray-300">
              {releaseDate?.split('-')[0]}
            </span>
          </div>
          <h3 className="text-white font-semibold line-clamp-1">
            {title}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            {isMovie ? 'Movie' : 'TV Show'}
          </p>
        </div>
      </div>
      </motion.div>
    </Link>
  );
}