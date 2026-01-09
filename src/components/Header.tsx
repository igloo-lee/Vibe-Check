import React from 'react';
import { Menu, Bell, Heart } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-md border-b border-neutral-900">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/20">
          <Heart size={16} fill="currentColor" />
        </div>
        <span className="font-bold text-lg tracking-tight">Vibe Check</span>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-neutral-900 rounded-full transition-colors">
          <Bell size={20} />
        </button>
        <button className="p-2 hover:bg-neutral-900 rounded-full transition-colors">
          <Menu size={20} />
        </button>
      </div>
    </header>
  );
};