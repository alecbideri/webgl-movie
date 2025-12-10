import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { GridView } from './components/GridView';
import { Experience } from './components/Experience';
import { MovieDetails } from './components/MovieDetails';
import { useStore } from './store/useStore';

function App() {
  const { viewMode, fetchMovies } = useStore();

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary selection:text-white overflow-x-hidden">
      <Header />
      <MovieDetails />

      <main className="relative pt-16">
        {viewMode === 'GRID' ? (
          <GridView />
        ) : (
          <Experience />
        )}
      </main>

      {/* Pagination Controls */}
      {/* Show in both modes or just grid? Requirement says "pagination one page 50 tiles". 
          In WebGL mode, floating UI is better. */}

      <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 md:gap-4 z-40 bg-surface/80 backdrop-blur rounded-full px-4 py-2 md:px-6 md:py-3 border border-white/10 shadow-xl transition-transform duration-300 hover:scale-105">
        <button
          className="hover:text-primary transition-colors disabled:opacity-50 text-xs md:text-sm font-bold uppercase tracking-wider"
          onClick={() => useStore.getState().fetchMovies(-1)}
        >
          Prev
        </button>
        <span className="font-mono text-primary font-bold border-l border-r border-white/10 px-3 md:px-4 text-sm md:text-base">
          Page {useStore.getState().page}
        </span>
        <button
          className="hover:text-primary transition-colors disabled:opacity-50 text-xs md:text-sm font-bold uppercase tracking-wider"
          onClick={() => useStore.getState().fetchMovies(1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
