'use client';

import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Movie, TVShow } from '@/types/tmdb';

interface HeroSectionProps {
  featuredContent: Movie | TVShow;
}

export default function HeroSection({ featuredContent }: HeroSectionProps) {
  const isMovie = 'title' in featuredContent;
  const title = isMovie ? featuredContent.title : featuredContent.name;
  const description = featuredContent.overview;
  const releaseDate = isMovie ? featuredContent.release_date : featuredContent.first_air_date;
  const rating = featuredContent.vote_average;

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = rating % 2 >= 1;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else {
        stars.push(<span key={i} className="text-gray-400">★</span>);
      }
    }
    return stars;
  };

  return (
    <section className="relative h-[80vh] flex items-center px-4 md:px-8 lg:px-16">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl z-20"
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-white">
          {title}
        </h1>
        
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex space-x-1">
            {renderStars(rating)}
          </div>
          <span className="text-gray-300">{rating.toFixed(1)}/10</span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-300">{releaseDate?.split('-')[0]}</span>
          <span className="text-gray-300">•</span>
          <span className="px-2 py-1 bg-gray-800/50 rounded text-sm">
            {isMovie ? 'Movie' : 'TV Show'}
          </span>
        </div>

        <p className="text-gray-300 text-lg mb-8 line-clamp-3">
          {description}
        </p>

        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-white text-black rounded-lg font-semibold flex items-center space-x-2 hover:bg-gray-200 transition-colors"
          >
            <FontAwesomeIcon icon={faPlay} />
            <span>Play</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gray-700/70 text-white rounded-lg font-semibold flex items-center space-x-2 hover:bg-gray-700 transition-colors"
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            <span>More Info</span>
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}