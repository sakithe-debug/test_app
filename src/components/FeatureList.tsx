import React from 'react';
import { Ban, CalendarCheck, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Merchant, AutoRechargeConfig } from '../types/card';

interface FeatureListProps {
  merchants: Merchant[];
  autoRecharge: AutoRechargeConfig;
  onOpenMerchantBlocker: () => void;
  onOpenAutoRecharge: () => void;
}

export const FeatureList: React.FC<FeatureListProps> = ({
  merchants,
  autoRecharge,
  onOpenMerchantBlocker,
  onOpenAutoRecharge,
}) => {
  const blockedMerchants = merchants.filter((m) => m.isBlocked);
  const blockedNames = blockedMerchants.slice(0, 5).map((m) => m.name).join(', ');

  const formatAmount = (val: number) => new Intl.NumberFormat('de-DE').format(val);

  return (
    <div className="px-4 py-2 space-y-2.5">
      {/* 1. Bloquer les paiements marchands */}
      <button
        onClick={onOpenMerchantBlocker}
        type="button"
        className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white hover:bg-zinc-50 border border-zinc-100 shadow-xs active:scale-[0.99] transition-all text-left group"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-full bg-[#E8EBFF] flex items-center justify-center shrink-0 text-rose-500 relative">
            <Ban className="w-6 h-6 stroke-[2.2] text-rose-600" />
            {blockedMerchants.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-xs">
                {blockedMerchants.length}
              </span>
            )}
          </div>
          <div className="min-w-0 pr-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors">
                Bloquer les paiements marchands
              </span>
            </div>
            <p className="text-xs text-zinc-500 truncate mt-0.5 font-normal">
              {blockedMerchants.length > 0
                ? blockedNames
                : 'Aucun marchand bloqué (autorisés)'}
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-zinc-700 transition-colors shrink-0" />
      </button>

      {/* 2. Rechargement automatique */}
      <button
        onClick={onOpenAutoRecharge}
        type="button"
        className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white hover:bg-zinc-50 border border-zinc-100 shadow-xs active:scale-[0.99] transition-all text-left group"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-600">
            <CalendarCheck className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="min-w-0 pr-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-zinc-900 group-hover:text-emerald-700 transition-colors">
                Rechargement automatique
              </span>
              {autoRecharge.enabled && (
                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Actif
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 truncate mt-0.5 font-normal">
              Solde minimum {formatAmount(autoRecharge.minimumBalance)} F
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-zinc-700 transition-colors shrink-0" />
      </button>
    </div>
  );
};
