import React from 'react';
import { useStore } from '../store/useStore';
import { Layers, Cuboid } from 'lucide-react';

export const Header: React.FC = () => {
  const { viewMode, toggleViewMode } = useStore();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/10 h-16 flex items-center justify-between px-8">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg animate-pulse" />
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 font-sans tracking-tighter">
          KINETIC CINEMA
        </h1>
      </div>

      <button
        onClick={toggleViewMode}
        className="flex items-center gap-3 px-4 py-2 rounded-full bg-surface hover:bg-white/10 transition-all border border-white/5 active:scale-95 group"
      >
        <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
          {viewMode === 'GRID' ? 'Standard View' : 'WebGL Experience'}
        </span>
        <div className="relative w-12 h-6 bg-black/50 rounded-full p-1 transition-colors">
          <div
            className={`w-4 h-4 rounded-full bg-gradient-to-r from-primary to-secondary absolute top-1 transition-transform duration-300 ${viewMode === 'WEBGL' ? 'translate-x-6' : 'translate-x-0'
              }`}
          />
        </div>
        {viewMode === 'GRID' ? <Layers size={18} className="text-gray-400" /> : <Cuboid size={18} className="text-secondary" />}
      </button>
    </header>
  );
};
