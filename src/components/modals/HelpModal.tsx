import React, { useState } from 'react';
import { X, Headphones, MessageSquare, Phone, HelpCircle, ChevronRight, ShieldAlert } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmergencyBlock: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  onClose,
  onEmergencyBlock,
}) => {
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);

  if (!isOpen) return null;

  const faqs = [
    {
      q: 'Comment bloquer ma carte en urgence ?',
      a: 'Cliquez sur l\'icône "Bloquer" depuis l\'écran principal de votre carte. Le blocage est immédiat et stoppe toute tentative de paiement.',
    },
    {
      q: 'Comment fonctionne le blocage des marchands ?',
      a: 'Le blocage des marchands rejette instantanément les tentatives de prélèvement d\'abonnements ou de sites comme Netflix, Google, Apple sans impacter le reste de votre carte.',
    },
    {
      q: 'Quels sont les plafonds de paiement par défaut ?',
      a: 'Par défaut, votre plafond mensuel de paiement est de 500.000 F CFA et votre plafond DAB hebdomadaire est de 200.000 F CFA. Vous pouvez les ajuster dans Paramètres.',
    },
    {
      q: 'Que faire en cas de prélèvement frauduleux ?',
      a: 'Bloquez immédiatement votre carte puis contactez le support Djamo via le chat ci-dessous pour une prise en charge prioritaire.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-4 animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Headphones className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 leading-tight">
                Centre d'assistance
              </h3>
              <p className="text-xs text-zinc-500">
                Support client Djamo 7j/7
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

        {/* Emergency Card Block Button */}
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <span className="text-xs font-bold text-rose-900 block">
                Urgence : Carte perdue ou volée ?
              </span>
              <span className="text-[11px] text-rose-700">
                Verrouillez la carte immédiatement
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
              onEmergencyBlock();
            }}
            type="button"
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95"
          >
            Bloquer
          </button>
        </div>

        {/* Support Channels */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => alert("Ouverture du chat d'assistance Djamo en direct...")}
            className="p-3 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 rounded-2xl flex flex-col items-center text-center gap-1.5 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-zinc-900">Chat direct</span>
            <span className="text-[10px] text-zinc-500">Réponse en ~5 min</span>
          </button>

          <button
            onClick={() => alert("Ligne d'assistance téléphonique Djamo : +225 25 20 00 00 00")}
            className="p-3 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 rounded-2xl flex flex-col items-center text-center gap-1.5 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-zinc-900">Appel d'urgence</span>
            <span className="text-[10px] text-zinc-500">Numéro gratuit 24/7</span>
          </button>
        </div>

        {/* FAQs */}
        <div className="space-y-1.5 pt-1">
          <span className="text-xs font-bold text-zinc-800 block mb-1">
            Questions fréquentes
          </span>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedFaq(selectedFaq === idx ? null : idx)}
              className="p-3 bg-zinc-50 rounded-xl text-xs cursor-pointer hover:bg-zinc-100/80 transition-colors"
            >
              <div className="flex items-center justify-between font-bold text-zinc-900">
                <span>{faq.q}</span>
                <ChevronRight
                  className={`w-4 h-4 text-zinc-400 transition-transform ${
                    selectedFaq === idx ? 'rotate-90 text-zinc-700' : ''
                  }`}
                />
              </div>
              {selectedFaq === idx && (
                <p className="mt-2 text-zinc-600 leading-relaxed text-[11px] border-t border-zinc-200/60 pt-2">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
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
