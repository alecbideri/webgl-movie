import React from 'react';
import { useStore } from '../store/useStore';
import { MovieCard2D } from './MovieCard2D';

export const GridView: React.FC = () => {
  const { movies, loading } = useStore();

  if (loading && movies.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-white">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pt-24 pb-12 px-8 max-w-[1920px] mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {movies.map((movie, index) => (
          <MovieCard2D key={`${movie.id}-${index}`} movie={movie} index={index} />
        ))}
      </div>

      {loading && (
        <div className="w-full py-8 flex justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      )}
    </div>
  );
};
