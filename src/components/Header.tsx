import React from 'react';
import { X, Headphones, Wifi, BatteryMedium, Signal } from 'lucide-react';

interface HeaderProps {
  onOpenHelp: () => void;
  onClose?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenHelp, onClose }) => {
  return (
    <header className="relative w-full bg-[#1A1C20] text-white pt-2 pb-6 px-4 select-none">
      {/* Native-like Mobile Status Bar */}
      <div className="flex items-center justify-between text-xs text-zinc-300 font-medium px-2 mb-3">
        <span className="tracking-tight text-sm font-semibold">9:30</span>
        <div className="flex items-center gap-2">
          <Signal className="w-3.5 h-3.5 fill-current" />
          <Wifi className="w-3.5 h-3.5" />
          <BatteryMedium className="w-4 h-4" />
        </div>
      </div>

      {/* Navigation and Support Bar */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={onClose}
          type="button"
          aria-label="Fermer"
          className="w-9 h-9 flex items-center justify-center rounded-full text-zinc-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        <button
          onClick={onOpenHelp}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-indigo-200 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
        >
          <Headphones className="w-4 h-4 text-indigo-300" />
          <span>Besoin d'aide ?</span>
        </button>
      </div>
    </header>
  );
};
