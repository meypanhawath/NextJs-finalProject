'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HeroSection from './components/HeroSection';
import MovieRow from './components/MovieRow';
import { fetchTrendingMovies, fetchTrendingTVShows, fetchPopularMovies, fetchPopularTVShows, fetchUpcomingMovies } from '@/services/tmdb';
import { Movie, TVShow } from '@/types/tmdb';

export default function Home() {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [trendingTVShows, setTrendingTVShows] = useState<TVShow[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [popularTVShows, setPopularTVShows] = useState<TVShow[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [backgroundMovie, setBackgroundMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [
          trendingMoviesData,
          trendingTVShowsData,
          popularMoviesData,
          popularTVShowsData,
          upcomingMoviesData
        ] = await Promise.all([
          fetchTrendingMovies(),
          fetchTrendingTVShows(),
          fetchPopularMovies(),
          fetchPopularTVShows(),
          fetchUpcomingMovies()
        ]);

        setTrendingMovies(trendingMoviesData.results || []);
        setTrendingTVShows(trendingTVShowsData.results || []);
        setPopularMovies(popularMoviesData.results || []);
        setPopularTVShows(popularTVShowsData.results || []);
        setUpcomingMovies(upcomingMoviesData.results || []);

        // Set a random movie for the background
        if (trendingMoviesData.results?.length > 0) {
          const randomIndex = Math.floor(Math.random() * trendingMoviesData.results.length);
          setBackgroundMovie(trendingMoviesData.results[randomIndex]);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#00C6B1]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Dynamic Background with Gradient Overlay */}
      {backgroundMovie && (
        <div className="fixed inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${backgroundMovie.backdrop_path})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        <HeroSection featuredContent={backgroundMovie || trendingMovies[0]} />
        
        <div className="space-y-12 py-8">
          <MovieRow 
            title="Trending Movies" 
            movies={trendingMovies} 
            type="movie"
          />
          
          <MovieRow 
            title="Trending TV Shows" 
            movies={trendingTVShows} 
            type="tv"
          />
          
          <MovieRow 
            title="Popular Movies" 
            movies={popularMovies} 
            type="movie"
          />
          
          <MovieRow 
            title="Popular TV Shows" 
            movies={popularTVShows} 
            type="tv"
          />
          
          <MovieRow 
            title="Upcoming Movies" 
            movies={upcomingMovies} 
            type="movie"
          />
        </div>
      </div>
    </div>
  );
}