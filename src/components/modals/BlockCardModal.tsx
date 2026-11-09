import React, { useState } from 'react';
import { X, Lock, Unlock, AlertTriangle, Shield, CheckCircle2 } from 'lucide-react';
import { CardDetails } from '../../types/card';

interface BlockCardModalProps {
  card: CardDetails;
  isOpen: boolean;
  onClose: () => void;
  onToggleBlock: (reason?: 'temporary' | 'lost' | 'stolen') => void;
}

export const BlockCardModal: React.FC<BlockCardModalProps> = ({
  card,
  isOpen,
  onClose,
  onToggleBlock,
}) => {
  const [selectedReason, setSelectedReason] = useState<'temporary' | 'lost' | 'stolen'>('temporary');
  const [confirmStep, setConfirmStep] = useState(false);

  if (!isOpen) return null;

  const handleAction = () => {
    onToggleBlock(card.isBlocked ? undefined : selectedReason);
    setConfirmStep(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-5 animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center ${
                card.isBlocked ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
              }`}
            >
              {card.isBlocked ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">
                {card.isBlocked ? 'Débloquer votre carte' : 'Bloquer votre carte'}
              </h3>
              <p className="text-xs text-zinc-500">
                Carte Visa •••• {card.last4}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content based on state */}
        {card.isBlocked ? (
          /* UNBLOCK VIEW */
          <div className="space-y-4">
            <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-900 leading-relaxed">
                <p className="font-bold">Votre carte est actuellement verrouillée.</p>
                <p className="mt-1 text-rose-700">
                  Toutes les transactions en magasin, distributeur et paiements marchands en ligne sont rejetées.
                </p>
              </div>
            </div>

            <div className="bg-zinc-50 rounded-2xl p-4 space-y-2.5 text-xs text-zinc-600">
              <div className="flex items-center gap-2 font-medium text-zinc-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Déblocage instantané et sécurisé</span>
              </div>
              <div className="flex items-center gap-2 font-medium text-zinc-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Vos plafonds et abonnements autorisés reprendront</span>
              </div>
            </div>

            <button
              onClick={handleAction}
              type="button"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-full font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4 stroke-[2.5]" />
              <span>Débloquer la carte immédiatement</span>
            </button>
          </div>
        ) : (
          /* BLOCK VIEW */
          <div className="space-y-4">
            <p className="text-xs text-zinc-600 leading-relaxed">
              Choisissez le motif de blocage pour protéger vos fonds en cas de doute ou d'anomalie.
            </p>

            <div className="space-y-2.5">
              {/* Option 1: Blocage temporaire */}
              <label
                onClick={() => setSelectedReason('temporary')}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedReason === 'temporary'
                    ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                    : 'border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                <input
                  type="radio"
                  name="blockReason"
                  checked={selectedReason === 'temporary'}
                  onChange={() => setSelectedReason('temporary')}
                  className="mt-1 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-zinc-900 block text-sm">
                    Verrouillage temporaire (Recommandé)
                  </span>
                  <span className="text-zinc-500 block mt-0.5">
                    Bloque instantanément les transactions. Vous pourrez réactiver votre carte en 1 clic quand vous le souhaitez.
                  </span>
                </div>
              </label>

              {/* Option 2: Carte perdue */}
              <label
                onClick={() => setSelectedReason('lost')}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedReason === 'lost'
                    ? 'border-amber-600 bg-amber-50/50 ring-1 ring-amber-600'
                    : 'border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                <input
                  type="radio"
                  name="blockReason"
                  checked={selectedReason === 'lost'}
                  onChange={() => setSelectedReason('lost')}
                  className="mt-1 text-amber-600 focus:ring-amber-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-zinc-900 block text-sm">
                    Carte égarée
                  </span>
                  <span className="text-zinc-500 block mt-0.5">
                    Met la carte en pause en toute sécurité le temps de la retrouver.
                  </span>
                </div>
              </label>

              {/* Option 3: Carte volée */}
              <label
                onClick={() => setSelectedReason('stolen')}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedReason === 'stolen'
                    ? 'border-rose-600 bg-rose-50/50 ring-1 ring-rose-600'
                    : 'border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                <input
                  type="radio"
                  name="blockReason"
                  checked={selectedReason === 'stolen'}
                  onChange={() => setSelectedReason('stolen')}
                  className="mt-1 text-rose-600 focus:ring-rose-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-rose-900 block text-sm">
                    Carte volée ou piratée
                  </span>
                  <span className="text-rose-700 block mt-0.5">
                    Opposition immédiate et proposition de commande d'une nouvelle carte sécurisée.
                  </span>
                </div>
              </label>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-zinc-500 bg-zinc-50 p-2.5 rounded-xl">
              <Shield className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Garantie protection zéro responsabilité Djamo & Visa</span>
            </div>

            <button
              onClick={handleAction}
              type="button"
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white rounded-full font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4 stroke-[2.5]" />
              <span>Confirmer le blocage</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
