import axios from 'axios';

const TMDB_API_URL = 'https://api.themoviedb.org/3';
// Note: In a production app, this should be in an env variable. 
// For this environment, we are using the provided token directly.
const TMDB_READ_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiOWFiNWI3NDI0ZGRiZWQ4NDNkN2RmNWE1NGYxMWRjZCIsIm5iZiI6MTczOTg5ODU4Ny4wNjcwMDAyLCJzdWIiOiI2N2I0YmVkYjViOGM3ODllODQ5ZmUxMDIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.YzeM-VXa0Wz97eHXj1fvw1Q2xEVEANwNs0Di3LZTlng';

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
}

interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

const tmdbClient = axios.create({
  baseURL: TMDB_API_URL,
  headers: {
    Authorization: `Bearer ${TMDB_READ_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export const tmdbApi = {
  getPopularMovies: async (page: number = 1): Promise<TMDBResponse<Movie>> => {
    const response = await tmdbClient.get<TMDBResponse<Movie>>(`/movie/popular`, {
      params: { page },
    });
    return response.data;
  },

  getTopRatedMovies: async (page: number = 1): Promise<TMDBResponse<Movie>> => {
    const response = await tmdbClient.get<TMDBResponse<Movie>>(`/movie/top_rated`, {
      params: { page },
    });
    return response.data;
  },

  getMovie: async (id: number): Promise<Movie> => {
    const response = await tmdbClient.get<Movie>(`/movie/${id}`);
    return response.data;
  },

  getImageUrl: (path: string, size: 'w500' | 'original' = 'w500') => {
    return `/tmdb-image/t/p/${size}${path}`;
  }
};
