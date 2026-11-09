import React from 'react';
import { Eye, EyeOff, Plus, CreditCard } from 'lucide-react';

interface BalanceCardProps {
  balance: number;
  currency: string;
  isBalanceVisible: boolean;
  onToggleBalanceVisibility: () => void;
  onRecharge: () => void;
  onWithdraw: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  balance,
  currency,
  isBalanceVisible,
  onToggleBalanceVisibility,
  onRecharge,
  onWithdraw,
}) => {
  // Format number to Côte d'Ivoire / French monetary standard (e.g. "20.000 F")
  const formattedBalance = new Intl.NumberFormat('de-DE').format(balance);

  return (
    <div className="mx-4 bg-white rounded-2xl p-4 shadow-sm border border-zinc-100 relative z-10 transition-all">
      {/* Title with visibility eye */}
      <div className="flex items-center gap-2 text-zinc-500 text-sm font-semibold mb-1">
        <span>Carte</span>
        <button
          onClick={onToggleBalanceVisibility}
          aria-label={isBalanceVisible ? 'Masquer le solde' : 'Afficher le solde'}
          className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 active:scale-95 transition-all"
        >
          {isBalanceVisible ? (
            <EyeOff className="w-4 h-4 stroke-[2]" />
          ) : (
            <Eye className="w-4 h-4 stroke-[2]" />
          )}
        </button>
      </div>

      {/* Balance Amount */}
      <div className="mb-4">
        {isBalanceVisible ? (
          <div className="text-3xl font-extrabold tracking-tight text-zinc-900">
            {formattedBalance} <span className="font-bold text-2xl">{currency}</span>
          </div>
        ) : (
          <div className="text-3xl font-extrabold tracking-widest text-zinc-900 select-none">
            •••••• <span className="font-bold text-2xl">{currency}</span>
          </div>
        )}
      </div>

      {/* Action Buttons: Recharger & Retirer */}
      <div className="grid grid-cols-2 gap-3">
        {/* Recharger button */}
        <button
          onClick={onRecharge}
          type="button"
          className="flex items-center justify-center gap-2 bg-[#3347F5] hover:bg-[#2539e6] active:scale-[0.98] text-white py-2.5 px-4 rounded-full font-semibold text-sm shadow-sm transition-all"
        >
          <div className="w-5 h-5 rounded-full bg-[#EAB308] text-[#1A1C20] flex items-center justify-center font-black text-xs leading-none">
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span>Recharger</span>
        </button>

        {/* Retirer button */}
        <button
          onClick={onWithdraw}
          type="button"
          className="flex items-center justify-center gap-2 bg-white hover:bg-zinc-50 active:scale-[0.98] text-zinc-800 border border-zinc-200 py-2.5 px-4 rounded-full font-semibold text-sm transition-all"
        >
          <div className="w-5 h-5 rounded-sm bg-gradient-to-r from-amber-400 to-amber-500 text-white flex items-center justify-center text-[10px]">
            <CreditCard className="w-3.5 h-3.5 text-zinc-900 stroke-[2.5]" />
          </div>
          <span>Retirer</span>
        </button>
      </div>
    </div>
  );
};
