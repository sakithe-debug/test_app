import React, { useState } from 'react';
import { X, CalendarCheck, ShieldCheck, Check } from 'lucide-react';
import { AutoRechargeConfig } from '../../types/card';

interface AutoRechargeModalProps {
  config: AutoRechargeConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newConfig: AutoRechargeConfig) => void;
}

export const AutoRechargeModal: React.FC<AutoRechargeModalProps> = ({
  config,
  isOpen,
  onClose,
  onSave,
}) => {
  const [enabled, setEnabled] = useState(config.enabled);
  const [minBalance, setMinBalance] = useState(config.minimumBalance);
  const [topUpAmount, setTopUpAmount] = useState(config.topUpAmount);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      ...config,
      enabled,
      minimumBalance: minBalance,
      topUpAmount,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-5 animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 leading-tight">
                Rechargement automatique
              </h3>
              <p className="text-xs text-zinc-500">
                Ne soyez jamais à court sur votre carte
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Master Switch */}
        <div className="p-3.5 bg-zinc-50 border border-zinc-200/80 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-zinc-900 block">
              Activer le rechargement automatique
            </span>
            <span className="text-[11px] text-zinc-500">
              Recharge depuis votre Compte Principal Djamo
            </span>
          </div>
          <button
            type="button"
            onClick={() => setEnabled(!enabled)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
              enabled ? 'bg-emerald-600 justify-end' : 'bg-zinc-300 justify-start'
            }`}
          >
            <div className="bg-white w-4 h-4 rounded-full shadow-md" />
          </button>
        </div>

        {/* Configurations */}
        <div className={`space-y-4 ${enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
          <div>
            <label className="text-xs font-bold text-zinc-700 block mb-1">
              Quand mon solde descend en dessous de :
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[5000, 10000, 20000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setMinBalance(val)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    minBalance === val
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                      : 'bg-white border-zinc-200 text-zinc-700'
                  }`}
                >
                  {new Intl.NumberFormat('de-DE').format(val)} F
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-700 block mb-1">
              Recharger automatiquement du montant de :
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[15000, 25000, 50000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setTopUpAmount(val)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    topUpAmount === val
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-800'
                      : 'bg-white border-zinc-200 text-zinc-700'
                  }`}
                >
                  {new Intl.NumberFormat('de-DE').format(val)} F
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-3 bg-zinc-50 rounded-xl flex items-start gap-2 text-xs text-zinc-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            Recharge gratuite, sans frais de transfert. Annulable à tout moment.
          </span>
        </div>

        <button
          onClick={handleSave}
          type="button"
          className="w-full py-3.5 bg-zinc-900 hover:bg-black text-white rounded-full text-xs font-bold shadow-md active:scale-95 transition-all"
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
};
