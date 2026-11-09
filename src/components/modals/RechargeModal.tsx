import React, { useState } from 'react';
import { X, Plus, CreditCard, ArrowDownLeft, ArrowUpRight, Check } from 'lucide-react';

interface RechargeModalProps {
  mode: 'recharge' | 'withdraw';
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  onConfirm: (amount: number, source: string) => void;
}

export const RechargeModal: React.FC<RechargeModalProps> = ({
  mode,
  isOpen,
  onClose,
  currentBalance,
  onConfirm,
}) => {
  const [amount, setAmount] = useState<number>(mode === 'recharge' ? 10000 : 5000);
  const [selectedMethod, setSelectedMethod] = useState<string>('compte_principal');

  if (!isOpen) return null;

  const isRecharge = mode === 'recharge';

  const quickAmounts = isRecharge ? [5000, 10000, 25000, 50000] : [5000, 10000, 15000, 20000];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;
    if (!isRecharge && amount > currentBalance) {
      alert('Solde insuffisant pour ce montant');
      return;
    }
    onConfirm(amount, selectedMethod);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-5 animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isRecharge ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'
              }`}
            >
              {isRecharge ? (
                <ArrowDownLeft className="w-5 h-5 stroke-[2.5]" />
              ) : (
                <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 leading-tight">
                {isRecharge ? 'Recharger votre carte' : 'Retirer vers Principal'}
              </h3>
              <p className="text-xs text-zinc-500">
                Solde actuel : {new Intl.NumberFormat('de-DE').format(currentBalance)} F CFA
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

        {/* Amount Input */}
        <div>
          <label className="text-xs font-bold text-zinc-700 block mb-1">
            Montant en Franc CFA
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-zinc-50 border border-zinc-300 font-extrabold text-2xl p-3 rounded-2xl pr-12 focus:bg-white focus:border-indigo-600 focus:outline-none"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400">
              F CFA
            </span>
          </div>

          {/* Quick Amounts */}
          <div className="grid grid-cols-4 gap-2 mt-2.5">
            {quickAmounts.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setAmount(val)}
                className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                  amount === val
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {new Intl.NumberFormat('de-DE').format(val)} F
              </button>
            ))}
          </div>
        </div>

        {/* Source / Destination Selector */}
        <div>
          <label className="text-xs font-bold text-zinc-700 block mb-2">
            {isRecharge ? 'Moyen de rechargement' : 'Destination des fonds'}
          </label>

          <div className="space-y-2">
            {[
              { id: 'compte_principal', name: 'Compte Principal Djamo', fee: 'Gratuit • Instantané', badge: 'd' },
              { id: 'wave', name: 'Wave Mobile Money', fee: '1% de frais', badge: 'W' },
              { id: 'orange_money', name: 'Orange Money Côte d\'Ivoire', fee: 'Frais réseau habituels', badge: 'OM' },
              { id: 'mtn_momo', name: 'MTN Mobile Money', fee: 'Frais réseau habituels', badge: 'MTN' },
            ].map((method) => (
              <label
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                  selectedMethod === method.id
                    ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600'
                    : 'border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
                    {method.badge}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-900 block">{method.name}</span>
                    <span className="text-[10px] text-zinc-500">{method.fee}</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={selectedMethod === method.id}
                  onChange={() => setSelectedMethod(method.id)}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Submit CTA */}
        <button
          onClick={handleSubmit}
          type="button"
          className={`w-full py-3.5 rounded-full font-bold text-sm shadow-md active:scale-95 transition-all text-white ${
            isRecharge ? 'bg-[#3347F5] hover:bg-[#2539e6]' : 'bg-zinc-900 hover:bg-black'
          }`}
        >
          {isRecharge ? 'Recharger maintenant' : 'Confirmer le retrait'}
        </button>
      </div>
    </div>
  );
};
