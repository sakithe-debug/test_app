import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Unlock, Copy, Check, ShieldCheck } from 'lucide-react';
import { CardDetails } from '../types/card';

interface DjamoCardProps {
  card: CardDetails;
  onQuickToggleBlock: () => void;
  onOpenSettings: () => void;
}

export const DjamoCard: React.FC<DjamoCardProps> = ({
  card,
  onQuickToggleBlock,
  onOpenSettings,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(text.replace(/\s+/g, ''));
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="w-full px-4 pt-3 pb-2 flex flex-col items-center">
      {/* Container with 3D perspective for card flip and relative positioning for eye button */}
      <div className="relative w-full max-w-[340px] aspect-[1.586] select-none perspective-[1000px]">
        {/* Floating Eye Button on the right edge (exactly as in the screenshot) */}
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          type="button"
          title={isFlipped ? 'Voir le recto' : 'Voir les numéros et CVV'}
          className={`absolute -right-3 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90 ${
            isFlipped
              ? 'bg-indigo-600 text-white shadow-indigo-500/40'
              : 'bg-[#DCDFFD] hover:bg-[#CFD3FD] text-[#1E1F4B] shadow-indigo-900/10'
          }`}
        >
          {isFlipped ? (
            <EyeOff className="w-5 h-5 stroke-[2.5]" />
          ) : (
            <Eye className="w-5 h-5 stroke-[2.2]" />
          )}
        </button>

        {/* The Card with Flip Transition */}
        <div
          className={`relative w-full h-full rounded-2xl overflow-hidden transition-transform duration-700 [transform-style:preserve-3d] shadow-md border border-black/5 ${
            isFlipped ? '[transform:rotateY(180deg)]' : ''
          }`}
        >
          {/* FRONT OF CARD */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-2xl overflow-hidden bg-gradient-to-br from-amber-600 to-amber-800">
            {/* Background Image: Cropped authentic graphic */}
            <img
              src="/assets/djamo_card.png"
              alt="Carte Djamo Les Éléphants"
              className={`w-full h-full object-cover transition-all duration-300 ${
                card.isBlocked ? 'filter grayscale contrast-125' : ''
              }`}
            />

            {/* Subtle Gradient protection */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

            {/* Blocked Frosted Glass Overlay */}
            {card.isBlocked && (
              <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-4 text-white animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400 mb-2 shadow-inner">
                  <Lock className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-300 bg-rose-950/80 px-3 py-1 rounded-full border border-rose-800/60 mb-2">
                  Carte Verrouillée
                </span>
                <p className="text-[11px] text-zinc-300 text-center max-w-[220px] mb-3 leading-tight">
                  Toutes les transactions en magasin et en ligne sont désactivées.
                </p>
                <button
                  onClick={onQuickToggleBlock}
                  type="button"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md active:scale-95 transition-all"
                >
                  <Unlock className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Débloquer la carte</span>
                </button>
              </div>
            )}
          </div>

          {/* BACK OF CARD (Flipped Details) */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950 text-white p-4 flex flex-col justify-between shadow-2xl border border-zinc-700">
            {/* Magnetic Stripe */}
            <div className="-mx-4 -mt-4 h-9 bg-black border-b border-zinc-800" />

            {/* Card Information & CVV */}
            <div className="space-y-3 pt-1">
              {/* Full Number */}
              <div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-400 block font-medium">
                  Numéro de carte
                </span>
                <div className="flex items-center justify-between mt-0.5 bg-black/40 px-2.5 py-1.5 rounded-lg border border-zinc-700/60">
                  <span className="font-mono text-sm tracking-widest font-bold text-zinc-100">
                    {card.cardNumber}
                  </span>
                  <button
                    onClick={(e) => handleCopy(card.cardNumber, 'number', e)}
                    className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/10"
                    title="Copier le numéro"
                  >
                    {copiedField === 'number' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expiry & CVV */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-black/40 px-2.5 py-1.5 rounded-lg border border-zinc-700/60">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-400 block font-medium">
                    Expire fin
                  </span>
                  <span className="font-mono text-xs font-bold text-zinc-100">
                    {card.expiryDate}
                  </span>
                </div>

                <div className="bg-black/40 px-2.5 py-1.5 rounded-lg border border-zinc-700/60 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-zinc-400 block font-medium">
                      CVV / CVC
                    </span>
                    <span className="font-mono text-xs font-bold text-amber-300">
                      {card.cvv}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleCopy(card.cvv, 'cvv', e)}
                    className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/10"
                    title="Copier le CVV"
                  >
                    {copiedField === 'cvv' ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom info */}
            <div className="flex items-center justify-between text-[10px] text-zinc-400 border-t border-zinc-800 pt-1.5">
              <div className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="text-[10px] font-semibold text-zinc-300">3D Secure actif</span>
              </div>
              <button
                onClick={onOpenSettings}
                className="text-indigo-400 font-semibold hover:underline"
              >
                Paramètres &rsaquo;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel dots below the card */}
      <div className="flex items-center justify-center gap-1.5 mt-2.5">
        <span className="w-7 h-1.5 bg-zinc-900 rounded-full transition-all" />
        <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full transition-all" />
      </div>
    </div>
  );
};
