import React, { useState } from 'react';
import { X, ArrowRightLeft, TrendingUp, Info } from 'lucide-react';
import { currencyExchangeRates } from '../../data/mockData';

interface CurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
}

export const CurrencyModal: React.FC<CurrencyModalProps> = ({
  isOpen,
  onClose,
  currentBalance,
}) => {
  const [cfaAmount, setCfaAmount] = useState<number>(currentBalance || 20000);
  const [targetCurrency, setTargetCurrency] = useState<string>('EUR');

  if (!isOpen) return null;

  const selectedRate = currencyExchangeRates.find((c) => c.code === targetCurrency) || currencyExchangeRates[0];
  const convertedValue = (cfaAmount * selectedRate.rate).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-5 animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 leading-tight">
                Taux de change & Devises
              </h3>
              <p className="text-xs text-zinc-500">
                Paiements internationaux au taux Visa
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

        {/* Currency Converter Calculator */}
        <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200/80 space-y-3">
          <span className="text-xs font-bold text-zinc-700 block">
            Simulateur de conversion
          </span>

          <div className="grid grid-cols-2 gap-3 items-center">
            {/* CFA Input */}
            <div>
              <label className="text-[10px] text-zinc-400 font-semibold block mb-1">
                Montant en FCFA
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={cfaAmount}
                  onChange={(e) => setCfaAmount(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white border border-zinc-300 font-bold text-sm p-2.5 rounded-xl pr-8 focus:border-indigo-600 focus:outline-none"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">
                  F
                </span>
              </div>
            </div>

            {/* Target currency output */}
            <div>
              <label className="text-[10px] text-zinc-400 font-semibold block mb-1">
                Équivalent en {selectedRate.code}
              </label>
              <div className="bg-white border border-zinc-200 font-bold text-sm p-2.5 rounded-xl flex items-center justify-between text-indigo-700">
                <span>{convertedValue}</span>
                <span className="text-xs font-bold">{selectedRate.symbol}</span>
              </div>
            </div>
          </div>

          {/* Quick Currency Selectors */}
          <div className="flex gap-1.5 pt-1 overflow-x-auto no-scrollbar">
            {currencyExchangeRates.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => setTargetCurrency(c.code)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                  targetCurrency === c.code
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.code}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Exchange Rates List */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-zinc-800 block">
            Taux de référence Visa en direct
          </span>
          <div className="space-y-1.5 max-h-44 overflow-y-auto no-scrollbar">
            {currencyExchangeRates.map((c) => (
              <div
                key={c.code}
                className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{c.flag}</span>
                  <div>
                    <span className="font-bold text-zinc-900">{c.name}</span>
                    <span className="text-[10px] text-zinc-400 ml-1.5">({c.code})</span>
                  </div>
                </div>
                <span className="font-mono text-zinc-700 font-semibold">{c.fixedRate}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-2 text-xs text-emerald-900">
          <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            Aucun frais de change caché. Djamo applique directement le taux officiel interbancaire Visa.
          </span>
        </div>

        <button
          onClick={onClose}
          type="button"
          className="w-full py-3 bg-zinc-900 hover:bg-black text-white rounded-full text-xs font-bold active:scale-95 transition-all"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};
