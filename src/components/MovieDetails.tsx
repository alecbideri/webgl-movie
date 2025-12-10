import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { tmdbApi } from '../services/tmdb';
import { X, Star, Calendar, Clock } from 'lucide-react';

export const MovieDetails: React.FC = () => {
  const { activeMovie, setActiveMovie } = useStore();

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveMovie(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [setActiveMovie]);

  if (!activeMovie) return null;

  return (
    <AnimatePresence>
      {activeMovie && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setActiveMovie(null)}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl bg-surface/90 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[85vh]"
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveMovie(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full hover:bg-white/20 transition-colors text-white"
            >
              <X size={20} />
            </button>

            {/* Poster Image */}
            <div className="w-full md:w-1/3 aspect-[2/3] md:aspect-auto relative">
              <img
                src={activeMovie.poster_path ? tmdbApi.getImageUrl(activeMovie.poster_path, 'original') : ''}
                alt={activeMovie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent md:bg-gradient-to-r" />
            </div>

            {/* Details */}
            <div className="flex-1 p-6 md:p-10 flex flex-col overflow-y-auto custom-scrollbar">
              <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-2">
                {activeMovie.title}
              </h2>

              <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-6 font-mono">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-primary" />
                  {activeMovie.release_date}
                </div>
                <div className="flex items-center gap-1.5">
                  <Star size={14} className="text-yellow-500" fill="currentColor" />
                  <span className="text-white">{activeMovie.vote_average.toFixed(1)}</span>
                  <span>({activeMovie.vote_count} votes)</span>
                </div>
              </div>

              <p className="text-gray-300 leading-relaxed text-lg mb-8">
                {activeMovie.overview}
              </p>

              {/* Placeholder for "whatever you can get on tmdb" - e.g. Genres could be added if we fetched details specifically. 
                  Currently using list data. */}

              <div className="mt-auto pt-6 border-t border-white/5 flex gap-4">
                <button className="flex-1 bg-primary hover:bg-red-700 text-white py-3 rounded-lg font-bold transition-colors shadow-lg shadow-primary/20">
                  Watch Trailer
                </button>
                <button className="px-6 py-3 border border-white/10 hover:bg-white/5 rounded-lg font-medium transition-colors">
                  Add to List
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
