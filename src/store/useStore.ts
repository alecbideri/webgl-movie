import { create } from 'zustand';
import { tmdbApi } from '../services/tmdb';
import type { Movie } from '../services/tmdb';

type ViewMode = 'GRID' | 'WEBGL';

interface AppState {
  movies: Movie[];
  page: number;
  viewMode: ViewMode;
  loading: boolean;
  activeMovie: Movie | null;

  // Actions
  fetchMovies: (pageIncrement?: number) => Promise<void>;
  toggleViewMode: () => void;
  setPage: (page: number) => void;
  setActiveMovie: (movie: Movie | null) => void;
}

export const useStore = create<AppState>((set, get) => ({
  movies: [],
  page: 1,
  viewMode: 'GRID',
  loading: false,
  activeMovie: null,

  fetchMovies: async (pageIncrement?: number) => {
    const currentPage = get().page;
    const nextPage = pageIncrement ? currentPage + pageIncrement : currentPage;

    // Safety check, though pagination UI should handle this
    if (nextPage < 1) return;

    set({ loading: true });
    try {
      // Requirement: "pagination one page 50 tiles"
      // TMDB returns 20 items per page.
      // So "App Page n" corresponds to TMDB Pages (n*3 - 2), (n*3 - 1), (n*3)
      // Example: App Page 1 = TMDB 1, 2, 3. App Page 2 = TMDB 4, 5, 6.

      const startPage = (nextPage - 1) * 3 + 1;

      const [res1, res2, res3] = await Promise.all([
        tmdbApi.getPopularMovies(startPage),
        tmdbApi.getPopularMovies(startPage + 1),
        tmdbApi.getPopularMovies(startPage + 2),
      ]);

      // Combine results
      const allMovies = [...res1.results, ...res2.results, ...res3.results];

      // Filter unique movies just in case (TMDB sometimes duplicates across pages if list changes)
      const uniqueMoviesMap = new Map();
      allMovies.forEach(m => uniqueMoviesMap.set(m.id, m));
      const uniqueMovies = Array.from(uniqueMoviesMap.values()) as Movie[];

      // Slice to exactly 50 if strictly required, but having 60 is fine too. 
      // Let's stick to 50 as requested to fit the grid perfectly (10 cols x 5 rows).
      const finalMovies = uniqueMovies.slice(0, 50);

      set({ movies: finalMovies, page: nextPage, loading: false });
    } catch (error) {
      console.error("Failed to fetch movies", error);
      set({ loading: false });
    }
  },

  toggleViewMode: () => set((state) => ({
    viewMode: state.viewMode === 'GRID' ? 'WEBGL' : 'GRID'
  })),

  setPage: (page: number) => {
    set({ page });
    get().fetchMovies();
  },

  setActiveMovie: (movie) => set({ activeMovie: movie }),
}));
