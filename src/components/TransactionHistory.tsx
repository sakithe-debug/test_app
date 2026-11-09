import React, { useState } from 'react';
import { ChevronRight, ArrowUpRight, ArrowDownLeft, Ban, Check, X } from 'lucide-react';
import { Transaction } from '../types/card';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onAddSimulatedTransaction?: () => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const formatAmount = (val: number) => new Intl.NumberFormat('de-DE').format(Math.abs(val));

  return (
    <div className="px-4 pt-3 pb-8">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
          Activités récentes
        </h3>
        <span className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer">
          Voir tout
        </span>
      </div>

      <div className="space-y-2">
        {transactions.map((tx) => {
          const isPositive = tx.amount > 0;
          const isBlocked = tx.status === 'blocked';

          return (
            <div
              key={tx.id}
              onClick={() => setSelectedTx(tx)}
              className="flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-zinc-50 border border-zinc-100 shadow-xs cursor-pointer active:scale-[0.99] transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Djamo black circular logo or custom icon */}
                {tx.type === 'transfer' ? (
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                    <span className="font-serif italic text-base">d</span>
                  </div>
                ) : isBlocked ? (
                  <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <Ban className="w-5 h-5 stroke-[2.2]" />
                  </div>
                ) : isPositive ? (
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <ArrowDownLeft className="w-5 h-5 stroke-[2.5]" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-700 flex items-center justify-center shrink-0">
                    <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                  </div>
                )}

                <div className="min-w-0">
                  <span className="text-sm font-bold text-zinc-900 block truncate">
                    {tx.title}
                  </span>
                  <span className="text-[11px] text-zinc-500 block truncate">
                    {tx.date}
                  </span>
                </div>
              </div>

              {/* Amount badge or text */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right">
                  {isPositive ? (
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-[#DCFCE7] text-[#15803D] text-xs font-bold tracking-tight">
                      +{formatAmount(tx.amount)} {tx.currency}
                    </span>
                  ) : isBlocked ? (
                    <span className="inline-block px-2 py-0.5 rounded-lg bg-rose-50 text-rose-600 text-xs font-bold line-through">
                      {formatAmount(tx.amount)} {tx.currency}
                    </span>
                  ) : (
                    <span className="text-sm font-bold text-zinc-900">
                      -{formatAmount(tx.amount)} {tx.currency}
                    </span>
                  )}
                  {isBlocked && (
                    <span className="block text-[10px] text-rose-500 font-semibold text-right">
                      Rejeté (bloqué)
                    </span>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <h4 className="text-base font-bold text-zinc-900">Détails de la transaction</h4>
              <button
                onClick={() => setSelectedTx(null)}
                className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center py-2">
              <div
                className={`text-2xl font-extrabold ${
                  selectedTx.status === 'blocked'
                    ? 'text-rose-600'
                    : selectedTx.amount > 0
                    ? 'text-emerald-600'
                    : 'text-zinc-900'
                }`}
              >
                {selectedTx.amount > 0 ? '+' : ''}
                {formatAmount(selectedTx.amount)} {selectedTx.currency}
              </div>
              <span className="text-xs text-zinc-500 font-medium block mt-1">
                {selectedTx.title}
              </span>
              {selectedTx.subtitle && (
                <span className="text-[11px] text-zinc-400 block mt-0.5">
                  {selectedTx.subtitle}
                </span>
              )}
            </div>

            <div className="space-y-2.5 bg-zinc-50 p-3.5 rounded-2xl text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Statut</span>
                <span
                  className={`font-bold flex items-center gap-1 ${
                    selectedTx.status === 'completed' ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {selectedTx.status === 'completed' ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Réussi
                    </>
                  ) : (
                    <>
                      <Ban className="w-3.5 h-3.5 stroke-[3]" /> Rejeté (Bloqué)
                    </>
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Date et heure</span>
                <span className="font-semibold text-zinc-800">{selectedTx.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Référence</span>
                <span className="font-mono text-zinc-700 font-semibold">{selectedTx.reference || 'DJM-98314920'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Frais de transaction</span>
                <span className="font-semibold text-emerald-600">0 F CFA (Gratuit)</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedTx(null)}
              className="w-full py-3 bg-zinc-900 text-white rounded-full font-bold text-sm hover:bg-zinc-800 active:scale-95 transition-all"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
