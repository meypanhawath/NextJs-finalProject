const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL;

export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
}

export interface TMDBTVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
}

export interface TMDBResponse {
  page: number;
  results: (TMDBMovie | TMDBTVShow)[];
  total_pages: number;
  total_results: number;
}

export interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  release_date: string;
  runtime: number;
  vote_average: number;
  genres: Array<{ id: number; name: string }>;
  videos: {
    results: Array<{
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
    }>;
  };
  credits: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
  };
}

export interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  popularity: number;
  known_for?: Array<any>;
}

export interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  movie_credits?: any;
  tv_credits?: any;
}

const headers = {
  Authorization: ACCESS_TOKEN ? `Bearer ${ACCESS_TOKEN}` : undefined,
  'Content-Type': 'application/json',
};

async function fetchJson<T>(url: string): Promise<T> {
  if (!BASE_URL || !API_KEY) {
    throw new Error('Missing TMDB configuration. Ensure NEXT_PUBLIC_TMDB_BASE_URL and NEXT_PUBLIC_TMDB_API_KEY are set.');
  }

  const response = await fetch(url, { headers });

  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();

  if (!response.ok) {
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }
    throw new Error(`TMDB fetch failed (${response.status}): ${JSON.stringify(parsed)}`);
  }

  if (!contentType.includes('application/json')) {
    throw new Error(`Expected JSON response but received: ${text.slice(0, 300)}`);
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error(`Failed to parse JSON from TMDB response: ${err}\nResponse text: ${text.slice(0, 300)}`);
  }
}

export async function fetchTrendingMovies(): Promise<TMDBResponse> {
  return fetchJson(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
}

export async function fetchTrendingTVShows(): Promise<TMDBResponse> {
  return fetchJson(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}`);
}

export async function fetchPopularMovies(): Promise<TMDBResponse> {
  return fetchJson(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
}

export async function fetchPopularTVShows(): Promise<TMDBResponse> {
  return fetchJson(`${BASE_URL}/tv/popular?api_key=${API_KEY}`);
}

export async function fetchUpcomingMovies(): Promise<TMDBResponse> {
  return fetchJson(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}`);
}

export async function fetchMovieDetails(movieId: number): Promise<MovieDetails> {
  return fetchJson(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits`);
}

export async function fetchSimilarMovies(movieId: number): Promise<TMDBResponse> {
  return fetchJson(`${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}`);
}

export async function fetchTVShowDetails(tvId: number): Promise<any> {
  return fetchJson(`${BASE_URL}/tv/${tvId}?api_key=${API_KEY}&append_to_response=videos,credits`);
}

export async function searchMulti(query: string): Promise<TMDBResponse> {
  return fetchJson(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
}

export async function fetchPopularPeople(): Promise<{ page: number; results: Person[] }> {
  return fetchJson(`${BASE_URL}/person/popular?api_key=${API_KEY}`);
}

export async function fetchPersonDetails(personId: number): Promise<PersonDetails> {
  return fetchJson(`${BASE_URL}/person/${personId}?api_key=${API_KEY}&append_to_response=movie_credits,tv_credits`);
}

// Helper function to get full image URL
export function getImageUrl(path: string | null, size: string = 'original'): string {
  if (!path) return 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925';
  return `${IMAGE_BASE_URL}/${size}${path}`;
}