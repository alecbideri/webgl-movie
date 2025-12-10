import React from 'react';
import { motion } from 'framer-motion';
import { type Movie, tmdbApi } from '../services/tmdb';
import { Star } from 'lucide-react';
import { useStore } from '../store/useStore';

interface Props {
  movie: Movie;
  index: number;
}

export const MovieCard2D: React.FC<Props> = ({ movie, index }) => {
  const setActiveMovie = useStore((state) => state.setActiveMovie);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="relative aspect-[2/3] group cursor-pointer"
      onClick={() => setActiveMovie(movie)}
    >
      <div className="absolute inset-0 rounded-xl overflow-hidden bg-surface border border-white/5 group-hover:border-primary/50 transition-colors shadow-lg group-hover:shadow-primary/20">
        <img
          src={movie.poster_path ? tmdbApi.getImageUrl(movie.poster_path) : 'https://via.placeholder.com/500x750?text=No+Poster'}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform">
          <h3 className="text-white font-bold text-lg leading-tight truncate">{movie.title}</h3>
          <div className="flex items-center gap-2 mt-1 text-yellow-500">
            <Star size={14} fill="currentColor" />
            <span className="text-sm font-medium">{movie.vote_average.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({movie.vote_count})</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
