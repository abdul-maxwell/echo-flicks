// TMDB API Configuration and helper functions
const TMDB_API_KEY = "YOUR_TMDB_API_KEY"; // Users will need to add their own key
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export const TMDB_IMAGE_SIZES = {
  poster: {
    small: "w185",
    medium: "w342",
    large: "w500",
    original: "original",
  },
  backdrop: {
    small: "w300",
    medium: "w780",
    large: "w1280",
    original: "original",
  },
  profile: {
    small: "w45",
    medium: "w185",
    large: "h632",
    original: "original",
  },
};

export const getImageUrl = (path: string | null, size: string = "original") => {
  if (!path) return "/placeholder.svg";
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export const tmdbApi = {
  // Movies
  getTrending: (mediaType: "movie" | "tv" = "movie", timeWindow: "day" | "week" = "day") =>
    `${TMDB_BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${TMDB_API_KEY}`,
  
  getPopular: (mediaType: "movie" | "tv") =>
    `${TMDB_BASE_URL}/${mediaType}/popular?api_key=${TMDB_API_KEY}`,
  
  getTopRated: (mediaType: "movie" | "tv") =>
    `${TMDB_BASE_URL}/${mediaType}/top_rated?api_key=${TMDB_API_KEY}`,
  
  getNowPlaying: () =>
    `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}`,
  
  getUpcoming: () =>
    `${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}`,
  
  getAiringToday: () =>
    `${TMDB_BASE_URL}/tv/airing_today?api_key=${TMDB_API_KEY}`,
  
  getOnTheAir: () =>
    `${TMDB_BASE_URL}/tv/on_the_air?api_key=${TMDB_API_KEY}`,
  
  // Details
  getDetails: (mediaType: "movie" | "tv", id: number) =>
    `${TMDB_BASE_URL}/${mediaType}/${id}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits,similar,recommendations`,
  
  getSeasonDetails: (seriesId: number, seasonNumber: number) =>
    `${TMDB_BASE_URL}/tv/${seriesId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}`,
  
  getEpisodeDetails: (seriesId: number, seasonNumber: number, episodeNumber: number) =>
    `${TMDB_BASE_URL}/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}?api_key=${TMDB_API_KEY}`,
  
  // Search
  search: (query: string, mediaType?: "movie" | "tv" | "multi") =>
    `${TMDB_BASE_URL}/search/${mediaType || "multi"}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`,
  
  // Genres
  getGenres: (mediaType: "movie" | "tv") =>
    `${TMDB_BASE_URL}/genre/${mediaType}/list?api_key=${TMDB_API_KEY}`,
  
  // Discover
  discover: (mediaType: "movie" | "tv", params?: Record<string, string>) => {
    const queryParams = new URLSearchParams({
      api_key: TMDB_API_KEY,
      ...params,
    });
    return `${TMDB_BASE_URL}/discover/${mediaType}?${queryParams}`;
  },
};

export interface Movie {
  id: number;
  title: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  genre_ids: number[];
  media_type?: "movie" | "tv";
}

export interface MovieDetails extends Movie {
  runtime?: number;
  genres: { id: number; name: string }[];
  videos: {
    results: {
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
    }[];
  };
  credits: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
  };
  similar: {
    results: Movie[];
  };
  recommendations: {
    results: Movie[];
  };
  number_of_seasons?: number;
  number_of_episodes?: number;
  seasons?: Season[];
}

export interface Season {
  id: number;
  season_number: number;
  episode_count: number;
  name: string;
  overview: string;
  poster_path: string | null;
  air_date: string;
}

export interface Episode {
  id: number;
  episode_number: number;
  season_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  runtime: number;
  air_date: string;
}
