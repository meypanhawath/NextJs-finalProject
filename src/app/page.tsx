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

        // Normalize API results to our `Movie` / `TVShow` shapes
        const normalizeMovies = (arr: any[] = []) =>
          arr
            .filter((r) => r && typeof r === 'object' && 'title' in r)
            .map((r) => ({
              id: r.id,
              title: r.title,
              original_title: r.original_title ?? r.title,
              overview: r.overview ?? '',
              poster_path: r.poster_path ?? null,
              backdrop_path: r.backdrop_path ?? null,
              release_date: r.release_date ?? r.first_air_date ?? '',
              vote_average: typeof r.vote_average === 'number' ? r.vote_average : 0,
              vote_count: typeof r.vote_count === 'number' ? r.vote_count : 0,
              popularity: typeof r.popularity === 'number' ? r.popularity : 0,
              genre_ids: Array.isArray(r.genre_ids) ? r.genre_ids : [],
              adult: typeof r.adult === 'boolean' ? r.adult : false,
            } as Movie));

        const normalizeTV = (arr: any[] = []) =>
          arr
            .filter((r) => r && typeof r === 'object' && 'name' in r)
            .map((r) => ({
              id: r.id,
              name: r.name,
              original_name: r.original_name ?? r.name,
              overview: r.overview ?? '',
              poster_path: r.poster_path ?? null,
              backdrop_path: r.backdrop_path ?? null,
              first_air_date: r.first_air_date ?? r.release_date ?? '',
              vote_average: typeof r.vote_average === 'number' ? r.vote_average : 0,
              vote_count: typeof r.vote_count === 'number' ? r.vote_count : 0,
              popularity: typeof r.popularity === 'number' ? r.popularity : 0,
              genre_ids: Array.isArray(r.genre_ids) ? r.genre_ids : [],
              origin_country: Array.isArray(r.origin_country) ? r.origin_country : [],
            } as TVShow));

        const normalizedTrendingMovies = normalizeMovies(trendingMoviesData.results || []);
        const normalizedTrendingTV = normalizeTV(trendingTVShowsData.results || []);
        const normalizedPopularMovies = normalizeMovies(popularMoviesData.results || []);
        const normalizedPopularTV = normalizeTV(popularTVShowsData.results || []);
        const normalizedUpcoming = normalizeMovies(upcomingMoviesData.results || []);

        setTrendingMovies(normalizedTrendingMovies);
        setTrendingTVShows(normalizedTrendingTV);
        setPopularMovies(normalizedPopularMovies);
        setPopularTVShows(normalizedPopularTV);
        setUpcomingMovies(normalizedUpcoming);

        // Set a random movie for the background from normalized movies
        if (normalizedTrendingMovies.length > 0) {
          const randomIndex = Math.floor(Math.random() * normalizedTrendingMovies.length);
          setBackgroundMovie(normalizedTrendingMovies[randomIndex]);
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