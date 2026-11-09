import React from 'react';
import { Lock, Unlock, Settings } from 'lucide-react';

interface ActionButtonsProps {
  isBlocked: boolean;
  onBlockClick: () => void;
  onCurrencyClick: () => void;
  onSettingsClick: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  isBlocked,
  onBlockClick,
  onCurrencyClick,
  onSettingsClick,
}) => {
  return (
    <div className="flex items-center justify-around px-6 py-4">
      {/* 1. Bloquer / Débloquer */}
      <button
        onClick={onBlockClick}
        type="button"
        className="flex flex-col items-center gap-2 group active:scale-95 transition-all"
      >
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-sm ${
            isBlocked
              ? 'bg-rose-100 text-rose-700 ring-2 ring-rose-400'
              : 'bg-[#E3E6FF] text-[#1E1F4B] group-hover:bg-[#d6daff]'
          }`}
        >
          {isBlocked ? (
            <Unlock className="w-6 h-6 stroke-[2.2]" />
          ) : (
            <div className="relative flex items-center justify-center">
              <Lock className="w-6 h-6 stroke-[2.2]" />
            </div>
          )}
        </div>
        <span
          className={`text-xs font-semibold ${
            isBlocked ? 'text-rose-600 font-bold' : 'text-zinc-800'
          }`}
        >
          {isBlocked ? 'Débloquer' : 'Bloquer'}
        </span>
      </button>

      {/* 2. Devise */}
      <button
        onClick={onCurrencyClick}
        type="button"
        className="flex flex-col items-center gap-2 group active:scale-95 transition-all"
      >
        <div className="w-14 h-14 rounded-full bg-[#E3E6FF] text-[#1E1F4B] group-hover:bg-[#d6daff] flex items-center justify-center transition-all shadow-sm">
          {/* Custom dual currency icon (€ and $) matching the screenshot */}
          <div className="flex items-center justify-center font-bold text-sm tracking-tighter">
            <span className="w-6 h-6 rounded-full bg-[#1E1F4B] text-white flex items-center justify-center text-xs -mr-1 z-10 border border-white">
              €
            </span>
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs -ml-1 border border-white">
              $
            </span>
          </div>
        </div>
        <span className="text-xs font-semibold text-zinc-800">Devise</span>
      </button>

      {/* 3. Paramètres */}
      <button
        onClick={onSettingsClick}
        type="button"
        className="flex flex-col items-center gap-2 group active:scale-95 transition-all"
      >
        <div className="w-14 h-14 rounded-full bg-[#E3E6FF] text-[#1E1F4B] group-hover:bg-[#d6daff] flex items-center justify-center transition-all shadow-sm">
          <Settings className="w-6 h-6 stroke-[2.2]" />
        </div>
        <span className="text-xs font-semibold text-zinc-800">Paramètres</span>
      </button>
    </div>
  );
};
